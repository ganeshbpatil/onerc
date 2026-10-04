import { createHmac } from "node:crypto";
import type { LeadRecord } from "../schema";
import type { AdapterResult, LeadAdapter } from "../types";

/** Generic signed webhook (n8n / Make / Zapier / SAP middleware). Header: X-Signature: sha256=<hex>. */
export class WebhookAdapter implements LeadAdapter {
  readonly name = "webhook";
  isConfigured() {
    return Boolean(process.env.LEAD_WEBHOOK_URL);
  }
  async submit(lead: LeadRecord, signal: AbortSignal): Promise<AdapterResult> {
    const body = JSON.stringify({ type: "lead.created", data: lead });
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.LEAD_WEBHOOK_SECRET) {
      headers["X-Signature"] = `sha256=${createHmac("sha256", process.env.LEAD_WEBHOOK_SECRET).update(body).digest("hex")}`;
    }
    const res = await fetch(process.env.LEAD_WEBHOOK_URL!, { method: "POST", headers, body, signal });
    return res.ok ? { ok: true, adapter: this.name } : { ok: false, adapter: this.name, error: `HTTP ${res.status}`, retryable: res.status >= 500 };
  }
}
