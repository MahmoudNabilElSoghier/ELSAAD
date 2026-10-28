import { Injectable } from "@nestjs/common";
import { mockCompatibilities, mockModels, mockProducts } from "@elsaad/shared";
import type { MachineModel } from "@elsaad/shared";
import { withDb, type DbResult } from "../common/with-db";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  getModels(brandSlug?: string): Promise<DbResult<MachineModel[]>> {
    return withDb(
      this.prisma,
      (db) =>
        db.machineModel.findMany({
          where: brandSlug ? { brand: { slug: brandSlug } } : {},
          orderBy: [{ category: "asc" }, { name: "asc" }],
          include: {
            brand: true,
            _count: { select: { compatibilities: true } },
          },
        }),
      () => mockModels.filter((model) => !brandSlug || model.brand?.slug === brandSlug),
    );
  }

  getModelBySlug(
    brandSlug: string,
    modelSlug: string,
  ): Promise<DbResult<MachineModel | null>> {
    return withDb(
      this.prisma,
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
          (item) => item.slug === modelSlug && item.brand?.slug === brandSlug,
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
      },
    );
  }
}
