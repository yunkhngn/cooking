import { describe, it, expect } from "vitest";
import { parsePartial } from "@/lib/partial";

const full = JSON.stringify({
  menuName: "Bữa tối ấm cúng",
  dishes: [
    { name: "Thịt kho trứng", price: 60000 },
    { name: "Canh chua cá", price: 45000 },
  ],
  summary: { totalCost: 105000 },
});

describe("parsePartial", () => {
  it("parses a complete document", () => {
    expect(parsePartial<{ menuName: string }>(full)?.menuName).toBe("Bữa tối ấm cúng");
  });

  it("returns null for empty or whitespace input", () => {
    expect(parsePartial("")).toBeNull();
    expect(parsePartial("   \n ")).toBeNull();
  });

  it("returns null instead of throwing on malformed input", () => {
    expect(parsePartial("this is not json")).toBeNull();
  });

  it("never throws at ANY truncation offset", () => {
    for (let i = 0; i <= full.length; i++) {
      const slice = full.slice(0, i);
      expect(() => parsePartial(slice)).not.toThrow();
    }
  });

  it("exposes completed dishes while the array is still open", () => {
    // Cut partway into the SECOND dish: the first is complete, the second is not.
    const cut = full.indexOf("Canh");
    const partial = parsePartial<{ dishes: { name: string }[] }>(full.slice(0, cut));
    expect(partial?.dishes?.[0]?.name).toBe("Thịt kho trứng");
    expect(partial?.dishes?.[1]?.name).toBeUndefined();
  });

  it("never reports a field that has not been fully received", () => {
    const upto = full.indexOf('"summary"');
    const partial = parsePartial<{ summary?: unknown }>(full.slice(0, upto));
    expect(partial?.summary).toBeUndefined();
  });
});
