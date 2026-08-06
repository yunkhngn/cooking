# Dinner AI — Design Spec

Date: 2026-08-06
Status: Approved for planning
Source requirements: [`brief.md`](../../../brief.md)

---

## 1. Scope

A single-page Vietnamese web app that turns a short preference form into a complete
dinner plan: menu, per-dish recipes, estimated cost and nutrition, and one
consolidated shopping list.

This spec covers the whole product as described in `brief.md`, plus one addition
agreed after the brief was written: a local menu history used to prevent the AI
from repeating dishes week to week (section 8).

### Non-goals

Carried from `brief.md`: not a calorie tracker, not a fitness planner, not a
grocery manager, not a recipe database, not a chatbot. Nutrition values are
estimates and are labelled as such in the UI.

Additionally out of scope for this spec: user accounts, server-side persistence,
multi-day meal planning, and shopping-list export/share.

---

## 2. Deviation from the brief

`brief.md` lists "No user data storage" and "Stateless" as core principles.
Section 8 introduces `localStorage` history, which contradicts that line.

This is a deliberate, user-approved deviation. The mitigation is that the data
never leaves the user's browser: no server-side write, no cookie, no identifier,
no telemetry. The user can inspect what is stored and clear it from the UI.

**Action:** `brief.md` should be amended to say "No server-side data storage" so
the two documents stop contradicting each other.

---

## 3. Architecture

```
app/
  page.tsx                  Single page: form + streaming results
  api/generate/route.ts     POST — the only server code
  layout.tsx                Fonts, metadata, <html lang="vi">
lib/
  schema.ts                 Zod schema + derived Gemini responseSchema
  prompt.ts                 System instruction + user prompt builder
  history.ts                localStorage read/write/prune
  partial.ts                Tolerant partial-JSON parse helper
  rate-limit.ts             In-memory per-IP limiter
components/
  preference-form.tsx
  menu-result.tsx
  dish-card.tsx             Expandable
  shopping-list.tsx
  history-bar.tsx
```

The route handler is a stateless proxy. It holds the API key, calls Gemini,
streams bytes back, and retains nothing. There is no database, no session, no
auth.

### Tech stack

Next.js 15 (App Router) · React · TypeScript · Tailwind CSS · shadcn/ui ·
Framer Motion · Zod · `@google/genai` · `partial-json`.

Route handler runs on the Node.js runtime (`export const runtime = "nodejs"`).

---

## 4. Data model

One Zod schema in `lib/schema.ts` is the single source of truth. The Gemini
`responseSchema` is derived from it so the model contract and the runtime
validation cannot drift apart.

```ts
Dish = {
  name: string              // Vietnamese dish name
  description: string       // one short sentence
  price: number             // VND, integer
  calories: number          // kcal, integer, per serving
  cookTime: number          // minutes, integer
  difficulty: "Dễ" | "Trung bình" | "Khó"
  ingredients: string[]     // with quantities, e.g. "500g thịt ba chỉ"
  steps: string[]           // ordered preparation steps
  nutrition: { protein: number; carbs: number; fat: number }   // grams
}

DinnerMenu = {
  menuName: string
  dishes: Dish[]            // 2–4 items
  summary: {
    totalCost: number       // VND
    totalTime: number       // minutes
    totalCalories: number   // kcal
    dishCount: number
  }
  shoppingList: {
    needToBuy: string[]     // with quantities
    alreadyHave: string[]   // echoed from user-supplied ingredients
  }
}
```

All monetary values are integers in VND. All numeric fields are numbers, not
formatted strings — formatting is a UI concern.

**Dish count is AI-decided within 2–4**, based on people count and budget. A
50,000 VND solo dinner and a 200,000 VND family dinner should not both receive
three dishes.

**No URLs are ever produced by the model.** `brief.md` requires not fabricating
external URLs; the only way to guarantee that is to never let the model emit
one. The client builds YouTube and Google *search* URLs from the dish name:

```
https://www.youtube.com/results?search_query=<encodeURIComponent(name + " cách làm")>
https://www.google.com/search?q=<encodeURIComponent(name + " công thức")>
```

---

## 5. API contract

### `POST /api/generate`

Request body (validated with Zod; 400 on failure):

