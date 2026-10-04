import type { LeadRecord } from "../schema";
import type { AdapterResult, LeadAdapter } from "../types";

/**
 * Posts to a Zoho Forms "HTML embed" endpoint server-side. Zoho Forms then owns
 * the native Zoho CRM integration (Leads module), assignment rules, notifications
 * and auto-responders — so sales ops can change routing without a deploy.
 *
 * Zoho side requirements:
 *  - Form → Settings → disable Zoho's own CAPTCHA (abuse protection happens here).
 *  - Field link names must match ZOHO_FORMS_FIELD_MAP.
 */
type FieldKey = keyof LeadRecord;

const DEFAULT_MAP: Partial<Record<FieldKey, string>> = {
  firstName: "Name_First",
  lastName: "Name_Last",
  mobile: "PhoneNumber_countrycode",
  email: "Email",
};

export function parseFieldMap(raw: string | undefined): Partial<Record<FieldKey, string>> {
  if (!raw) return DEFAULT_MAP;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<Record<FieldKey, string>> = {};
    for (const [k, v] of Object.entries(parsed)) if (typeof v === "string" && v) out[k as FieldKey] = v;
    return out;
  } catch {
    throw new Error("ZOHO_FORMS_FIELD_MAP is not valid JSON");
  }
}

export function buildZohoFormBody(lead: LeadRecord, map: Partial<Record<FieldKey, string>>): URLSearchParams {
  const body = new URLSearchParams();
  // hidden fields Zoho's embed code expects
  body.set("zf_referrer_name", "");
  body.set("zf_redirect_url", "");
  body.set("zc_gad", "");
  for (const [key, zohoField] of Object.entries(map) as [FieldKey, string][]) {
    const value = lead[key];
    if (value === undefined || value === null || value === "") continue;
    if (key === "consent") body.set(zohoField, value ? "true" : "false");
    else if (key === "mobile") body.set(zohoField, String(value).replace(/^\+/, ""));
    else body.set(zohoField, String(value));
  }
  return body;
}

export class ZohoFormsAdapter implements LeadAdapter {
  readonly name = "zoho_forms";
  private url = process.env.ZOHO_FORMS_SUBMIT_URL;

  isConfigured() {
    return Boolean(this.url && /^https:\/\/forms\.zohopublic\.(in|com|eu|com\.au|jp)\//.test(this.url));
  }

  async submit(lead: LeadRecord, signal: AbortSignal): Promise<AdapterResult> {
    const body = buildZohoFormBody(lead, parseFieldMap(process.env.ZOHO_FORMS_FIELD_MAP));
    const res = await fetch(this.url!, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      redirect: "manual", // Zoho answers a successful submit with a 302 to its thank-you page
      signal,
    });
    if (res.status >= 200 && res.status < 400) return { ok: true, adapter: this.name };
    return { ok: false, adapter: this.name, error: `HTTP ${res.status}`, retryable: res.status >= 500 || res.status === 429 };
  }
}
