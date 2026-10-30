"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormBanner } from "@/components/admin/FormBanner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getProducts, deleteProduct, totalStock, type ProductPage } from "@elsaad/api-client";
import type { Product } from "@elsaad/shared";
import { Loader2 } from "lucide-react";

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");
const formatEgp = (value: number | null) =>
  value == null ? "—" : `${nf.format(value)} ج.م`;

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = searchParams.get("page") ?? "1";
  const pageNum = Math.max(1, Number(page) || 1);

  const [result, setResult] = useState<ProductPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    setLoading(true);
    getProducts({
      q: q || undefined,
      page: pageNum,
      pageSize: 20,
      includeInactive: true,
    })
      .then(setResult)
      .finally(() => setLoading(false));
  }, [q, pageNum, refreshKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBanner(null);
    try {
      await deleteProduct(deleteTarget.id);
      setBanner({ type: "success", message: "تم حذف المنتج بنجاح" });
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setBanner({
        type: "error",
        message: err instanceof Error ? err.message : "تعسّر حذف المنتج",
      });
      setDeleteTarget(null);
    }
  };

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return `/admin/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">المنتجات</h1>
          <p className="mt-1 text-sm text-muted">
            {result ? `${nf.format(result.total)} منتج في القائمة` : "جاري التحميل..."}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/new">منتج جديد</Link>
        </Button>
      </div>

      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

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

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#E63946]" />
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="px-4 py-3 font-medium text-right">الكود</th>
                    <th className="px-4 py-3 font-medium text-right">الاسم</th>
                    <th className="px-4 py-3 font-medium text-right">الماركة</th>
                    <th className="px-4 py-3 font-medium text-right">التصنيف</th>
                    <th className="px-4 py-3 font-medium text-right">سعر الجملة</th>
                    <th className="px-4 py-3 font-medium text-right">سعر التجزئة</th>
                    <th className="px-4 py-3 font-medium text-right">المخزون</th>
                    <th className="px-4 py-3 font-medium text-right">الحالة</th>
                    <th className="px-4 py-3 font-medium text-right">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {!result || result.items.length === 0 ? (
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
                          <td className="px-4 py-3 flex gap-3 text-sm">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="font-semibold text-accent hover:underline"
                            >
                              تعديل
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(product)}
                              className="text-red-400 hover:text-red-300"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {result && result.totalPages > 1 && (
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
        </>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="حذف المنتج"
          message={`هل أنت متأكد من حذف المنتج "${deleteTarget.name}"؟`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
