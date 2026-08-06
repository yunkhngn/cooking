import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/gemini", () => ({
  startMenuStream: vi.fn(),
}));

import { POST } from "@/app/api/generate/route";
import { startMenuStream } from "@/lib/gemini";
import { resetRateLimit, RATE_LIMIT_MAX } from "@/lib/rate-limit";

const validBody = {
  people: 2,
  budget: 150000,
  cuisine: "vietnamese",
  maxCookTime: 30,
};

function makeRequest(body: unknown, ip = "9.9.9.9") {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

async function* fakeStream() {
  yield '{"menuName":"Bữa tối"';
  yield ',"dishes":[]}';
}

beforeEach(() => {
  resetRateLimit();
  vi.mocked(startMenuStream).mockReset();
});

describe("POST /api/generate", () => {
  it("returns 400 for an invalid body", async () => {
    const res = await POST(makeRequest({ people: 0 }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a non-JSON body", async () => {
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" },
      body: "not json",
    });
    expect((await POST(req)).status).toBe(400);
  });

  it("streams text on the happy path", async () => {
    vi.mocked(startMenuStream).mockResolvedValue(fakeStream());
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('{"menuName":"Bữa tối","dishes":[]}');
  });

  it("returns 429 once the rate limit is exhausted", async () => {
    vi.mocked(startMenuStream).mockImplementation(async () => fakeStream());
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      await POST(makeRequest(validBody, "5.5.5.5"));
    }
    const res = await POST(makeRequest(validBody, "5.5.5.5"));
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBeTruthy();
  });

  // The handshake rejects — a REJECTED PROMISE, not a synchronous throw.
  // Mocking this as a plain throwing function would pass against a broken
  // implementation, because calling an async generator never throws.
  it("returns 502 with a Vietnamese message when the handshake fails", async () => {
    vi.mocked(startMenuStream).mockRejectedValue(new Error("upstream down"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toMatch(/AI/);
  });

  it("does not return a well-formed 200 when the stream fails mid-flight", async () => {
    vi.mocked(startMenuStream).mockResolvedValue(
      (async function* () {
        yield '{"menuName":"Bữa tối"';
        throw new Error("connection dropped");
      })(),
    );
    const res = await POST(makeRequest(validBody));
    // Headers are already sent, so the status is 200 — the body must fail
    // rather than resolve to a truncated but well-formed menu.
    await expect(res.text()).rejects.toThrow();
  });
});
