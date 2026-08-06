export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Best-effort in-memory sliding window.
 *
 * KNOWN LIMITATION: on serverless this resets on cold start and is not
 * shared across instances. It deters casual abuse of a public endpoint
 * that spends a real API budget; it does not stop a determined script.
 * Durable protection needs a shared store or a platform WAF (spec §9).
 */
const hits = new Map<string, number[]>();

export function checkRateLimit(
  ip: string,
  now: number = Date.now(),
): { ok: boolean; retryAfterSec: number } {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const recent = (hits.get(ip) ?? []).filter((t) => t > cutoff);

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    const oldest = recent[0];
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000),
    );
    return { ok: false, retryAfterSec };
  }

  recent.push(now);
  hits.set(ip, recent);
  return { ok: true, retryAfterSec: 0 };
}

export function resetRateLimit(): void {
  hits.clear();
}
