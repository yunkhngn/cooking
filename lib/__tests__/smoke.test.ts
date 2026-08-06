import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("runs and has jsdom globals", () => {
    expect(typeof window).toBe("object");
    expect(typeof localStorage).toBe("object");
  });
});
