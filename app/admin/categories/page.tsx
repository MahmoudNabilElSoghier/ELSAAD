import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { getCategoryTree } from "@/lib/services/categories";

export const metadata: Metadata = {
  title: "التصنيفات | السعد للدراجات النارية",
};

export default async function AdminCategoriesPage() {
  const tree = await getCategoryTree();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">التصنيفات</h1>
        <p className="mt-1 text-sm text-muted">
          شجرة تصنيفات قطع الغيار (جذور وأبناء) — يظهر عدد المنتجات لكل تصنيف.
        </p>
      </div>
      <CategoryManager tree={tree} />
    </div>
  );
}
