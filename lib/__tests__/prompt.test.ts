import { describe, it, expect } from "vitest";
import { SYSTEM_INSTRUCTION, buildUserPrompt } from "@/lib/prompt";
import type { GenerateRequest } from "@/lib/schema";

const base: GenerateRequest = {
  people: 4,
  budget: 200000,
  cuisine: "vietnamese",
  maxCookTime: 45,
};

describe("SYSTEM_INSTRUCTION", () => {
  it("is a frozen constant with no interpolation markers", () => {
    expect(SYSTEM_INSTRUCTION).not.toMatch(/\$\{|\{\{/);
  });

  it("forbids emitting URLs", () => {
    expect(SYSTEM_INSTRUCTION.toLowerCase()).toContain("url");
  });

  it("states the ingredient-reuse requirement", () => {
    expect(SYSTEM_INSTRUCTION).toMatch(/tái sử dụng|dùng chung/i);
  });
});

describe("buildUserPrompt", () => {
  it("includes people, budget and cook time", () => {
    const p = buildUserPrompt(base);
    expect(p).toContain("4");
    expect(p).toContain("200000");
    expect(p).toContain("45");
  });

  it("omits optional sections when absent", () => {
    const p = buildUserPrompt(base);
    expect(p).not.toMatch(/Nguyên liệu sẵn có/);
    expect(p).not.toMatch(/Tránh lặp lại/);
  });

  it("lists available ingredients when provided", () => {
    const p = buildUserPrompt({ ...base, availableIngredients: ["Trứng", "Cà chua"] });
    expect(p).toContain("Trứng");
    expect(p).toContain("Cà chua");
  });

  it("renders recent dishes as an explicit avoid-list", () => {
    const p = buildUserPrompt({ ...base, recentDishes: ["Thịt kho trứng"] });
    expect(p).toMatch(/Tránh lặp lại/);
    expect(p).toContain("Thịt kho trứng");
  });
});
