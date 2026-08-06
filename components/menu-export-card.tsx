import { ReactNode, forwardRef } from "react";
import type { DinnerMenu } from "@/lib/schema";
import { vnd, toSentenceCase } from "@/lib/format";

interface MenuExportCardProps {
  menu: DinnerMenu;
}

export const MenuExportCard = forwardRef<HTMLDivElement, MenuExportCardProps>(
  ({ menu }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[680px] bg-[#FAF7F2] p-8 text-[#1E293B] font-sans antialiased space-y-6 rounded-3xl border border-[#E2E8F0] shadow-xl"
      >
        {/* Header Branding */}
        <header className="flex items-center justify-between border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E05D38] px-3.5 py-1 text-xs font-bold text-white shadow-sm">
              <span>Dinner AI</span>
            </div>
            <h1 className="mt-3 text-2xl font-black text-[#1E293B] tracking-tight">
              {toSentenceCase(menu.menuName)}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-[#64748B]">Thực đơn hôm nay</p>
            <p className="text-sm font-bold text-[#E05D38]">
              {new Date().toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </header>

        {/* Summary Stats Grid */}
        <section className="grid grid-cols-4 gap-3">
          <StatBox label="Chi phí ước tính" value={vnd(menu.summary.totalCost)} highlight />
          <StatBox label="Thời gian nấu" value={`${menu.summary.totalTime} phút`} />
          <StatBox label="Calo ước tính" value={`${menu.summary.totalCalories} kcal`} />
          <StatBox label="Số món chính" value={`${menu.summary.dishCount} món`} />
        </section>

        {/* Main Dishes & Recipes */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-[#1E293B]">
            Danh Sách Món Chính & Cách Làm
          </h2>
          {menu.dishes.map((dish, index) => (
            <div
              key={dish.name}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-[#E05D38] uppercase tracking-wider">
                    Món {index + 1}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#1E293B]">{dish.name}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{dish.description}</p>
                </div>
                <div className="text-right text-xs space-y-1">
                  <span className="inline-block rounded-md bg-[#F1F5F9] px-2 py-0.5 font-medium text-[#475569]">
                    {dish.cookTime} phút • {dish.difficulty}
                  </span>
                  <p className="font-semibold text-[#0F766E]">{vnd(dish.price)}</p>
                </div>
              </div>

              {/* Ingredients & Steps */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F1F5F9] text-xs">
                <div>
                  <p className="font-bold text-[#334155] mb-1.5">
                    Nguyên liệu:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#475569]">
                    {dish.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-[#334155] mb-1.5">
                    Cách làm:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[#475569]">
                    {dish.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Side Dishes */}
        {Boolean(menu.sideDishes?.length) && (
          <section className="rounded-2xl border border-[#CCFBF1] bg-[#F0FDFA] p-4">
            <h3 className="text-xs font-bold text-[#0F766E] mb-2">
              Món Phụ & Đồ Ăn Kèm
            </h3>
            <div className="flex flex-wrap gap-2">
              {menu.sideDishes?.map((side) => (
                <span
                  key={side}
                  className="rounded-full bg-white border border-[#99F6E4] px-3 py-1 text-xs font-medium text-[#0F766E]"
                >
                  {side}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Shopping List */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3">
          <h2 className="text-sm font-bold text-[#1E293B]">
            Danh Sách Đi Chợ
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-[#E05D38] mb-1">Cần Mua:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[#334155]">
                {menu.shoppingList.needToBuy.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#0F766E] mb-1">Đã Có Sẵn Tại Nhà:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[#64748B]">
                {menu.shoppingList.alreadyHave.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-2 text-center text-xs font-medium text-[#94A3B8] border-t border-[#E2E8F0]">
          Dinner AI — Tối nay nhà mình ăn gì? | @yun.khngn
        </footer>
      </div>
    );
  },
);

MenuExportCard.displayName = "MenuExportCard";

function StatBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 text-center border ${highlight
          ? "bg-[#FFF7ED] border-[#FFEDD5] text-[#E05D38]"
          : "bg-white border-[#E2E8F0] text-[#334155]"
        }`}
    >
      <p className="text-[10px] font-medium opacity-75">{label}</p>
      <p className="text-sm font-black mt-0.5">{value}</p>
    </div>
  );
}
