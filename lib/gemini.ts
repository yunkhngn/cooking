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
 * Yields raw JSON text deltas as the model produces them.
 * The document is schema-constrained, and Gemini emits properties in
 * schema key order, so the consumer can render before the stream ends.
 */
export async function* streamMenuText(
  input: GenerateRequest,
): AsyncIterable<string> {
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

  for await (const event of stream) {
    if (event.event_type === "step.delta" && event.delta?.type === "text") {
      yield event.delta.text;
    }
  }
}
