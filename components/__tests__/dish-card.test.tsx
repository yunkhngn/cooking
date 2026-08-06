import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DishCard } from "@/components/dish-card";
import type { Dish } from "@/lib/schema";

const dish: Dish = {
  name: "Thịt kho trứng",
  description: "Món mặn đậm đà.",
  price: 60000,
  calories: 450,
  cookTime: 40,
  difficulty: "Trung bình",
  ingredients: ["500g thịt ba chỉ"],
  steps: ["Sơ chế thịt"],
  nutrition: { protein: 28, carbs: 12, fat: 30 },
};

describe("DishCard", () => {
  it("shows summary info collapsed and hides the recipe", () => {
    render(<DishCard dish={dish} index={0} />);
    expect(screen.getByText("Thịt kho trứng")).toBeInTheDocument();
    expect(screen.queryByText("500g thịt ba chỉ")).not.toBeInTheDocument();
  });

  it("reveals ingredients and steps when expanded", async () => {
    render(<DishCard dish={dish} index={0} />);
    await userEvent.click(screen.getByRole("button", { name: /thịt kho trứng/i }));
    expect(screen.getByText("500g thịt ba chỉ")).toBeInTheDocument();
    expect(screen.getByText("Sơ chế thịt")).toBeInTheDocument();
  });

  it("labels figures as estimates", () => {
    render(<DishCard dish={dish} index={0} />);
    expect(screen.getAllByText(/ước tính/i).length).toBeGreaterThan(0);
  });
});
