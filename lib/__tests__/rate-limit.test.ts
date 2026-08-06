import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  resetRateLimit,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/rate-limit";

const T0 = 1_000_000;

beforeEach(() => resetRateLimit());

describe("checkRateLimit", () => {
  it("allows requests up to the limit", () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect(checkRateLimit("1.1.1.1", T0).ok).toBe(true);
    }
  });

  it("rejects the request past the limit with a retry hint", () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit("1.1.1.1", T0);
    const result = checkRateLimit("1.1.1.1", T0);
    expect(result.ok).toBe(false);
    expect(result.retryAfterSec).toBeGreaterThan(0);
  });

  it("tracks each IP independently", () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit("1.1.1.1", T0);
    expect(checkRateLimit("2.2.2.2", T0).ok).toBe(true);
  });

  it("allows again once the window has passed", () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit("1.1.1.1", T0);
    expect(checkRateLimit("1.1.1.1", T0 + RATE_LIMIT_WINDOW_MS + 1).ok).toBe(true);
  });
});
