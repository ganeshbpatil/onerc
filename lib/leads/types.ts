import type { LeadRecord } from "./schema";

export type AdapterResult = { ok: true; adapter: string; externalId?: string } | { ok: false; adapter: string; error: string; retryable: boolean };

export interface LeadAdapter {
  readonly name: string;
  /** Returns false when required env is missing, so the chain skips it. */
  isConfigured(): boolean;
  submit(lead: LeadRecord, signal: AbortSignal): Promise<AdapterResult>;
}
