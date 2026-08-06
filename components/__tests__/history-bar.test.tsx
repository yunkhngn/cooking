import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryBar } from "@/components/history-bar";

describe("HistoryBar", () => {
  it("renders nothing when there is no history", () => {
    const { container } = render(<HistoryBar dishes={[]} onClear={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists the first three dishes and summarises the rest", () => {
    render(
      <HistoryBar dishes={["A", "B", "C", "D", "E"]} onClear={vi.fn()} />,
    );
    expect(screen.getByText(/A, B, C/)).toBeInTheDocument();
    expect(screen.getByText(/\+2 món/)).toBeInTheDocument();
  });

  it("calls onClear when the clear button is pressed", async () => {
    const onClear = vi.fn();
    render(<HistoryBar dishes={["A"]} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: /xoá lịch sử/i }));
    expect(onClear).toHaveBeenCalled();
  });
});
