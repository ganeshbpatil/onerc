/**
 * Fixed-window in-memory limiter. Correct for a single PM2 fork process.
 * In PM2 cluster mode each worker has its own window; NGINX `limit_req` (deploy/nginx.conf)
 * is the authoritative edge limit. Swap for Redis if you scale horizontally.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 5), windowMs = 60_000) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    return { ok: true, remaining: limit - 1 };
  }
  entry.count++;
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count), retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
}
