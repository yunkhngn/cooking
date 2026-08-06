"use client";

import { motion } from "framer-motion";
import type { DeepPartial } from "@/lib/partial";
import type { Dish, DinnerMenu } from "@/lib/schema";
import { DishCard } from "@/components/dish-card";
import { ShoppingList } from "@/components/shopping-list";
import { vnd } from "@/lib/format";

function isCompleteDish(dish: DeepPartial<Dish> | undefined): dish is Dish {
  return Boolean(
    dish?.name &&
      dish.description &&
      dish.difficulty &&
      dish.ingredients?.length &&
      dish.steps?.length &&
      dish.nutrition &&
      typeof dish.price === "number" &&
      typeof dish.calories === "number" &&
      typeof dish.cookTime === "number",
  );
}

interface StatCardProps {
  label: string;
  value: string;
  isEstimate?: boolean;
  type: "cost" | "time" | "calories" | "dishes";
  index: number;
}

const STAT_CONFIG = {
  cost: {
    iconBg: "bg-coral-tint text-coral border-coral/20",
    badgeBg: "bg-coral-tint/80 text-coral",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  time: {
    iconBg: "bg-teal-tint text-teal border-teal/20",
    badgeBg: "bg-teal-tint/80 text-teal",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  calories: {
    iconBg: "bg-amber-100 text-amber-600 border-amber-200",
    badgeBg: "bg-amber-100/80 text-amber-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
        />
      </svg>
    ),
  },
  dishes: {
    iconBg: "bg-indigo-100 text-indigo-600 border-indigo-200",
    badgeBg: "bg-indigo-100/80 text-indigo-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
};

function StatCard({ label, value, isEstimate = false, type, index }: StatCardProps) {
  const config = STAT_CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-card border border-hairline bg-surface/90 p-5 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-control border ${config.iconBg} transition-transform duration-300 group-hover:scale-105`}
        >
          {config.icon}
        </div>
        {isEstimate && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide ${config.badgeBg}`}
          >
            Ước tính
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-ink-muted">{label}</p>
        <p className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function StatSkeleton() {
  return (
    <div className="flex h-32 animate-pulse flex-col justify-between rounded-card border border-hairline bg-surface/60 p-5 shadow-sm">
      <div className="h-10 w-10 rounded-control bg-hairline/80" />
      <div className="space-y-2">
        <div className="h-3 w-16 rounded bg-hairline/60" />
        <div className="h-6 w-24 rounded bg-hairline/80" />
      </div>
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-7 w-2 rounded-full bg-coral" />
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {source.menuName}
          </h2>
        </motion.div>
      )}

      {summary ? (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <StatCard
            index={0}
            type="cost"
            label="Tổng chi phí"
            value={typeof summary.totalCost === "number" ? vnd(summary.totalCost) : "—"}
            isEstimate
          />
          <StatCard
            index={1}
            type="time"
            label="Thời gian nấu"
            value={typeof summary.totalTime === "number" ? `${summary.totalTime} phút` : "—"}
          />
          <StatCard
            index={2}
            type="calories"
            label="Calo"
            value={typeof summary.totalCalories === "number" ? `${summary.totalCalories} kcal` : "—"}
            isEstimate
          />
          <StatCard
            index={3}
            type="dishes"
            label="Số lượng món"
            value={typeof summary.dishCount === "number" ? `${summary.dishCount} món` : "—"}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {complete.map((dish, i) => (
          <DishCard key={dish.name} dish={dish} index={i} />
        ))}
        {!menu && <Skeleton />}
      </div>

      {menu ? <ShoppingList list={menu.shoppingList} /> : <Skeleton />}
    </div>
  );
}
