"use client";

import { useState } from "react";
import {
  GenerateRequestSchema,
  CUISINES,
  DIETS,
  OCCASIONS,
  type GenerateRequest,
} from "@/lib/schema";
import { CustomSelect, type SelectOption } from "@/components/ui/custom-select";
import { CustomAlert } from "@/components/ui/custom-alert";

const CUISINE_OPTIONS: SelectOption[] = [
  { value: "vietnamese", label: "Việt Nam" },
  { value: "japanese", label: "Nhật Bản" },
  { value: "korean", label: "Hàn Quốc" },
  { value: "chinese", label: "Trung Hoa" },
  { value: "thai", label: "Thái Lan" },
  { value: "italian", label: "Ý" },
  { value: "american", label: "Mỹ" },
  { value: "mixed", label: "Kết hợp" },
];

const COOK_TIME_OPTIONS: SelectOption[] = [
  { value: "15", label: "15 phút" },
  { value: "30", label: "30 phút" },
  { value: "45", label: "45 phút" },
  { value: "60", label: "60+ phút" },
];

const DIET_OPTIONS: SelectOption[] = [
  { value: "", label: "Không yêu cầu" },
  { value: "regular", label: "Bình thường" },
  { value: "healthy", label: "Lành mạnh" },
  { value: "high-protein", label: "Nhiều đạm" },
  { value: "vegetarian", label: "Chay" },
  { value: "low-carb", label: "Ít tinh bột" },
];

const OCCASION_OPTIONS: SelectOption[] = [
  { value: "", label: "Không yêu cầu" },
  { value: "family", label: "Gia đình" },
  { value: "date", label: "Hẹn hò" },
  { value: "weekend", label: "Cuối tuần" },
  { value: "friends", label: "Bạn bè" },
  { value: "comfort", label: "An ủi" },
];

const field =
  "w-full rounded-control border border-hairline bg-surface px-4 py-3 text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";
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
          <input
            id="people"
            className={field}
            type="number"
            min={1}
            max={10}
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </div>
        <div>
          <label className={label} htmlFor="budget">Ngân sách (VNĐ)</label>
          <input
            id="budget"
            className={field}
            type="number"
            step={10000}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <div>
          <label className={label} htmlFor="cuisine">Ẩm thực</label>
          <CustomSelect
            id="cuisine"
            aria-label="Ẩm thực"
            value={cuisine}
            onChange={(val) => setCuisine(val as (typeof CUISINES)[number])}
            options={CUISINE_OPTIONS}
            disabled={disabled}
          />
        </div>
        <div>
          <label className={label} htmlFor="cookTime">Thời gian nấu tối đa</label>
          <CustomSelect
            id="cookTime"
            aria-label="Thời gian nấu tối đa"
            value={maxCookTime}
            onChange={setMaxCookTime}
            options={COOK_TIME_OPTIONS}
            disabled={disabled}
          />
        </div>
        <div>
          <label className={label} htmlFor="diet">Chế độ ăn (không bắt buộc)</label>
          <CustomSelect
            id="diet"
            aria-label="Chế độ ăn (không bắt buộc)"
            value={diet}
            onChange={setDiet}
            options={DIET_OPTIONS}
            disabled={disabled}
          />
        </div>
        <div>
          <label className={label} htmlFor="occasion">Dịp (không bắt buộc)</label>
          <CustomSelect
            id="occasion"
            aria-label="Dịp (không bắt buộc)"
            value={occasion}
            onChange={setOccasion}
            options={OCCASION_OPTIONS}
            disabled={disabled}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="available">Nguyên liệu sẵn có (không bắt buộc)</label>
          <input
            id="available"
            className={field}
            placeholder="Trứng, Cà chua, Hành tây"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="avoid">Nguyên liệu cần tránh (không bắt buộc)</label>
          <input
            id="avoid"
            className={field}
            placeholder="Hải sản, Nấm"
            value={avoid}
            onChange={(e) => setAvoid(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mt-5">
          <CustomAlert variant="error" title="Thông tin không hợp lệ">
            {error}
          </CustomAlert>
        </div>
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
