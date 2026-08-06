"use client";

import { useState } from "react";
import {
  GenerateRequestSchema,
  CUISINES,
  DIETS,
  OCCASIONS,
  type GenerateRequest,
} from "@/lib/schema";

const CUISINE_LABEL: Record<(typeof CUISINES)[number], string> = {
  vietnamese: "Việt Nam", japanese: "Nhật Bản", korean: "Hàn Quốc",
  chinese: "Trung Hoa", thai: "Thái Lan", italian: "Ý",
  american: "Mỹ", mixed: "Kết hợp",
};
const DIET_LABEL: Record<(typeof DIETS)[number], string> = {
  regular: "Bình thường", healthy: "Lành mạnh", "high-protein": "Nhiều đạm",
  vegetarian: "Chay", "low-carb": "Ít tinh bột",
};
const OCCASION_LABEL: Record<(typeof OCCASIONS)[number], string> = {
  family: "Gia đình", date: "Hẹn hò", weekend: "Cuối tuần",
  friends: "Bạn bè", comfort: "An ủi",
};

const field =
  "w-full rounded-control border border-hairline bg-surface px-4 py-3 text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20";
const label = "mb-2 block text-sm font-medium text-ink";

function splitList(value: string): string[] | undefined {
  const items = value.split(",").map((s) => s.trim()).filter(Boolean);
  return items.length ? items : undefined;
}

export function PreferenceForm({
  onSubmit,
  disabled = false,
}: {
  onSubmit: (input: GenerateRequest) => void;
  disabled?: boolean;
}) {
  const [people, setPeople] = useState("2");
  const [budget, setBudget] = useState("150000");
  const [cuisine, setCuisine] = useState<(typeof CUISINES)[number]>("vietnamese");
  const [maxCookTime, setMaxCookTime] = useState("30");
  const [available, setAvailable] = useState("");
  const [avoid, setAvoid] = useState("");
  const [diet, setDiet] = useState("");
  const [occasion, setOccasion] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const candidate = {
      people: Number(people),
      budget: Number(budget),
      cuisine,
      maxCookTime: Number(maxCookTime),
      availableIngredients: splitList(available),
      avoidIngredients: splitList(avoid),
      diet: diet || undefined,
      occasion: occasion || undefined,
    };
    const parsed = GenerateRequestSchema.safeParse(candidate);
    if (!parsed.success) {
      setError("Vui lòng kiểm tra lại số người, ngân sách và thời gian nấu.");
      return;
    }
    setError(null);
    onSubmit(parsed.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border border-hairline bg-surface p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="people">Số người ăn</label>
          <input id="people" className={field} type="number" min={1} max={10}
            value={people} onChange={(e) => setPeople(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="budget">Ngân sách (VNĐ)</label>
          <input id="budget" className={field} type="number" step={10000}
            value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="cuisine">Ẩm thực</label>
          <select id="cuisine" className={field} value={cuisine}
            onChange={(e) => setCuisine(e.target.value as (typeof CUISINES)[number])}>
            {CUISINES.map((c) => <option key={c} value={c}>{CUISINE_LABEL[c]}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="cookTime">Thời gian nấu tối đa</label>
          <select id="cookTime" className={field} value={maxCookTime}
            onChange={(e) => setMaxCookTime(e.target.value)}>
            {[15, 30, 45, 60].map((m) => (
              <option key={m} value={m}>{m === 60 ? "60+ phút" : `${m} phút`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="diet">Chế độ ăn (không bắt buộc)</label>
          <select id="diet" className={field} value={diet}
            onChange={(e) => setDiet(e.target.value)}>
            <option value="">Không yêu cầu</option>
            {DIETS.map((d) => <option key={d} value={d}>{DIET_LABEL[d]}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="occasion">Dịp (không bắt buộc)</label>
          <select id="occasion" className={field} value={occasion}
            onChange={(e) => setOccasion(e.target.value)}>
            <option value="">Không yêu cầu</option>
            {OCCASIONS.map((o) => <option key={o} value={o}>{OCCASION_LABEL[o]}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="available">Nguyên liệu sẵn có (không bắt buộc)</label>
          <input id="available" className={field} placeholder="Trứng, Cà chua, Hành tây"
            value={available} onChange={(e) => setAvailable(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="avoid">Nguyên liệu cần tránh (không bắt buộc)</label>
          <input id="avoid" className={field} placeholder="Hải sản, Nấm"
            value={avoid} onChange={(e) => setAvoid(e.target.value)} />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-coral">{error}</p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="mt-6 w-full rounded-control bg-coral px-6 py-4 text-base font-semibold text-white shadow-card transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? "Đang nấu…" : "Tạo thực đơn"}
      </button>
    </form>
  );
}
