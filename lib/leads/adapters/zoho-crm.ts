import type { LeadRecord } from "../schema";
import type { AdapterResult, LeadAdapter } from "../types";

/** Direct Zoho CRM v8 Leads insert via OAuth refresh token (self client). Fallback path. */
let cached: { token: string; expiresAt: number } | undefined;

async function accessToken(signal: AbortSignal): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });
  const res = await fetch(`${process.env.ZOHO_ACCOUNTS_URL ?? "https://accounts.zoho.in"}/oauth/v2/token`, { method: "POST", body: params, signal });
  const json = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!json.access_token) throw new Error(`Zoho OAuth failed: ${json.error ?? res.status}`);
  cached = { token: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return json.access_token;
}

export function toZohoLead(lead: LeadRecord) {
  return {
    First_Name: lead.firstName,
    Last_Name: lead.lastName,
    Mobile: lead.mobile,
    Email: lead.email,
    Lead_Source: process.env.ZOHO_CRM_LEAD_SOURCE ?? "Website",
    Description: [
      `Intent: ${lead.intent}`,
      lead.preferredTime && `Preferred time: ${lead.preferredTime}`,
      lead.configuration && `Configuration: ${lead.configuration}`,
      `Project: ${lead.projectId}`,
      lead.utmSource && `UTM: ${lead.utmSource}/${lead.utmMedium ?? ""}/${lead.utmCampaign ?? ""}`,
      lead.gclid && `gclid: ${lead.gclid}`,
      lead.fbclid && `fbclid: ${lead.fbclid}`,
      lead.landingPath && `Landing: ${lead.landingPath}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export class ZohoCrmAdapter implements LeadAdapter {
  readonly name = "zoho_crm";
  isConfigured() {
    return Boolean(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN);
  }
  async submit(lead: LeadRecord, signal: AbortSignal): Promise<AdapterResult> {
    const token = await accessToken(signal);
    const res = await fetch(`${process.env.ZOHO_CRM_API_URL ?? "https://www.zohoapis.in/crm/v8"}/Leads`, {
      method: "POST",
      headers: { Authorization: `Zoho-oauthtoken ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ data: [toZohoLead(lead)], trigger: ["workflow", "approval", "blueprint"] }),
      signal,
    });
    const json = (await res.json().catch(() => ({}))) as { data?: { code: string; details?: { id?: string } }[] };
    const row = json.data?.[0];
    if (res.ok && row?.code === "SUCCESS") return { ok: true, adapter: this.name, externalId: row.details?.id };
    return { ok: false, adapter: this.name, error: `HTTP ${res.status} ${row?.code ?? ""}`.trim(), retryable: res.status >= 500 || res.status === 429 };
  }
}
