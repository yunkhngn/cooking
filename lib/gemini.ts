import { GoogleGenAI } from "@google/genai";
import { geminiResponseSchema, type GenerateRequest } from "@/lib/schema";
import { SYSTEM_INSTRUCTION, buildUserPrompt } from "@/lib/prompt";

export const DEFAULT_MODEL = "gemini-3.6-flash";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

/**
 * Opens the model stream and returns an iterable of raw JSON text deltas.
 *
 * The connection handshake deliberately happens in this plain `async`
 * function rather than inside a generator. Calling an async generator runs
 * none of its body until the first `next()`, so a generator would defer the
 * missing-key throw and the `interactions.create` failure until after the
 * route had already committed to a 200 response — turning every pre-stream
 * upstream failure into a broken 200 instead of a 502. Awaiting the
 * handshake here means the caller can still choose a status code.
 *
 * The document is schema-constrained, and Gemini emits properties in schema
 * key order, so the consumer can render before the stream ends.
 */
export async function startMenuStream(
  input: GenerateRequest,
): Promise<AsyncIterable<string>> {
  const ai = getClient();

  const stream = await ai.interactions.create({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    input: `${SYSTEM_INSTRUCTION}\n\n---\n\n${buildUserPrompt(input)}`,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: geminiResponseSchema(),
    },
    stream: true,
  });

  return (async function* () {
    for await (const event of stream) {
      if (event.event_type === "step.delta" && event.delta?.type === "text") {
        yield event.delta.text;
      }
    }
  })();
}
