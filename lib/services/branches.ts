import type { Branch } from "./types";
import { withDb } from "./withDb";

export async function getBranches(): Promise<Branch[]> {
  return withDb<Branch[]>(
    (db) =>
      db.branch.findMany({
        orderBy: { displayOrder: "asc" },
        include: {
          _count: { select: { inventory: true, employees: true, orders: true } },
        },
      }),
    () => []
  );
}

export async function getBranchBySlug(slug: string): Promise<Branch | null> {
  return withDb<Branch | null>(
    (db) =>
      db.branch.findUnique({
        where: { slug },
        include: {
          inventory: { include: { product: true } },
          _count: { select: { inventory: true, employees: true, orders: true } },
        },
      }),
    () => null
  );
}
