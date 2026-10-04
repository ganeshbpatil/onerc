import { after, NextResponse, type NextRequest } from "next/server";
import { sendServerConversions } from "@/lib/analytics/server";
import { brochureLink } from "@/lib/brochure";
import { leadSchema, toLeadRecord } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/service";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MIN_FILL_MS = 2500;

function clientIp(req: NextRequest) {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** CSRF: JSON-only + same-origin check (browsers always send Origin on cross-site POST). */
function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("application/json") || !sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  const ip = clientIp(req);
  const limit = rateLimit(`lead:${ip}`);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please call us instead." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key === "website") return NextResponse.json({ ok: true }); // honeypot: pretend success
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields", fieldErrors }, { status: 422 });
  }
  if (parsed.data.startedAt && Date.now() - parsed.data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true }); // bot-speed submit: silently drop
  }

  const record = toLeadRecord(parsed.data, {
    projectId: process.env.CRM_PROJECT_ID ?? "one-racecourse",
    ip,
    userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? undefined,
  });
  const result = await submitLead(record);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "We couldn't submit right now. Please call or WhatsApp us." }, { status: 502 });
  }

  const clientId = req.cookies.get("_ga")?.value.split(".").slice(-2).join(".");
  after(() => sendServerConversions(record, { url: req.headers.get("referer") ?? "", clientId }));

  const brochureUrl = record.intent === "brochure" || record.intent === "price" ? brochureLink() : undefined;
  return NextResponse.json({ ok: true, brochureUrl });
}
