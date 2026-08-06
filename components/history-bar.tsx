"use client";

import { useState } from "react";
import { CustomModal } from "@/components/ui/custom-modal";

export function HistoryBar({
  dishes,
  onClear,
}: {
  dishes: string[];
  onClear: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (dishes.length === 0) return null;

  const shown = dishes.slice(0, 3).join(", ");
  const rest = dishes.length - 3;

  function handleConfirmClear() {
    onClear();
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-sm text-ink-muted">
        <span>
          Tuần này đã nấu: {shown}
          {rest > 0 && `, +${rest} món`}
        </span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="font-medium text-teal underline underline-offset-2 transition hover:text-teal-soft"
        >
          Xoá lịch sử
        </button>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Xoá lịch sử món ăn"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-control border border-hairline px-4 py-2 text-sm font-medium text-ink hover:bg-hairline/40"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="rounded-control bg-coral px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
            >
              Xoá lịch sử
            </button>
          </>
        }
      >
        Bạn có chắc chắn muốn xoá danh sách các món ăn đã nấu trong tuần này không? Các món ăn sẽ có thể được đề xuất lại trong lần tạo tiếp theo.
      </CustomModal>
    </>
  );
}
