import { describe, it, expect, vi, beforeEach } from "vitest";
import * as htmlToImage from "html-to-image";
import { exportMenuAsImage } from "@/lib/export-image";

vi.mock("html-to-image", () => ({
  toPng: vi.fn().mockResolvedValue("data:image/png;base64,fakeimage"),
}));

describe("exportMenuAsImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("converts HTML node to PNG and triggers download link click", async () => {
    const clickSpy = vi.fn();
    const createElementSpy = vi.spyOn(document, "createElement").mockReturnValue({
      download: "",
      href: "",
      click: clickSpy,
    } as unknown as HTMLAnchorElement);

    const dummyNode = document.createElement("div");
    await exportMenuAsImage(dummyNode, "Test-Menu.png");

    expect(htmlToImage.toPng).toHaveBeenCalledWith(dummyNode, expect.objectContaining({
      pixelRatio: 2,
      quality: 0.95,
    }));
    expect(clickSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });
});
