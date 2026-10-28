import type { Metadata } from "next";
import { BrandForm } from "@/components/admin/BrandForm";
import { getBrands } from "@/lib/services/brands";

export const metadata: Metadata = {
  title: "الماركات | السعد للدراجات النارية",
};

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">الماركات</h1>
        <p className="mt-1 text-sm text-muted">
          {nf.format(brands.length)} ماركة مع عدد الموديلات والمنتجات لكل منها.
        </p>
      </div>

      <BrandForm />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 font-medium">الاسم بالعربي</th>
                <th className="px-4 py-3 font-medium">الاسم بالإنجليزي</th>
                <th className="px-4 py-3 font-medium">المعرّف</th>
                <th className="px-4 py-3 font-medium">الموديلات</th>
                <th className="px-4 py-3 font-medium">المنتجات</th>
                <th className="px-4 py-3 font-medium">الموقع</th>
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
      {/* TODO(Phase 2D): per-row brand editing — reason: needs the authenticated
          write API first (decision 1B); creation is demo-only today. */}
    </div>
  );
}
