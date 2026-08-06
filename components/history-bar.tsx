"use client";

export function HistoryBar({
  dishes,
  onClear,
}: {
  dishes: string[];
  onClear: () => void;
}) {
  if (dishes.length === 0) return null;

  const shown = dishes.slice(0, 3).join(", ");
  const rest = dishes.length - 3;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-sm text-ink-muted">
      <span>
        Tuần này đã nấu: {shown}
        {rest > 0 && `, +${rest} món`}
      </span>
      <button
        type="button"
        onClick={onClear}
        className="font-medium text-teal underline underline-offset-2"
      >
        Xoá lịch sử
      </button>
    </div>
  );
}
