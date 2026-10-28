import { mockInventory } from "@elsaad/shared";
import type { BranchInventory } from "@elsaad/shared";
import { withDb } from "./withDb";

// Inventory can be viewed globally or scoped to one branch (admin selector).
export async function getInventory(branchId?: string): Promise<BranchInventory[]> {
  return withDb<BranchInventory[]>(
    (db) =>
      db.branchInventory.findMany({
        where: branchId ? { branchId } : {},
        orderBy: [{ branchId: "asc" }, { quantity: "asc" }],
        include: {
          branch: true,
          product: { include: { brand: true } },
        },
      }),
    async () => {
      const rows = mockInventory.filter((item) => !branchId || item.branchId === branchId);
      return [...rows].sort((a, b) => a.quantity - b.quantity);
    }
  );
}

// Low stock = quantity at or below the row's override, else the product default.
// NOTE: computed in JS (Prisma cannot compare two columns in one where clause) —
// acceptable at Phase 2 scale; revisit with a raw query if inventory grows large.
export function isLowStock(item: BranchInventory): boolean {
  const threshold = item.reorderLevel ?? item.product?.reorderLevel ?? 0;
  return item.quantity <= threshold;
}

export async function getLowStockItems(): Promise<BranchInventory[]> {
  const all = await getInventory();
  return all.filter(isLowStock);
}
