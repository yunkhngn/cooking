import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  HISTORY_KEY,
  readHistory,
  addHistoryEntry,
  clearHistory,
  recentDishNames,
} from "@/lib/history";

const NOW = new Date("2026-08-06T12:00:00Z");
const daysAgo = (n: number) =>
  new Date(NOW.getTime() - n * 86400000).toISOString().slice(0, 10);

beforeEach(() => localStorage.clear());

describe("readHistory", () => {
  it("returns an empty array when nothing is stored", () => {
    expect(readHistory(NOW)).toEqual([]);
  });

  it("discards corrupt stored data instead of throwing", () => {
    localStorage.setItem(HISTORY_KEY, "{not json");
    expect(readHistory(NOW)).toEqual([]);
  });

  it("discards entries with the wrong shape", () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([{ nope: 1 }]));
    expect(readHistory(NOW)).toEqual([]);
  });

  it("drops entries older than 7 days", () => {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([
        { date: daysAgo(1), dishes: ["Món mới"] },
        { date: daysAgo(9), dishes: ["Món cũ"] },
      ]),
    );
    expect(readHistory(NOW).map((e) => e.dishes[0])).toEqual(["Món mới"]);
  });
});

describe("addHistoryEntry", () => {
  it("stores an entry and reads it back", () => {
    addHistoryEntry(["Thịt kho trứng"], NOW);
    expect(readHistory(NOW)[0].dishes).toEqual(["Thịt kho trứng"]);
  });

  it("keeps at most 7 entries across different days, newest first", () => {
    for (let i = 0; i < 10; i++) {
      addHistoryEntry([`Món ${i}`], new Date(NOW.getTime() - i * 86400000));
    }
    const entries = readHistory(NOW);
    expect(entries).toHaveLength(7);
  });

  it("ignores an empty dish list", () => {
    addHistoryEntry([], NOW);
    expect(readHistory(NOW)).toEqual([]);
  });

  it("does not throw when localStorage.setItem fails", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => addHistoryEntry(["Món"], NOW)).not.toThrow();
    spy.mockRestore();
  });

  it("replaces an existing entry for the same calendar date when re-generated", () => {
    addHistoryEntry(["Cá kho", "Canh chua"], NOW);
    expect(readHistory(NOW)).toHaveLength(1);
    expect(readHistory(NOW)[0].dishes).toEqual(["Cá kho", "Canh chua"]);

    const LATER_SAME_DAY = new Date(NOW.getTime() + 3600000); // 1 hour later
    addHistoryEntry(["Thịt nướng", "Rau luộc"], LATER_SAME_DAY);

    const history = readHistory(LATER_SAME_DAY);
    expect(history).toHaveLength(1);
    expect(history[0].dishes).toEqual(["Thịt nướng", "Rau luộc"]);
  });
});


describe("recentDishNames", () => {
  it("flattens, deduplicates, and caps at 30", () => {
    const entries = Array.from({ length: 10 }, (_, i) => ({
      date: daysAgo(0),
      dishes: [`Món ${i}`, "Cơm trắng"],
    }));
    const names = recentDishNames(entries);
    expect(names.filter((n) => n === "Cơm trắng")).toHaveLength(1);
    expect(names.length).toBeLessThanOrEqual(30);
  });
});

describe("clearHistory", () => {
  it("removes everything", () => {
    addHistoryEntry(["Món"], NOW);
    clearHistory();
    expect(readHistory(NOW)).toEqual([]);
  });
});
