import { describe, it, expect } from "vitest";
import { vnd, formatVndInput, parseVndInput, toSentenceCase } from "@/lib/format";

describe("format utilities", () => {
  it("formats integer to standard vnd string", () => {
    expect(vnd(100000)).toBe("100.000đ");
  });

  it("formats user input to formatted currency display string", () => {
    expect(formatVndInput("100000")).toBe("100.000đ");
    expect(formatVndInput("200000")).toBe("200.000đ");
    expect(formatVndInput("100.000đ")).toBe("100.000đ");
  });

  it("parses formatted currency input string to raw integer number", () => {
    expect(parseVndInput("100.000đ")).toBe(100000);
    expect(parseVndInput("200.000đ")).toBe(200000);
    expect(parseVndInput("")).toBe(0);
  });

  it("converts Title Case to standard Vietnamese sentence case", () => {
    expect(toSentenceCase("Thực Đơn Cơm Nhà Bình Dân Ấm Cúng Cho 4 Người")).toBe(
      "Thực đơn cơm nhà bình dân ấm cúng cho 4 người",
    );
    expect(toSentenceCase("Thực Đơn Món Ăn Việt Nam Cho 2 Người")).toBe(
      "Thực đơn món ăn Việt Nam cho 2 người",
    );
  });
});
