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
  readLastMenu,
  saveLastMenu,
} from "@/lib/history";
import type { DinnerMenu, GenerateRequest } from "@/lib/schema";

export default function Home() {
  const { status, partial, menu, error, generate, reset } = useMenuStream();
  const [recent, setRecent] = useState<string[]>([]);
  const [savedMenu, setSavedMenu] = useState<DinnerMenu | null>(null);

  // Read on mount only: localStorage is unavailable during SSR.
  useEffect(() => {
    setRecent(recentDishNames(readHistory()));
    setSavedMenu(readLastMenu());
  }, []);

  useEffect(() => {
    if (status === "done" && menu) {
      const updated = addHistoryEntry(menu.dishes.map((d) => d.name));
      setRecent(recentDishNames(updated));
      saveLastMenu(menu);
      setSavedMenu(menu);
    }
  }, [status, menu]);

  function handleSubmit(input: GenerateRequest) {
    void generate({ ...input, recentDishes: recent.length ? recent : undefined });
  }

  function handleClear() {
    clearHistory();
    setRecent([]);
    setSavedMenu(null);
  }

  const activeMenu = menu ?? (status === "idle" ? savedMenu : null);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-8">
        <span className="inline-flex items-center rounded-full bg-teal-tint px-4 py-1.5 text-sm font-medium text-teal">
          Tạo bởi @yun.khngn
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Tối nay
          <span className="text-coral"> ăn gì?</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
          Xây dựng thực đơn cho gia đình dựa trên calo thiết yếu và tài chính cụ thể.
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

      {(status === "streaming" || activeMenu) && (
        <div className="mt-10 space-y-3">
          {status === "idle" && savedMenu && (
            <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-teal" />
              <span>Thực đơn gần nhất đã lưu:</span>
            </div>
          )}
          <MenuResult menu={activeMenu} partial={partial} />
        </div>
      )}
    </main>
  );
}
