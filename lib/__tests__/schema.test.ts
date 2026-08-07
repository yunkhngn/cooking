import { describe, it, expect } from "vitest";
import {
  DinnerMenuSchema,
  GenerateRequestSchema,
  geminiResponseSchema,
} from "@/lib/schema";

const validMenu = {
  menuName: "Bữa tối ấm cúng",
  dishes: [
    {
      name: "Thịt kho trứng",
      description: "Món mặn đậm đà, đưa cơm.",
      price: 60000,
      calories: 450,
      cookTime: 40,
      difficulty: "Trung bình",
      ingredients: ["500g thịt ba chỉ", "4 quả trứng"],
      steps: ["Sơ chế thịt", "Kho với nước dừa"],
      nutrition: { protein: 28, carbs: 12, fat: 30 },
    },
    {
      name: "Canh chua cá",
      description: "Canh thanh mát, chua nhẹ.",
      price: 45000,
      calories: 180,
      cookTime: 25,
      difficulty: "Dễ",
      ingredients: ["300g cá basa", "1 quả dứa"],
      steps: ["Nấu nước dùng", "Cho cá vào"],
      nutrition: { protein: 20, carbs: 10, fat: 6 },
    },
  ],
  summary: { totalCost: 105000, totalTime: 45, totalCalories: 630, dishCount: 2 },
  shoppingList: { needToBuy: ["500g thịt ba chỉ"], alreadyHave: ["Trứng"] },
};

describe("DinnerMenuSchema", () => {
  it("accepts a valid menu", () => {
    expect(DinnerMenuSchema.safeParse(validMenu).success).toBe(true);
  });

  it("rejects a menu with fewer than 2 dishes", () => {
    const bad = { ...validMenu, dishes: [validMenu.dishes[0]] };
    expect(DinnerMenuSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects a non-integer price", () => {
    const bad = structuredClone(validMenu);
    bad.dishes[0].price = 60000.5;
    expect(DinnerMenuSchema.safeParse(bad).success).toBe(false);
  });

  it("accepts a menu with optional sideDishes", () => {
    const menuWithSides = {
      ...validMenu,
      sideDishes: ["Cơm trắng (từ gạo sẵn có)", "Dưa chua dầm", "Nước mắm tỏi ớt"],
    };
    expect(DinnerMenuSchema.safeParse(menuWithSides).success).toBe(true);
  });
});

describe("geminiResponseSchema", () => {
  it("preserves top-level key order for progressive streaming", () => {
    const schema = geminiResponseSchema() as {
      properties: Record<string, unknown>;
    };
    expect(Object.keys(schema.properties)).toEqual([
      "menuName",
      "dishes",
      "sideDishes",
      "summary",
      "shoppingList",
    ]);
  });

  it("strips the $schema key that Gemini rejects", () => {
    expect(geminiResponseSchema()).not.toHaveProperty("$schema");
  });
});

describe("GenerateRequestSchema", () => {
  it("accepts a minimal valid request", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 150000,
      cuisine: "vietnamese",
      maxCookTime: 30,
    });
    expect(r.success).toBe(true);
  });

  it("rejects a budget below the floor", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 100,
      cuisine: "vietnamese",
      maxCookTime: 30,
    });
    expect(r.success).toBe(false);
  });

  it("caps recentDishes at 30 entries", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 150000,
      cuisine: "vietnamese",
      maxCookTime: 30,
      recentDishes: Array.from({ length: 31 }, (_, i) => `Món ${i}`),
    });
    expect(r.success).toBe(false);
  });

  it("accepts valid desiredDishes array", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 150000,
      cuisine: "vietnamese",
      maxCookTime: 30,
      desiredDishes: ["Thịt kho tàu", "Canh chua"],
    });
    expect(r.success).toBe(true);
  });

  it("accepts valid mainDishCount (2, 3, or 4)", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 150000,
      cuisine: "vietnamese",
      maxCookTime: 30,
      mainDishCount: 3,
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid mainDishCount", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 150000,
      cuisine: "vietnamese",
      maxCookTime: 30,
      mainDishCount: 5,
    });
    expect(r.success).toBe(false);
  });

  it("accepts multiple diet options", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 150000,
      cuisine: "vietnamese",
      maxCookTime: 30,
      diet: ["healthy", "low-carb"],
    });
    expect(r.success).toBe(true);
  });

  it("rejects an empty diet array", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 150000,
      cuisine: "vietnamese",
      maxCookTime: 30,
      diet: [],
    });
    expect(r.success).toBe(false);
  });

  it("accepts optional note", () => {
    const r = GenerateRequestSchema.safeParse({
      people: 2,
      budget: 150000,
      cuisine: "vietnamese",
      maxCookTime: 30,
      note: "Không ăn cay.",
    });
    expect(r.success).toBe(true);
  });
});


