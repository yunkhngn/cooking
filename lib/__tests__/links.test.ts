import { describe, it, expect } from "vitest";
import { youtubeSearchUrl, googleSearchUrl } from "@/lib/links";

describe("search links", () => {
  it("builds a YouTube search URL, never a video URL", () => {
    const url = youtubeSearchUrl("Thịt kho trứng");
    expect(url.startsWith("https://www.youtube.com/results?search_query=")).toBe(true);
    expect(url).not.toMatch(/watch\?v=/);
  });

  it("percent-encodes Vietnamese characters and spaces", () => {
    expect(googleSearchUrl("Canh chua cá")).not.toContain(" ");
    expect(googleSearchUrl("Canh chua cá")).toContain("%");
  });
});
