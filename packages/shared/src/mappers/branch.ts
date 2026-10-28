import type { Prisma } from "@prisma/client";
import type { Branch, BranchInventory } from "../types/branch";
import { parseOpeningHours } from "../schemas/branch";
import { fromPrismaProduct, type ProductRow } from "./product";

export type BranchRow = Omit<Prisma.BranchGetPayload<{}>, "openingHours"> & {
  openingHours: unknown;
  inventory?: BranchInventoryRow[];
};

export type BranchInventoryRow = Prisma.BranchInventoryGetPayload<{}> & {
  branch?: BranchRow;
  product?: ProductRow;
};

export function fromPrismaBranch(row: BranchRow): Branch {
  return {
    ...row,
    openingHours: parseOpeningHours(row.openingHours),
    inventory: row.inventory?.map(fromPrismaBranchInventory),
  };
}

export function fromPrismaBranchInventory(row: BranchInventoryRow): BranchInventory {
  return {
    ...row,
    branch: row.branch ? fromPrismaBranch(row.branch) : undefined,
    product: row.product ? fromPrismaProduct(row.product) : undefined,
  };
}
