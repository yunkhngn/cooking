import { parse, Allow } from "partial-json";

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

/**
 * Parse a possibly-incomplete JSON document.
 *
 * Returns whatever is verifiably complete so far, or null when nothing
 * useful can be read yet. Never throws — a malformed or half-arrived
 * buffer is an expected condition during streaming, not an error.
 */
export function parsePartial<T>(buffer: string): DeepPartial<T> | null {
  const trimmed = buffer.trim();
  if (!trimmed) return null;
  try {
    return parse(trimmed, Allow.OBJ | Allow.ARR | Allow.NUM) as DeepPartial<T>;
  } catch {
    return null;
  }
}
