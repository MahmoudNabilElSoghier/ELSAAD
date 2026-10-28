import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getBrands } from "@/lib/services/brands";
import { getLowStockItems } from "@/lib/services/inventory";
import { getOrders } from "@/lib/services/orders";
import { getProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "لوحة التحكم | السعد للدراجات النارية",
};

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");
const formatEgp = (value: number) => `${nf.format(value)} ج.م`;

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  confirmed: "bg-sky-500/15 text-sky-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  cancelled: "bg-red-500/15 text-red-400",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export default async function AdminHomePage() {
  const [brands, productPage, lowStockItems, orderPage] = await Promise.all([
    getBrands(),
    getProducts({ pageSize: 1 }),
    getLowStockItems(),
    getOrders({ pageSize: 5 }),
  ]);

  const cards = [
    { label: "الماركات", value: brands.length, danger: false },
    { label: "المنتجات", value: productPage.total, danger: false },
    { label: "الطلبات", value: orderPage.total, danger: false },
    { label: "مخزون منخفض", value: lowStockItems.length, danger: lowStockItems.length > 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-white">لوحة التحكم</h1>
        <div className="flex gap-3">
          <Button asChild size="sm">
            <Link href="/admin/products/new">منتج جديد</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/products">عرض الموقع</Link>
          </Button>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="إحصائيات المتجر">
        {cards.map((card) => (
          <li
            key={card.label}
            className={`rounded-xl border p-5 ${
              card.danger ? "border-red-500/40 bg-red-500/5" : "border-border bg-card"
            }`}
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p
              className={`mt-2 text-3xl font-extrabold ${
                card.danger ? "text-red-400" : "text-white"
              }`}
            >
              {nf.format(card.value)}
            </p>
          </li>
        ))}
      </ul>

      <section
        aria-labelledby="recent-orders"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <h2 id="recent-orders" className="border-b border-border px-5 py-4 font-bold text-white">
          أحدث الطلبات
        </h2>
        {orderPage.items.length === 0 ? (
          <p className="px-5 py-6 text-muted">لا توجد طلبات بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-5 py-3 font-medium">رقم الطلب</th>
                  <th className="px-5 py-3 font-medium">العميل</th>
                  <th className="px-5 py-3 font-medium">الفرع</th>
                  <th className="px-5 py-3 font-medium">الإجمالي</th>
                  <th className="px-5 py-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {orderPage.items.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-3 font-mono text-xs text-white" dir="ltr">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-white">{order.customer?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-white">{order.branch?.nameAr ?? "—"}</td>
                    <td className="px-5 py-3 text-white">{formatEgp(order.total)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[order.status] ?? "bg-bg text-muted"
                        }`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
