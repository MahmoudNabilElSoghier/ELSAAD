import type { BranchInventory, Product } from "./types";

export function totalStock(product: Product): number {
  return (product.inventory ?? []).reduce((sum, item) => sum + item.quantity, 0);
}

// Low stock = quantity at or below the row's override, else the product default.
// NOTE: computed in JS (Prisma cannot compare two columns in one where clause) —
// acceptable at Phase 2 scale; revisit with a raw query if inventory grows large.
export function isLowStock(item: BranchInventory): boolean {
  const threshold = item.reorderLevel ?? item.product?.reorderLevel ?? 0;
  return item.quantity <= threshold;
}
