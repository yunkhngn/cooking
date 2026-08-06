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
    const result = parse(trimmed, Allow.ALL) as DeepPartial<T>;

    // If there are unclosed delimiters in the buffer, partial-json may have
    // completed partial objects/arrays. Filter these out to ensure we only
    // report verifiably complete data.
    if (hasUnclosedDelimiter(trimmed)) {
      removeIncompleteArrayElements(result);
    }

    return result;
  } catch {
    return null;
  }
}

function hasUnclosedDelimiter(buffer: string): boolean {
  let stringOpen = false;
  let escapeNext = false;
  let braceCount = 0;
  let bracketCount = 0;

  for (let i = 0; i < buffer.length; i++) {
    const char = buffer[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      stringOpen = !stringOpen;
    } else if (!stringOpen) {
      if (char === "{") braceCount++;
      else if (char === "}") braceCount--;
      else if (char === "[") bracketCount++;
      else if (char === "]") bracketCount--;
    }
  }

  return stringOpen || braceCount > 0 || bracketCount > 0;
}

function removeIncompleteArrayElements(obj: any): void {
  if (!obj || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    // Remove the last element from an incomplete array
    obj.pop();
  } else {
    // Recursively process object properties
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (Array.isArray(value) && value.length > 0) {
          value.pop();
        } else if (value !== null && typeof value === "object") {
          removeIncompleteArrayElements(value);
        }
      }
    }
  }
}
