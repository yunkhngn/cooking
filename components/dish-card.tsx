"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dish } from "@/lib/schema";
import { youtubeSearchUrl, googleSearchUrl } from "@/lib/links";
import { vnd } from "@/lib/format";

const chip = "rounded-full bg-teal-tint px-3 py-1 text-xs font-medium text-teal";

export function DishCard({ dish, index }: { dish: Dish; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.06, 0.3) }}
      className="overflow-hidden rounded-card border border-hairline bg-surface shadow-card"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full px-6 py-5 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-ink">{dish.name}</h3>
            <p className="mt-1 text-sm text-ink-muted">{dish.description}</p>
          </div>
          <span className="shrink-0 rounded-full bg-coral-tint px-3 py-1 text-sm font-semibold text-coral">
            {vnd(dish.price)}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={chip}>{dish.cookTime} phút</span>
          <span className={chip}>{dish.difficulty}</span>
          <span className={chip}>~{dish.calories} kcal (ước tính)</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="border-t border-hairline"
          >
            <div className="space-y-5 px-6 py-5">
              <section>
                <h4 className="mb-2 text-sm font-semibold text-ink">Nguyên liệu</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-ink-muted">
                  {dish.ingredients.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section>
                <h4 className="mb-2 text-sm font-semibold text-ink">Cách làm</h4>
                <ol className="list-inside list-decimal space-y-1 text-sm text-ink-muted">
                  {dish.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </section>

              <section>
                <h4 className="mb-2 text-sm font-semibold text-ink">
                  Dinh dưỡng (ước tính)
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className={chip}>Đạm {dish.nutrition.protein}g</span>
                  <span className={chip}>Tinh bột {dish.nutrition.carbs}g</span>
                  <span className={chip}>Béo {dish.nutrition.fat}g</span>
                </div>
              </section>

              <div className="flex flex-wrap gap-3 pt-1">
                <a href={youtubeSearchUrl(dish.name)} target="_blank" rel="noopener noreferrer"
                  className="rounded-control border border-hairline px-4 py-2 text-sm font-medium text-teal hover:bg-teal-tint">
                  Xem trên YouTube
                </a>
                <a href={googleSearchUrl(dish.name)} target="_blank" rel="noopener noreferrer"
                  className="rounded-control border border-hairline px-4 py-2 text-sm font-medium text-teal hover:bg-teal-tint">
                  Tìm công thức
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
