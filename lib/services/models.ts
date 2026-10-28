import { mockCompatibilities, mockModels, mockProducts } from "@/lib/mock";
import type { MachineModel } from "./types";
import { withDb } from "./withDb";

export async function getModels(brandSlug?: string): Promise<MachineModel[]> {
  return withDb<MachineModel[]>(
    (db) =>
      db.machineModel.findMany({
        where: brandSlug ? { brand: { slug: brandSlug } } : {},
        orderBy: [{ category: "asc" }, { name: "asc" }],
        include: {
          brand: true,
          _count: { select: { compatibilities: true } },
        },
      }),
    () => mockModels.filter((model) => !brandSlug || model.brand?.slug === brandSlug)
  );
}

export async function getModelBySlug(
  brandSlug: string,
  modelSlug: string
): Promise<MachineModel | null> {
  return withDb<MachineModel | null>(
    (db) =>
      db.machineModel.findFirst({
        where: { slug: modelSlug, brand: { slug: brandSlug } },
        include: {
          brand: true,
          compatibilities: {
            include: {
              product: { include: { brand: true, inventory: true, images: true } },
            },
          },
        },
      }),
    () => {
      const model = mockModels.find(
        (item) => item.slug === modelSlug && item.brand?.slug === brandSlug
      );
      if (!model) return null;
      return {
        ...model,
        compatibilities: mockCompatibilities
          .filter((compat) => compat.modelId === model.id)
          .map((compat) => ({
            ...compat,
            product: mockProducts.find((product) => product.id === compat.productId),
          })),
      };
    }
  );
}
