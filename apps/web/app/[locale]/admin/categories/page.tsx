"use client";

import { useEffect, useState } from "react";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { getCategoryTree } from "@elsaad/api-client";
import type { PartCategory } from "@elsaad/shared";
import { Loader2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [tree, setTree] = useState<PartCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    setLoading(true);
    getCategoryTree()
      .then(setTree)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-fg">التصنيفات</h1>
        <p className="mt-1 text-sm text-muted">
          شجرة تصنيفات قطع الغيار (جذور وأبناء) — يظهر عدد المنتجات لكل تصنيف.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <CategoryManager tree={tree} onSuccess={refetch} />
      )}
    </div>
  );
}