```ts
{
  people: number                 // 1–10
  budget: number                 // VND, 20000–2000000
  cuisine: "vietnamese" | "japanese" | "korean" | "chinese"
            | "thai" | "italian" | "american" | "mixed"
  maxCookTime: 15 | 30 | 45 | 60
  availableIngredients?: string[]
  avoidIngredients?: string[]
  diet?: "regular" | "healthy" | "high-protein" | "vegetarian" | "low-carb"
  occasion?: "family" | "date" | "weekend" | "friends" | "comfort"
  recentDishes?: string[]        // from localStorage history, max 30 names
}
```

Response: `text/plain; charset=utf-8` streaming body containing the raw JSON
text as the model produces it. Not SSE — a plain `ReadableStream` of the JSON
document. The client is responsible for parsing.

Error responses are JSON with `{ error: string }` and a Vietnamese message:

| Status | Condition |
|---|---|
| 400 | Request body failed Zod validation |
| 429 | Rate limit exceeded |
| 502 | Gemini API error or empty response |
| 500 | Unexpected server error |

---

## 6. Streaming and progressive rendering

The model returns schema-constrained JSON. Gemini's `propertyOrdering` pins the
emission order so the response is useful before it is complete:

```
menuName → dishes[] → summary → shoppingList
```

Flow:

1. Route handler calls `generateContentStream` and pipes text chunks to the
   response body unchanged.
2. Client accumulates chunks into a buffer.
3. On each chunk, the client runs a tolerant partial-JSON parse (`partial.ts`,
   wrapping `partial-json`) and re-renders from whatever is currently valid.
4. Dish cards appear one at a time as each object closes. Summary and shopping
   list render as skeletons until their fields arrive.
5. When the stream ends, the complete buffer is parsed with `JSON.parse` and
   validated with the Zod schema.

**Partial data is never treated as final.** If the closing Zod validation fails,
the UI discards the partially-rendered result and shows an error with a retry
button. A half-rendered menu is worse than an honest failure — the user would
otherwise go shopping with an incomplete list.

Expected first paint: menu name within a few seconds; full menu materially
faster than a single blocking response.

---

## 7. Prompt design

`lib/prompt.ts` exports a frozen system instruction and a `buildUserPrompt(input)`
function. The system instruction is a constant — no interpolation, no
timestamps — so it stays cacheable and reproducible.

The system instruction encodes the brief's optimization priority, in order:

1. Delicious and appealing
2. Practical to cook at home
3. Within budget
4. Balanced composition (protein + vegetable + soup where appropriate)
5. Maximum ingredient reuse across dishes, minimum unique ingredients
6. Respects the cooking-time ceiling
7. Estimated nutrition

Plus the constraints that make output feel local rather than generic:

- All output in Vietnamese
- Ingredients must be commonly available in Vietnamese supermarkets and wet markets
- Prices reflect Vietnamese market rates in VND
- Prefer dishes that pair well as one meal, not three unrelated dishes
- Never output URLs

The user prompt carries the form input. `availableIngredients` are prioritized
and must be excluded from `needToBuy` and echoed into `alreadyHave`.
`recentDishes` are listed as an explicit avoid-list (section 8).

### Model configuration

The model ID is read from `GEMINI_MODEL` (env), so it can be changed without a
code edit. The exact current model ID and the shape of `thinkingConfig` **must be
verified against Google's live documentation as the first implementation step** —
they are not assumed from memory, and a wrong ID fails the request outright.

Menu generation is a real optimization problem (budget × ingredient reuse ×
time × pairing), so the default targets a reasoning-capable tier rather than the
cheapest one, with a documented lower-latency fallback if measured latency proves
unacceptable.

---

## 8. Menu history (localStorage)

### Purpose

Prevent the AI from proposing the same dishes week after week.

### Storage

Key: `dinner-ai:history`. Value: a JSON array of compact entries.

```ts
{ date: "2026-08-06", dishes: ["Thịt kho trứng", "Canh chua cá", "Rau muống xào tỏi"] }
```

Dish names only — no recipes, ingredients, or nutrition. An entry is roughly
100 bytes rather than the ~5 KB a full menu would cost.

### Retention

Two rules, whichever prunes first:

- Keep at most the **7 most recent** entries
- Drop any entry older than **7 days**

### Lifecycle

- **Write:** only after the stream completes *and* Zod validation passes. Failed
  or abandoned generations are never recorded.
