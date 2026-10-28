import { Injectable } from "@nestjs/common";
import { mockInventory } from "@elsaad/shared";
import type { BranchInventory } from "@elsaad/shared";
import { withDb, type DbResult } from "../common/with-db";
import { PrismaService } from "../prisma/prisma.service";

// Low stock = quantity at or below the row's override, else the product default.
// NOTE: computed in JS (Prisma cannot compare two columns in one where clause) —
// acceptable at Phase 2 scale; revisit with a raw query if inventory grows large.
export function isLowStock(item: BranchInventory): boolean {
  const threshold = item.reorderLevel ?? item.product?.reorderLevel ?? 0;
  return item.quantity <= threshold;
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Inventory can be viewed globally or scoped to one branch (admin selector).
  getInventory(branchId?: string): Promise<DbResult<BranchInventory[]>> {
    return withDb(
      this.prisma,
      (db) =>
        db.branchInventory.findMany({
          where: branchId ? { branchId } : {},
          orderBy: [{ branchId: "asc" }, { quantity: "asc" }],
          include: {
            branch: true,
            product: { include: { brand: true } },
          },
        }),
      () => {
        const rows = mockInventory.filter((item) => !branchId || item.branchId === branchId);
        return [...rows].sort((a, b) => a.quantity - b.quantity);
      },
    );
  }

  async getLowStock(branchId?: string): Promise<DbResult<BranchInventory[]>> {
    const all = await this.getInventory(branchId);
    return { data: all.data.filter(isLowStock), isMock: all.isMock };
  }
}
