import { toPng } from "html-to-image";

export async function exportMenuAsImage(
  element: HTMLElement,
  filename = "Dinner-AI-Thuc-don.png",
): Promise<void> {
  if (typeof window === "undefined" || !element) return;

  const dataUrl = await toPng(element, {
    quality: 0.95,
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#FAF7F2",
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