- **Read:** on page load, pruned immediately, then flattened into `recentDishes`
  (deduplicated, capped at 30 names) for the next request.
- **Clear:** a visible button in the history bar wipes the key.

### Deduplication granularity

Avoidance is at the **individual dish** level, not the whole menu. Avoiding only
exact menu repeats is too weak — a user would still get "thịt kho trứng" three
times in a week, which is the actual complaint this feature exists to solve.

### Robustness

All `localStorage` access is wrapped in try/catch and behind a
`typeof window !== "undefined"` guard. Malformed or unparseable stored data is
discarded and treated as empty history. Private-browsing quota errors degrade to
in-memory only for the session. **History is an enhancement — the app must be
fully functional with it unavailable.**

### UI

A single line beneath the form: *"Tuần này đã nấu: Thịt kho trứng, Canh chua cá,
+5 món"* with a clear button. Hidden entirely when history is empty. This makes
the avoid-list legible to the user and gives them a way to turn it off.

---

## 9. Rate limiting

`lib/rate-limit.ts` implements an in-memory sliding window keyed by client IP
(`x-forwarded-for`), defaulting to 5 requests per 10 minutes. Exceeding it
returns 429 with a Vietnamese message.

**Known limitation, stated plainly:** on serverless this resets on cold start and
is not shared across instances. It stops casual abuse of a public endpoint that
spends a real API budget; it does not stop a determined script. Durable
protection needs a shared store (e.g. Upstash Redis) or a platform WAF, both of
which are outside this spec's scope and would need to be added before treating
the endpoint as hardened.

---

## 10. UI

Mobile-first, single page, Vietnamese only (`<html lang="vi">`).

**States:** idle form → streaming (skeletons + progressively appearing dish
cards) → complete → error with retry.

**Layout:** form at top; summary strip; dish cards; shopping list. Dish cards are
collapsed by default showing name, description, price, calories, time, and
difficulty; expanding reveals ingredients, steps, nutrition, and the two search
links.

Framer Motion handles card entrance as each dish streams in and the expand/collapse
transition. Motion is subtle and respects `prefers-reduced-motion`.

Nutrition and cost figures are always rendered with an explicit "ước tính"
(estimated) qualifier, per the brief.

---

## 11. Error handling

| Failure | Behavior |
|---|---|
| Invalid form input | Inline field errors, no request sent |
| 429 | Message with retry-after guidance |
| Gemini error / empty response | Error state with retry button |
| Stream interrupted mid-flight | Discard partial render, error + retry |
| Final Zod validation fails | Discard partial render, error + retry |
| `localStorage` unavailable | History silently disabled, app fully functional |

No failure path leaves partially-rendered menu content on screen.

---

## 12. Testing

Vitest for units; the streaming path is exercised against recorded fixtures
rather than the live API.

- **`lib/schema.ts`** — valid menus pass; missing fields, wrong types, and
  out-of-range values are rejected.
- **`lib/partial.ts`** — truncated JSON fixtures cut at many byte offsets
  (mid-string, mid-number, mid-object, mid-array) each yield either valid partial
  data or a clean "not yet parseable" result, never a throw and never wrong data.
- **`lib/history.ts`** — the 7-entry cap and 7-day window prune correctly;
  corrupt stored values are discarded; a throwing `localStorage` does not
  propagate.
- **`lib/rate-limit.ts`** — window boundaries allow and reject as specified.
- **`app/api/generate/route.ts`** — request validation and each error status,
  with the Gemini client mocked.

---

## 13. Environment

```
GEMINI_API_KEY=      # required, server-side only, never NEXT_PUBLIC_
GEMINI_MODEL=        # required, model ID verified against live docs
```

`.env.example` is committed; `.env.local` is gitignored.

---

## 14. Success criteria

From `brief.md`: the user opens the site, fills a short form, and within seconds
has a complete dinner plan they can shop and cook from without further planning —
and feels *"this is exactly what I want to cook tonight."*

Concretely, a generated menu should:

- Stay within the stated budget
- Reuse ingredients across dishes and leave minimal leftovers
- Fit the stated cooking-time ceiling
- Use ingredients purchasable at a Vietnamese market
- Avoid dishes generated in the past week
- Render its first content within a few seconds of submission
