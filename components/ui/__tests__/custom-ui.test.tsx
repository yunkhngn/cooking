import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomAlert } from "@/components/ui/custom-alert";
import { CustomModal } from "@/components/ui/custom-modal";

describe("CustomSelect", () => {
  const options = [
    { value: "opt1", label: "Lựa chọn 1" },
    { value: "opt2", label: "Lựa chọn 2" },
  ];

  it("renders selected label and opens options list when clicked", async () => {
    const onChange = vi.fn();
    render(
      <CustomSelect
        value="opt1"
        onChange={onChange}
        options={options}
        aria-label="Test Select"
      />,
    );

    expect(screen.getByRole("combobox", { name: "Test Select" })).toHaveTextContent("Lựa chọn 1");
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Lựa chọn 2" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("option", { name: "Lựa chọn 2" }));
    expect(onChange).toHaveBeenCalledWith("opt2");
  });

  it("supports multi-select mode", async () => {
    const onChange = vi.fn();
    render(
      <CustomSelect
        value={[]}
        onChange={onChange}
        options={options}
        multiple
        placeholder="Không yêu cầu"
        aria-label="Test Multi Select"
      />,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Test Multi Select" }));
    await userEvent.click(screen.getByRole("option", { name: "Lựa chọn 1" }));
    expect(onChange).toHaveBeenCalledWith(["opt1"]);
  });
});

describe("CustomAlert", () => {
  it("renders title, content and retry button", async () => {
    const onRetry = vi.fn();
    render(
      <CustomAlert variant="error" title="Lỗi kết nối" onRetry={onRetry}>
        Vui lòng kiểm tra lại mạng.
      </CustomAlert>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Lỗi kết nối")).toBeInTheDocument();
    expect(screen.getByText("Vui lòng kiểm tra lại mạng.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Thử lại" }));
    expect(onRetry).toHaveBeenCalled();
  });
});

describe("CustomModal", () => {
  it("renders when open and closes on close button click", async () => {
    const onClose = vi.fn();
    render(
      <CustomModal isOpen={true} onClose={onClose} title="Tiêu đề modal">
        Nội dung modal
      </CustomModal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tiêu đề modal")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(onClose).toHaveBeenCalled();
  });
});
