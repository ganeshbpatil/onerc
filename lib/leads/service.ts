import "server-only";
import { LogAdapter } from "./adapters/log";
import { WebhookAdapter } from "./adapters/webhook";
import { ZohoCrmAdapter } from "./adapters/zoho-crm";
import { ZohoFormsAdapter } from "./adapters/zoho-forms";
import type { LeadRecord } from "./schema";
import type { AdapterResult, LeadAdapter } from "./types";

const registry: Record<string, () => LeadAdapter> = {
  zoho_forms: () => new ZohoFormsAdapter(),
  zoho_crm: () => new ZohoCrmAdapter(),
  webhook: () => new WebhookAdapter(),
  log: () => new LogAdapter(),
};

export function resolveAdapters(spec = process.env.LEAD_ADAPTERS ?? "zoho_forms,log"): LeadAdapter[] {
  return spec
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s in registry)
    .map((s) => registry[s]!())
    .filter((a) => a.isConfigured());
}

const TIMEOUT_MS = 8000;

/** Try each adapter in order with one retry on retryable failures. First success wins. */
export async function submitLead(lead: LeadRecord, adapters = resolveAdapters()): Promise<AdapterResult> {
  const failures: AdapterResult[] = [];
  for (const adapter of adapters) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await adapter.submit(lead, AbortSignal.timeout(TIMEOUT_MS));
        if (result.ok) return result;
        failures.push(result);
        if (!result.retryable) break;
      } catch (err) {
        failures.push({ ok: false, adapter: adapter.name, error: err instanceof Error ? err.message : String(err), retryable: true });
      }
    }
  }
  console.error(JSON.stringify({ level: "error", msg: "lead.all_adapters_failed", failures }));
  return { ok: false, adapter: "none", error: "All lead adapters failed", retryable: true };
}
