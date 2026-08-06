import type { DinnerMenu } from "@/lib/schema";

export function ShoppingList({ list }: { list: DinnerMenu["shoppingList"] }) {
  return (
    <section className="rounded-card border border-hairline bg-surface p-6 shadow-card">
      <h2 className="mb-4 text-lg font-bold text-ink">Danh sách đi chợ</h2>

      <h3 className="mb-2 text-sm font-semibold text-coral">Cần mua</h3>
      {list.needToBuy.length ? (
        <ul className="mb-5 list-inside list-disc space-y-1 text-sm text-ink-muted">
          {list.needToBuy.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : (
        <p className="mb-5 text-sm text-ink-muted">Không cần mua thêm gì.</p>
      )}

      {list.alreadyHave.length > 0 && (
        <>
          <h3 className="mb-2 text-sm font-semibold text-teal">Đã có sẵn</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-ink-muted">
            {list.alreadyHave.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </>
      )}
    </section>
  );
}
