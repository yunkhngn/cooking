import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useMenuStream } from "@/lib/use-menu-stream";
import type { GenerateRequest } from "@/lib/schema";

const request: GenerateRequest = {
  people: 2,
  budget: 150000,
  cuisine: "vietnamese",
  maxCookTime: 30,
};

const dish = (name: string) => ({
  name,
  description: "Ngon.",
  price: 50000,
  calories: 400,
  cookTime: 20,
  difficulty: "Dễ",
  ingredients: ["Nguyên liệu"],
  steps: ["Bước 1"],
  nutrition: { protein: 20, carbs: 10, fat: 5 },
});

const validMenu = {
  menuName: "Bữa tối",
  dishes: [dish("Thịt kho trứng"), dish("Canh chua cá")],
  summary: { totalCost: 100000, totalTime: 40, totalCalories: 800, dishCount: 2 },
  shoppingList: { needToBuy: ["Thịt"], alreadyHave: [] },
};

function streamingResponse(text: string, chunkSize = 20) {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        for (let i = 0; i < text.length; i += chunkSize) {
          controller.enqueue(encoder.encode(text.slice(i, i + chunkSize)));
        }
        controller.close();
      },
    }),
    { status: 200 },
  );
}

beforeEach(() => vi.restoreAllMocks());

describe("useMenuStream", () => {
  it("starts idle", () => {
    const { result } = renderHook(() => useMenuStream());
    expect(result.current.status).toBe("idle");
  });

  it("produces a validated menu on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      streamingResponse(JSON.stringify(validMenu)),
    ));
    const { result } = renderHook(() => useMenuStream());
    await act(async () => { await result.current.generate(request); });
    await waitFor(() => expect(result.current.status).toBe("done"));
    expect(result.current.menu?.dishes).toHaveLength(2);
  });

  it("surfaces the server error message on a non-OK response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Quá nhiều yêu cầu." }), { status: 429 }),
    ));
    const { result } = renderHook(() => useMenuStream());
    await act(async () => { await result.current.generate(request); });
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Quá nhiều yêu cầu.");
  });

  it("errors and discards partial data when the payload fails validation", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      streamingResponse(JSON.stringify({ menuName: "Thiếu dữ liệu" })),
    ));
    const { result } = renderHook(() => useMenuStream());
    await act(async () => { await result.current.generate(request); });
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.menu).toBeNull();
    expect(result.current.partial).toBeNull();
  });

  it("resets back to idle", async () => {
    const { result } = renderHook(() => useMenuStream());
    act(() => result.current.reset());
    expect(result.current.status).toBe("idle");
  });
});
