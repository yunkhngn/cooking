import { GenerateRequestSchema } from "@/lib/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { streamMenuText } from "@/lib/gemini";

export const runtime = "nodejs";

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Dữ liệu gửi lên không hợp lệ.", 400);
  }

  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Thông tin chưa hợp lệ, vui lòng kiểm tra lại.", 400);
  }

  const limit = checkRateLimit(clientIp(request));
  if (!limit.ok) {
    return jsonError(
      `Bạn đã tạo quá nhiều thực đơn. Vui lòng thử lại sau ${limit.retryAfterSec} giây.`,
      429,
      { "retry-after": String(limit.retryAfterSec) },
    );
  }

  let iterator: AsyncIterable<string>;
  try {
    iterator = streamMenuText(parsed.data);
  } catch {
    return jsonError("Không kết nối được tới AI. Vui lòng thử lại.", 502);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of iterator) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch {
        // The response has already begun; the only honest signal left is to
        // break the stream. The client's closing Zod validation will fail and
        // it will show the retry state rather than a half-built menu.
        controller.error(new Error("stream failed"));
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
