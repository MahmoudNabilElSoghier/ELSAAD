"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { getBranches, getInventory, isLowStock } from "@elsaad/api-client";
import type { Branch, BranchInventory } from "@elsaad/shared";
import { Loader2 } from "lucide-react";

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default function AdminInventoryPage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") ?? "";

  const [branches, setBranches] = useState<Branch[]>([]);
  const [rows, setRows] = useState<BranchInventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getBranches(),
      getInventory(branch || undefined),
    ])
      .then(([b, r]) => {
        setBranches(b);
        setRows(r);
      })
      .finally(() => setLoading(false));
  }, [branch]);

  const lowCount = rows.filter(isLowStock).length;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg">المخزون</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "جاري التحميل..." : `${nf.format(rows.length)} صنف في العرض — عدّل الكمية مباشرة ثم اضغط حفظ.`}
          </p>
        </div>
        {!loading && lowCount > 0 && (
          <p className="rounded-full bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-400">
            {nf.format(lowCount)} صنف تحت حد الطلب
          </p>
        )}
      </div>

      <form action="/admin/inventory" method="get" className="flex items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="branch-select"
            className="text-sm font-medium text-fg"
          >
            تصفية حسب الفرع
          </label>
          <select
            id="branch-select"
            name="branch"
            defaultValue={branch}
            className="rounded-lg border border-border bg-bg px-4 py-3 text-fg focus:border-accent focus:outline-none"
          >
            <option value="">كل الفروع</option>
            {branches.map((branchItem) => (
              <option key={branchItem.id} value={branchItem.id}>
                {branchItem.nameAr}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="secondary" size="md">
          عرض
        </Button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <InventoryTable rows={rows} />
      )}
    </div>
  );
}
