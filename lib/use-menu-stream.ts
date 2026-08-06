"use client";

import { useCallback, useState } from "react";
import { parsePartial, type DeepPartial } from "@/lib/partial";
import {
  DinnerMenuSchema,
  type DinnerMenu,
  type GenerateRequest,
} from "@/lib/schema";

export type StreamStatus = "idle" | "streaming" | "done" | "error";

const GENERIC_ERROR = "Không tạo được thực đơn. Vui lòng thử lại.";

export function useMenuStream() {
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [partial, setPartial] = useState<DeepPartial<DinnerMenu> | null>(null);
  const [menu, setMenu] = useState<DinnerMenu | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setPartial(null);
    setMenu(null);
    setError(null);
  }, []);

  const fail = useCallback((message: string) => {
    // Partial data is never left on screen: a half-rendered menu would send
    // the user shopping with an incomplete list.
    setPartial(null);
    setMenu(null);
    setError(message);
    setStatus("error");
  }, []);

  const generate = useCallback(
    async (input: GenerateRequest) => {
      setStatus("streaming");
      setPartial(null);
      setMenu(null);
      setError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const message = await response
            .json()
            .then((b: { error?: string }) => b.error)
            .catch(() => null);
          fail(message || GENERIC_ERROR);
          return;
        }

        if (!response.body) {
          fail(GENERIC_ERROR);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          setPartial(parsePartial<DinnerMenu>(buffer));
        }
        buffer += decoder.decode();

        const validated = DinnerMenuSchema.safeParse(
          JSON.parse(buffer) as unknown,
        );
        if (!validated.success) {
          fail(GENERIC_ERROR);
          return;
        }

        setPartial(null);
        setMenu(validated.data);
        setStatus("done");
      } catch {
        fail(GENERIC_ERROR);
      }
    },
    [fail],
  );

  return { status, partial, menu, error, generate, reset };
}
