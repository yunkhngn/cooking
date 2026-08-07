import { z } from "zod";

/**
 * KEY ORDER IS LOAD-BEARING.
 * Gemini emits object properties in schema key order, so this declaration
 * order is what makes progressive rendering work: the menu name arrives
 * first, then dishes one at a time, then the totals, then the shopping list.
 * Reordering these keys degrades the streaming UX. A test guards it.
 */

export const DifficultySchema = z.enum(["Dễ", "Trung bình", "Khó"]);

export const NutritionSchema = z.object({
  protein: z.number().int().nonnegative(),
  carbs: z.number().int().nonnegative(),
  fat: z.number().int().nonnegative(),
});

export const DishSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().nonnegative(),
  calories: z.number().int().nonnegative(),
  cookTime: z.number().int().positive(),
  difficulty: DifficultySchema,
  ingredients: z.array(z.string().min(1)).min(1),
  steps: z.array(z.string().min(1)).min(1),
  nutrition: NutritionSchema,
});

export const DinnerMenuSchema = z.object({
  menuName: z.string().min(1),
  dishes: z.array(DishSchema).min(2).max(4),
  sideDishes: z.array(z.string()).optional(),
  summary: z.object({
    totalCost: z.number().int().nonnegative(),
    totalTime: z.number().int().positive(),
    totalCalories: z.number().int().nonnegative(),
    dishCount: z.number().int().min(2).max(4),
  }),
  shoppingList: z.object({
    needToBuy: z.array(z.string()),
    alreadyHave: z.array(z.string()),
  }),
});

export const CUISINES = [
  "vietnamese", "japanese", "korean", "chinese",
  "thai", "italian", "american", "mixed",
] as const;

export const DIETS = [
  "regular", "healthy", "high-protein", "vegetarian", "low-carb",
] as const;

export const OCCASIONS = [
  "family", "date", "weekend", "friends", "comfort",
] as const;

export const GenerateRequestSchema = z.object({
  people: z.number().int().min(1).max(10),
  budget: z.number().int().min(20000).max(2000000),
  cuisine: z.enum(CUISINES),
  maxCookTime: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)]),
  mainDishCount: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  availableIngredients: z.array(z.string().min(1)).max(30).optional(),
  avoidIngredients: z.array(z.string().min(1)).max(30).optional(),
  desiredDishes: z.array(z.string().min(1)).max(10).optional(),
  diet: z.array(z.enum(DIETS)).min(1).max(DIETS.length).optional(),
  occasion: z.enum(OCCASIONS).optional(),
  recentDishes: z.array(z.string().min(1)).max(30).optional(),
  note: z.string().trim().max(500).optional(),
});

export type Dish = z.infer<typeof DishSchema>;
export type DinnerMenu = z.infer<typeof DinnerMenuSchema>;
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

/**
 * JSON Schema for Gemini's `response_format.schema`, derived from the Zod
 * schema so the model contract and runtime validation cannot drift apart.
 * `$schema` is stripped because Gemini rejects unknown top-level keywords.
 */
export function geminiResponseSchema(): Record<string, unknown> {
  const schema = z.toJSONSchema(DinnerMenuSchema) as Record<string, unknown>;
  delete schema.$schema;
  return schema;
}
