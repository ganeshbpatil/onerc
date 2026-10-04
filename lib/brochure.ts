import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// Falls back to a per-process secret: links then stay valid until the next restart.
const secret = process.env.BROCHURE_SIGNING_SECRET || randomBytes(32).toString("hex");
const TTL_SECONDS = 60 * 60 * 24; // 24h — long enough to reopen from WhatsApp/email

const sign = (exp: number) => createHmac("sha256", secret).update(`brochure:${exp}`).digest("base64url");

/** Signed, expiring link to the gated brochure (or the external BROCHURE_URL if configured). */
export function brochureLink(): string {
  if (process.env.BROCHURE_URL) return process.env.BROCHURE_URL;
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  return `/api/brochure?exp=${exp}&sig=${sign(exp)}`;
}

export function verifyBrochureLink(exp: string | null, sig: string | null): boolean {
  if (!exp || !sig || !/^\d{10}$/.test(exp)) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(Number(exp)));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
