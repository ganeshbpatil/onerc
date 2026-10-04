import "server-only";
import { createHash } from "node:crypto";
import type { LeadRecord } from "@/lib/leads/schema";

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

/**
 * Server-side conversions, deduplicated with the browser event via `eventId`.
 * Fire-and-forget: never blocks or fails the lead response.
 */
export async function sendServerConversions(lead: LeadRecord, ctx: { url: string; clientId?: string }) {
  const jobs: Promise<unknown>[] = [];
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (pixel && capiToken) {
    jobs.push(
      fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${capiToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Lead",
              event_time: Math.floor(Date.now() / 1000),
              event_id: lead.eventId,
              action_source: "website",
              event_source_url: ctx.url,
              user_data: {
                ph: [sha256(lead.mobile.replace(/\D/g, ""))],
                em: lead.email ? [sha256(lead.email)] : undefined,
                fn: [sha256(lead.firstName)],
                country: [sha256("in")],
                client_ip_address: lead.ip,
                client_user_agent: lead.userAgent,
                fbc: lead.fbclid ? `fb.1.${Date.now()}.${lead.fbclid}` : undefined,
              },
              custom_data: { lead_intent: lead.intent, content_name: lead.projectId },
            },
          ],
        }),
        signal: AbortSignal.timeout(4000),
      }),
    );
  }
  const ga4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const ga4Secret = process.env.GA4_API_SECRET;
  if (ga4 && ga4Secret && ctx.clientId) {
    jobs.push(
      fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${ga4}&api_secret=${ga4Secret}`, {
        method: "POST",
        body: JSON.stringify({
          client_id: ctx.clientId,
          events: [{ name: "generate_lead", params: { lead_intent: lead.intent, event_id: lead.eventId, value: 1, currency: "INR" } }],
        }),
        signal: AbortSignal.timeout(4000),
      }),
    );
  }
  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === "rejected") console.warn(JSON.stringify({ level: "warn", msg: "conversion.failed", error: String(r.reason) }));
}
