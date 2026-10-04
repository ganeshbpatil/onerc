import type { LeadRecord } from "../schema";
import type { AdapterResult, LeadAdapter } from "../types";

/**
 * Last-resort sink: writes a structured line to stdout (captured by PM2 logs) so
 * no lead is lost if every upstream is down. PII is masked except what sales needs
 * to call back; rotate PM2 logs and restrict access (docs/05).
 */
export class LogAdapter implements LeadAdapter {
  readonly name = "log";
  isConfigured() {
    return true;
  }
  async submit(lead: LeadRecord): Promise<AdapterResult> {
    console.log(JSON.stringify({ level: "warn", msg: "lead.fallback", lead: { ...lead, ip: undefined, userAgent: undefined } }));
    return { ok: true, adapter: this.name };
  }
}
