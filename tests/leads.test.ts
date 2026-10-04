import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { buildZohoFormBody, parseFieldMap } from "@/lib/leads/adapters/zoho-forms";
import { toZohoLead } from "@/lib/leads/adapters/zoho-crm";
import { leadSchema, toLeadRecord } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/service";
import type { LeadAdapter } from "@/lib/leads/types";

const valid = { name: "Ananya Rao Kulkarni", mobile: "098765 43210", consent: true, intent: "visit" as const, preferredTime: "This weekend" as const };

describe("leadSchema", () => {
  it("normalises Indian mobiles to +91XXXXXXXXXX", () => {
    for (const m of ["9876543210", "+91 98765 43210", "09876543210", "91-9876543210"]) {
      expect(leadSchema.parse({ ...valid, mobile: m }).mobile).toBe("+919876543210");
    }
  });
  it("rejects invalid mobiles", () => {
    for (const m of ["12345", "5876543210", "98765432101"]) expect(leadSchema.safeParse({ ...valid, mobile: m }).success).toBe(false);
  });
  it("requires consent", () => {
    expect(leadSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
  it("treats empty email as absent and validates real ones", () => {
    expect(leadSchema.parse({ ...valid, email: "" }).email).toBeUndefined();
    expect(leadSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
  it("strips markup/control characters", () => {
    expect(leadSchema.parse({ ...valid, name: "<b>Ravi</b>\u0007 Shah" }).name).toBe("bRavi/b Shah");
  });
  it("flags the honeypot", () => {
    const r = leadSchema.safeParse({ ...valid, website: "http://spam" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]?.path[0]).toBe("website");
  });
});

describe("toLeadRecord", () => {
  it("splits names for CRM first/last", () => {
    const rec = toLeadRecord(leadSchema.parse(valid), { projectId: "p" });
    expect(rec.firstName).toBe("Ananya Rao");
    expect(rec.lastName).toBe("Kulkarni");
    expect(rec).not.toHaveProperty("website");
  });
  it("uses '-' as last name for single names (Zoho requires Last_Name)", () => {
    const rec = toLeadRecord(leadSchema.parse({ ...valid, name: "Ravi" }), { projectId: "p" });
    expect(rec.lastName).toBe("-");
  });
});

describe("Zoho mapping", () => {
  const rec = toLeadRecord(leadSchema.parse({ ...valid, utmSource: "meta" }), { projectId: "one-racecourse" });
  it("builds a Zoho Forms body from the field map", () => {
    const body = buildZohoFormBody(rec, parseFieldMap('{"firstName":"Name_First","mobile":"PhoneNumber_countrycode","consent":"DecisionBox","utmSource":"SingleLine1","email":"Email"}'));
    expect(body.get("Name_First")).toBe("Ananya Rao");
    expect(body.get("PhoneNumber_countrycode")).toBe("919876543210");
    expect(body.get("DecisionBox")).toBe("true");
    expect(body.get("SingleLine1")).toBe("meta");
    expect(body.has("Email")).toBe(false);
  });
  it("throws on malformed field map", () => {
    expect(() => parseFieldMap("{bad")).toThrow();
  });
  it("maps to Zoho CRM Leads", () => {
    const z = toZohoLead(rec);
    expect(z.Last_Name).toBe("Kulkarni");
    expect(z.Mobile).toBe("+919876543210");
    expect(z.Description).toContain("Intent: visit");
  });
});

describe("submitLead chain", () => {
  const rec = toLeadRecord(leadSchema.parse(valid), { projectId: "p" });
  const adapter = (name: string, impl: LeadAdapter["submit"]): LeadAdapter => ({ name, isConfigured: () => true, submit: impl });

  it("falls through to the next adapter on failure", async () => {
    const first = vi.fn(async () => ({ ok: false as const, adapter: "a", error: "400", retryable: false }));
    const second = vi.fn(async () => ({ ok: true as const, adapter: "b" }));
    const r = await submitLead(rec, [adapter("a", first), adapter("b", second)]);
    expect(r).toEqual({ ok: true, adapter: "b" });
    expect(first).toHaveBeenCalledTimes(1);
  });
  it("retries once on retryable errors", async () => {
    const flaky = vi.fn().mockRejectedValueOnce(new Error("timeout")).mockResolvedValueOnce({ ok: true, adapter: "a" });
    const r = await submitLead(rec, [adapter("a", flaky)]);
    expect(r.ok).toBe(true);
    expect(flaky).toHaveBeenCalledTimes(2);
  });
  it("reports failure when every adapter fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await submitLead(rec, [adapter("a", async () => ({ ok: false, adapter: "a", error: "500", retryable: true }))]);
    expect(r.ok).toBe(false);
    spy.mockRestore();
  });
});

describe("ZohoFormsAdapter", () => {
  const rec = toLeadRecord(leadSchema.parse(valid), { projectId: "p" });
  it("is unconfigured for non-Zoho URLs", async () => {
    const { ZohoFormsAdapter } = await import("@/lib/leads/adapters/zoho-forms");
    process.env.ZOHO_FORMS_SUBMIT_URL = "https://evil.example/submit";
    expect(new ZohoFormsAdapter().isConfigured()).toBe(false);
  });
  it("treats Zoho's 302 as success and 5xx as retryable", async () => {
    const { ZohoFormsAdapter } = await import("@/lib/leads/adapters/zoho-forms");
    process.env.ZOHO_FORMS_SUBMIT_URL = "https://forms.zohopublic.in/org/form/Web/formperma/KEY/htmlRecords/submit";
    const a = new ZohoFormsAdapter();
    expect(a.isConfigured()).toBe(true);
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 302 }));
    expect((await a.submit(rec, new AbortController().signal)).ok).toBe(true);
    const [, init] = fetchMock.mock.calls[0]!;
    expect(String(init?.body)).toContain("Name_First=Ananya+Rao");
    fetchMock.mockResolvedValueOnce(new Response("err", { status: 503 }));
    expect(await a.submit(rec, new AbortController().signal)).toMatchObject({ ok: false, retryable: true });
    fetchMock.mockRestore();
  });
});
