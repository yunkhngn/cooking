import { DinnerMenuSchema, type DinnerMenu } from "@/lib/schema";

export const HISTORY_KEY = "dinner-ai:history";
export const LAST_MENU_KEY = "dinner-ai:last-menu";
export const MAX_ENTRIES = 7;
export const MAX_AGE_DAYS = 7;
export const MAX_RECENT_NAMES = 30;

export type HistoryEntry = { date: string; dishes: string[] };

/**
 * History & last menu storage are enhancements, never dependencies. Every
 * storage access is guarded so the app stays fully functional in private
 * browsing or when storage is disabled.
 */
function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.date === "string" &&
    Array.isArray(e.dishes) &&
    e.dishes.every((d) => typeof d === "string")
  );
}

function prune(entries: HistoryEntry[], now: Date): HistoryEntry[] {
  const cutoff = now.getTime() - MAX_AGE_DAYS * 86400000;
  return entries
    .filter((e) => {
      const t = Date.parse(e.date);
      return Number.isFinite(t) && t >= cutoff;
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, MAX_ENTRIES);
}

export function readHistory(now: Date = new Date()): HistoryEntry[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return prune(parsed.filter(isEntry), now);
  } catch {
    return [];
  }
}

export function addHistoryEntry(dishes: string[], now: Date = new Date()): HistoryEntry[] {
  const clean = dishes.map((d) => d.trim()).filter(Boolean);
  if (clean.length === 0) return readHistory(now);

  const todayKey = now.toISOString().slice(0, 10);
  const existing = readHistory(now).filter((e) => e.date.slice(0, 10) !== todayKey);

  const next = prune(
    [{ date: now.toISOString(), dishes: clean }, ...existing],
    now,
  );
  if (!canUseStorage()) return next;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Quota or private-browsing failure
  }
  return next;
}

export function clearHistory(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(HISTORY_KEY);
    window.localStorage.removeItem(LAST_MENU_KEY);
  } catch {
    // Nothing actionable.
  }
}

export function recentDishNames(entries: HistoryEntry[]): string[] {
  const seen = new Set<string>();
  for (const entry of entries) {
    for (const dish of entry.dishes) {
      if (seen.size >= MAX_RECENT_NAMES) return [...seen];
      seen.add(dish);
    }
  }
  return [...seen];
}

export function readLastMenu(): DinnerMenu | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(LAST_MENU_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validated = DinnerMenuSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}

export function saveLastMenu(menu: DinnerMenu): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(LAST_MENU_KEY, JSON.stringify(menu));
  } catch {
    // Quota or private-browsing failure
  }
}

export function clearLastMenu(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(LAST_MENU_KEY);
  } catch {
    // Nothing actionable
  }
}
