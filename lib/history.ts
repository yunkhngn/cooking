export const HISTORY_KEY = "dinner-ai:history";
export const MAX_ENTRIES = 7;
export const MAX_AGE_DAYS = 7;
export const MAX_RECENT_NAMES = 30;

export type HistoryEntry = { date: string; dishes: string[] };

/**
 * History is an enhancement, never a dependency. Every storage access is
 * guarded and every failure degrades to "no history" so the app stays
 * fully functional in private browsing or with storage disabled.
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

  const next = prune(
    [{ date: now.toISOString(), dishes: clean }, ...readHistory(now)],
    now,
  );
  if (!canUseStorage()) return next;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Quota or private-browsing failure: this session keeps working without
    // persistence rather than surfacing an error the user cannot act on.
  }
  return next;
}

export function clearHistory(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(HISTORY_KEY);
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
