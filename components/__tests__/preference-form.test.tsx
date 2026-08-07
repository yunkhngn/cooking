import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PreferenceForm } from "@/components/preference-form";

describe("PreferenceForm", () => {
  it("submits defaults without extra input", async () => {
    const onSubmit = vi.fn();
    render(<PreferenceForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: /tạo thực đơn/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ people: expect.any(Number), cuisine: "vietnamese" }),
    );
  });

  it("splits comma-separated ingredients into an array", async () => {
    const onSubmit = vi.fn();
    render(<PreferenceForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/nguyên liệu sẵn có/i), "Trứng, Cà chua");
    await userEvent.click(screen.getByRole("button", { name: /tạo thực đơn/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ availableIngredients: ["Trứng", "Cà chua"] }),
    );
  });

  it("blocks submission and shows an error for an out-of-range budget", async () => {
    const onSubmit = vi.fn();
    render(<PreferenceForm onSubmit={onSubmit} />);
    const budget = screen.getByLabelText(/ngân sách/i);
    await userEvent.clear(budget);
    await userEvent.type(budget, "5");
    await userEvent.click(screen.getByRole("button", { name: /tạo thực đơn/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("disables the submit button while generating", () => {
    render(<PreferenceForm onSubmit={vi.fn()} disabled />);
    expect(screen.getByRole("button", { name: /đang nấu/i })).toBeDisabled();
  });

  it("splits comma-separated desired dishes into an array", async () => {
    const onSubmit = vi.fn();
    render(<PreferenceForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/món ăn muốn có/i), "Thịt kho tàu, Canh chua");
    await userEvent.click(screen.getByRole("button", { name: /tạo thực đơn/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ desiredDishes: ["Thịt kho tàu", "Canh chua"] }),
    );
  });

  it("submits mainDishCount when selected", async () => {
    const onSubmit = vi.fn();
    render(<PreferenceForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("combobox", { name: /số món chính/i }));
    await userEvent.click(screen.getByRole("option", { name: "3 món chính" }));
    await userEvent.click(screen.getByRole("button", { name: /tạo thực đơn/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ mainDishCount: 3 }),
    );
  });

  it("submits multiple diet selections", async () => {
    const onSubmit = vi.fn();
    render(<PreferenceForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("combobox", { name: /chế độ ăn/i }));
    await userEvent.click(screen.getByRole("option", { name: "Lành mạnh" }));
    await userEvent.click(screen.getByRole("option", { name: "Ít tinh bột" }));
    await userEvent.click(screen.getByRole("button", { name: /tạo thực đơn/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ diet: ["healthy", "low-carb"] }),
    );
  });

  it("submits optional note when provided", async () => {
    const onSubmit = vi.fn();
    render(<PreferenceForm onSubmit={onSubmit} />);

    await userEvent.type(
      screen.getByLabelText(/ghi chú thêm/i),
      "Ưu tiên món ít dầu mỡ và không cay.",
    );
    await userEvent.click(screen.getByRole("button", { name: /tạo thực đơn/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ note: "Ưu tiên món ít dầu mỡ và không cay." }),
    );
  });
});


