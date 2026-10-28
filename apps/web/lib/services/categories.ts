import { mockCategories } from "@elsaad/shared";
import type { PartCategory } from "@elsaad/shared";
import { withDb } from "./withDb";

export async function getPartCategories(): Promise<PartCategory[]> {
  return withDb<PartCategory[]>(
    (db) =>
      db.partCategory.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { products: true } } },
      }),
    () => mockCategories
  );
}

// Flattens the category list into a parent → children tree (roots first).
// Works identically for DB results and mock data.
export async function getCategoryTree(): Promise<PartCategory[]> {
  const flat = await getPartCategories();
  const byId = new Map<string, PartCategory>();
  for (const category of flat) byId.set(category.id, { ...category, children: [] });
  const roots: PartCategory[] = [];
  for (const category of byId.values()) {
    const parent = category.parentId ? byId.get(category.parentId) : undefined;
    if (parent && parent.children) parent.children.push(category);
    else roots.push(category);
  }
  return roots;
}
