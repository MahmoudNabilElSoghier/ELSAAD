import { mockBrands, mockModels } from "@/lib/mock";
import type { Brand } from "./types";
import { withDb } from "./withDb";

export async function getBrands(): Promise<Brand[]> {
  return withDb<Brand[]>(
    (db) =>
      db.brand.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { models: true, products: true } } },
      }),
    () => mockBrands
  );
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  return withDb<Brand | null>(
    (db) =>
      db.brand.findUnique({
        where: { slug },
        include: {
          models: { orderBy: { name: "asc" } },
          _count: { select: { models: true, products: true } },
        },
      }),
    () => {
      const brand = mockBrands.find((item) => item.slug === slug);
      if (!brand) return null;
      return {
        ...brand,
        models: mockModels.filter((model) => model.brandId === brand.id),
      };
    }
  );
}
