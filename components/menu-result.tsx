"use client";

import type { DeepPartial } from "@/lib/partial";
import type { Dish, DinnerMenu } from "@/lib/schema";
import { DishCard } from "@/components/dish-card";
import { ShoppingList } from "@/components/shopping-list";
import { vnd } from "@/lib/format";

function isCompleteDish(dish: DeepPartial<Dish> | undefined): dish is Dish {
  return Boolean(
    dish?.name && dish.description && dish.difficulty &&
    dish.ingredients?.length && dish.steps?.length && dish.nutrition &&
    typeof dish.price === "number" && typeof dish.calories === "number" &&
    typeof dish.cookTime === "number",
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-hairline bg-surface px-5 py-4 shadow-card">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="h-28 animate-pulse rounded-card border border-hairline bg-surface" />
  );
}

export function MenuResult({
  menu,
  partial,
}: {
  menu: DinnerMenu | null;
  partial: DeepPartial<DinnerMenu> | null;
}) {
  const source = menu ?? partial;
  if (!source) return null;

  const dishes = (source.dishes ?? []) as (DeepPartial<Dish> | undefined)[];
  const complete = dishes.filter(isCompleteDish);
  const summary = source.summary;

  return (
    <div className="space-y-6">
      {source.menuName && (
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">{source.menuName}</h2>
      )}

      {summary ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Tổng chi phí (ước tính)"
            value={typeof summary.totalCost === "number" ? vnd(summary.totalCost) : "—"} />
          <Stat label="Thời gian nấu"
            value={typeof summary.totalTime === "number" ? `${summary.totalTime} phút` : "—"} />
          <Stat label="Calo (ước tính)"
            value={typeof summary.totalCalories === "number" ? `${summary.totalCalories} kcal` : "—"} />
          <Stat label="Số món"
            value={typeof summary.dishCount === "number" ? String(summary.dishCount) : "—"} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}
        </div>
      )}

      <div className="space-y-4">
        {complete.map((dish, i) => <DishCard key={dish.name} dish={dish} index={i} />)}
        {!menu && <Skeleton />}
      </div>

      {menu ? <ShoppingList list={menu.shoppingList} /> : <Skeleton />}
    </div>
  );
}
