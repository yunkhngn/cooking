import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MenuExportCard } from "@/components/menu-export-card";
import type { DinnerMenu } from "@/lib/schema";

const mockMenu: DinnerMenu = {
  menuName: "Bữa tối gia đình sum vầy",
  dishes: [
    {
      name: "Thịt heo kho trứng",
      description: "Món mặn đậm đà chuẩn vị.",
      price: 70000,
      calories: 450,
      cookTime: 40,
      difficulty: "Trung bình",
      ingredients: ["500g thịt ba chỉ", "5 quả trứng"],
      steps: ["Thái thịt vừa ăn", "Kho nhỏ lửa 40 phút"],
      nutrition: { protein: 30, carbs: 10, fat: 25 },
    },
  ],
  sideDishes: ["Cơm trắng (gạo sẵn có)", "Dưa chua dầm"],
  summary: {
    totalCost: 70000,
    totalTime: 40,
    totalCalories: 450,
    dishCount: 1,
  },
  shoppingList: {
    needToBuy: ["500g thịt ba chỉ"],
    alreadyHave: ["Trứng", "Gạo"],
  },
};

describe("MenuExportCard", () => {
  it("renders menu name, summary stats, recipes, side dishes and shopping list", () => {
    render(<MenuExportCard menu={mockMenu} />);

    expect(screen.getByText("Bữa tối gia đình sum vầy")).toBeInTheDocument();
    expect(screen.getByText("Thịt heo kho trứng")).toBeInTheDocument();
    expect(screen.getByText("Món mặn đậm đà chuẩn vị.")).toBeInTheDocument();
    expect(screen.getAllByText("500g thịt ba chỉ")[0]).toBeInTheDocument();
    expect(screen.getByText("Thái thịt vừa ăn")).toBeInTheDocument();
    expect(screen.getByText("Cơm trắng (gạo sẵn có)")).toBeInTheDocument();
    expect(screen.getByText(/Dinner AI — Tối nay nhà mình ăn gì\?/i)).toBeInTheDocument();
  });
});
