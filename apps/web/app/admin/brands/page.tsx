"use client";

import { useEffect, useState } from "react";
import { BrandForm } from "@/components/admin/BrandForm";
import { getBrands } from "@elsaad/api-client";
import type { Brand } from "@elsaad/shared";
import { Loader2 } from "lucide-react";

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands()
      .then(setBrands)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">الماركات</h1>
        <p className="mt-1 text-sm text-muted">
          {loading ? "جاري التحميل..." : `${nf.format(brands.length)} ماركة مع عدد الموديلات والمنتجات لكل منها.`}
        </p>
      </div>

      <BrandForm />

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
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
