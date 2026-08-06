import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/gemini", () => ({
  streamMenuText: vi.fn(),
}));

import { POST } from "@/app/api/generate/route";
import { streamMenuText } from "@/lib/gemini";
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
  vi.mocked(streamMenuText).mockReset();
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
    vi.mocked(streamMenuText).mockReturnValue(fakeStream());
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('{"menuName":"Bữa tối","dishes":[]}');
  });

  it("returns 429 once the rate limit is exhausted", async () => {
    vi.mocked(streamMenuText).mockImplementation(() => fakeStream());
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      await POST(makeRequest(validBody, "5.5.5.5"));
    }
    const res = await POST(makeRequest(validBody, "5.5.5.5"));
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBeTruthy();
  });

  it("returns 502 when the model call fails before streaming", async () => {
    vi.mocked(streamMenuText).mockImplementation(() => {
      throw new Error("upstream down");
    });
    expect((await POST(makeRequest(validBody))).status).toBe(502);
  });
});
