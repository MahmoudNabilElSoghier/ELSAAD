import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getProducts, totalStock } from "@elsaad/api-client";

export const metadata: Metadata = {
  title: "المنتجات | السعد للدراجات النارية",
};

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");
const formatEgp = (value: number | null) =>
  value == null ? "—" : `${nf.format(value)} ج.م`;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const result = await getProducts({
    q: q || undefined,
    page: pageNum,
    pageSize: 20,
    includeInactive: true,
  });

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return `/admin/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">المنتجات</h1>
          <p className="mt-1 text-sm text-muted">
            {nf.format(result.total)} منتج في القائمة
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/new">منتج جديد</Link>
        </Button>
      </div>

      <form action="/admin/products" method="get" className="flex items-end gap-2">
        <div className="w-full max-w-md">
          <Input
            label="بحث"
            name="q"
            defaultValue={q}
            placeholder="اسم المنتج، الكود، أو كود OEM"
          />
        </div>
        <Button type="submit" variant="secondary" size="md">
          بحث
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 font-medium">الكود</th>
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">الماركة</th>
                <th className="px-4 py-3 font-medium">التصنيف</th>
                <th className="px-4 py-3 font-medium">سعر الجملة</th>
                <th className="px-4 py-3 font-medium">سعر التجزئة</th>
                <th className="px-4 py-3 font-medium">المخزون</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">إجراء</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {result.items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted">
                    لا توجد منتجات مطابقة.
                  </td>
                </tr>
              ) : (
                result.items.map((product) => {
                  const stock = totalStock(product);
                  const low = stock <= product.reorderLevel;
                  return (
                    <tr key={product.id} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-white" dir="ltr">
                        {product.code}
                      </td>
                      <td className="px-4 py-3 text-white">{product.name}</td>
                      <td className="px-4 py-3 text-muted">{product.brand?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted">
                        {product.partCategory?.nameAr ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {formatEgp(product.wholesalePrice)}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {formatEgp(product.retailPrice)}
                      </td>
                      <td
                        className={`px-4 py-3 font-semibold ${
                          low ? "text-red-400" : "text-white"
                        }`}
                      >
                        {nf.format(stock)}
                        {low && <span className="mr-1 text-xs">(منخفض)</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.active
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-bg text-muted"
                          }`}
                        >
                          {product.active ? "نشط" : "موقوف"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-semibold text-accent hover:underline"
                        >
                          تعديل
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {result.totalPages > 1 && (
        <nav
          aria-label="صفحات المنتجات"
          className="flex items-center justify-between text-sm"
        >
          <Link
            href={pageHref(result.page - 1)}
            aria-disabled={result.page <= 1}
            className={`rounded-lg border border-border px-4 py-2 font-semibold ${
              result.page <= 1
                ? "pointer-events-none opacity-40"
                : "text-white hover:border-accent"
            }`}
          >
            السابق
          </Link>
          <span className="text-muted">
            صفحة {nf.format(result.page)} من {nf.format(result.totalPages)}
          </span>
          <Link
            href={pageHref(result.page + 1)}
            aria-disabled={result.page >= result.totalPages}
            className={`rounded-lg border border-border px-4 py-2 font-semibold ${
              result.page >= result.totalPages
                ? "pointer-events-none opacity-40"
                : "text-white hover:border-accent"
            }`}
          >
            التالي
          </Link>
        </nav>
      )}
    </div>
  );
}
