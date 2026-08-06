"use client";

import { useEffect, useState } from "react";
import { PreferenceForm } from "@/components/preference-form";
import { MenuResult } from "@/components/menu-result";
import { HistoryBar } from "@/components/history-bar";
import { CustomAlert } from "@/components/ui/custom-alert";
import { useMenuStream } from "@/lib/use-menu-stream";
import {
  readHistory,
  addHistoryEntry,
  clearHistory,
  recentDishNames,
} from "@/lib/history";
import type { GenerateRequest } from "@/lib/schema";

export default function Home() {
  const { status, partial, menu, error, generate, reset } = useMenuStream();
  const [recent, setRecent] = useState<string[]>([]);

  // Read on mount only: localStorage is unavailable during SSR.
  useEffect(() => setRecent(recentDishNames(readHistory())), []);

  useEffect(() => {
    if (status === "done" && menu) {
      const updated = addHistoryEntry(menu.dishes.map((d) => d.name));
      setRecent(recentDishNames(updated));
    }
  }, [status, menu]);

  function handleSubmit(input: GenerateRequest) {
    void generate({ ...input, recentDishes: recent.length ? recent : undefined });
  }

  function handleClear() {
    clearHistory();
    setRecent([]);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-8">
        <span className="inline-flex items-center rounded-full bg-teal-tint px-4 py-1.5 text-sm font-medium text-teal">
          Bữa tối trong vài giây
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Tối nay nhà mình
          <br />
          <span className="text-coral">ăn gì?</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
          Cho biết mấy người ăn và bao nhiêu tiền, phần còn lại để đây lo — thực
          đơn, công thức, và danh sách đi chợ.
        </p>
      </header>

      <div className="space-y-4">
        <PreferenceForm onSubmit={handleSubmit} disabled={status === "streaming"} />
        <HistoryBar dishes={recent} onClear={handleClear} />
      </div>

      {status === "error" && (
        <div className="mt-8">
          <CustomAlert
            variant="error"
            title="Đã xảy ra lỗi"
            onRetry={reset}
            retryText="Thử lại"
          >
            {error}
          </CustomAlert>
        </div>
      )}

      {(status === "streaming" || status === "done") && (
        <div className="mt-10">
          <MenuResult menu={menu} partial={partial} />
        </div>
      )}
    </main>
  );
}
