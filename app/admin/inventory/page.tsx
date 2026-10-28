import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { getBranches } from "@/lib/services/branches";
import { getInventory, isLowStock } from "@/lib/services/inventory";

export const metadata: Metadata = {
  title: "المخزون | السعد للدراجات النارية",
};

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string }>;
}) {
  const { branch = "" } = await searchParams;
  const [branches, rows] = await Promise.all([
    getBranches(),
    getInventory(branch || undefined),
  ]);
  const lowCount = rows.filter(isLowStock).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">المخزون</h1>
          <p className="mt-1 text-sm text-muted">
            {nf.format(rows.length)} صنف في العرض — عدّل الكمية مباشرة ثم اضغط حفظ.
          </p>
        </div>
        {lowCount > 0 && (
          <p className="rounded-full bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-400">
            {nf.format(lowCount)} صنف تحت حد الطلب
          </p>
        )}
      </div>

      <form action="/admin/inventory" method="get" className="flex items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="branch-select"
            className="text-sm font-medium text-white"
          >
            تصفية حسب الفرع
          </label>
          <select
            id="branch-select"
            name="branch"
            defaultValue={branch}
            className="rounded-lg border border-border bg-bg px-4 py-3 text-white focus:border-accent focus:outline-none"
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

      <InventoryTable rows={rows} />
    </div>
  );
}
