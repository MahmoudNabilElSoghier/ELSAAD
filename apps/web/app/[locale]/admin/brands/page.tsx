"use client";

import { useEffect, useState } from "react";
import { BrandForm } from "@/components/admin/BrandForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormBanner } from "@/components/admin/FormBanner";
import { getBrands, deleteBrand } from "@elsaad/api-client";
import type { Brand } from "@elsaad/shared";
import { Loader2 } from "lucide-react";

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    setLoading(true);
    getBrands()
      .then(setBrands)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBanner(null);
    try {
      await deleteBrand(deleteTarget.id);
      setBanner({ type: "success", message: "تم حذف الماركة بنجاح" });
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setBanner({
        type: "error",
        message: err instanceof Error ? err.message : "تعسّر حذف الماركة",
      });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">الماركات</h1>
        <p className="mt-1 text-sm text-muted">
          {loading ? "جاري التحميل..." : `${nf.format(brands.length)} ماركة مع عدد الموديلات والمنتجات لكل منها.`}
        </p>
      </div>

      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      <BrandForm onSuccess={refetch} />

      {editingBrand && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#151515] border border-[#262626] rounded-xl p-6">
            <BrandForm
              mode="edit"
              initialData={editingBrand}
              onSuccess={() => {
                setEditingBrand(null);
                refetch();
              }}
              onCancel={() => setEditingBrand(null)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#E63946]" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-4 py-3 font-medium text-right">الاسم بالعربي</th>
                  <th className="px-4 py-3 font-medium text-right">الاسم بالإنجليزي</th>
                  <th className="px-4 py-3 font-medium text-right">المعرّف</th>
                  <th className="px-4 py-3 font-medium text-right">الموديلات</th>
                  <th className="px-4 py-3 font-medium text-right">المنتجات</th>
                  <th className="px-4 py-3 font-medium text-right">الموقع</th>
                  <th className="px-4 py-3 font-medium text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted">
                      لا توجد ماركات بعد.
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr key={brand.id} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 font-semibold text-white">
                        {brand.nameAr ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-white" dir="ltr">
                        {brand.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted" dir="ltr">
                        {brand.slug}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {nf.format(brand._count?.models ?? 0)}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {nf.format(brand._count?.products ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        {brand.website ? (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent hover:underline"
                            dir="ltr"
                          >
                            {brand.website}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 flex gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => setEditingBrand(brand)}
                          className="font-semibold text-accent hover:underline"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(brand)}
                          className="text-red-400 hover:text-red-300"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="حذف الماركة"
          message={`هل أنت متأكد من حذف الماركة "${deleteTarget.nameAr ?? deleteTarget.name}"؟`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
