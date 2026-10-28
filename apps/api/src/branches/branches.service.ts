import { Inject, Injectable } from "@nestjs/common";
import { fromPrismaBranch, mockBranches, mockInventory } from "@elsaad/shared";
import type { Branch, CreateBranchInput } from "@elsaad/shared";
import { withDb, type DbResult } from "../common/with-db";
import { toDomainError } from "../common/prisma-errors";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BranchesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  getBranches(): Promise<DbResult<Branch[]>> {
    return withDb(
      this.prisma,
      async (db) => {
        const rows = await db.branch.findMany({
          orderBy: { displayOrder: "asc" },
          include: {
            _count: { select: { inventory: true, employees: true, orders: true } },
          },
        });
        return rows.map(fromPrismaBranch);
      },
      () => mockBranches,
    );
  }

  getBranchBySlug(slug: string): Promise<DbResult<Branch | null>> {
    return withDb(
      this.prisma,
      async (db) => {
        const branch = await db.branch.findUnique({
          where: { slug },
          include: {
            inventory: { include: { product: true } },
            _count: { select: { inventory: true, employees: true, orders: true } },
          },
        });
        return branch ? fromPrismaBranch(branch) : null;
      },
      () => {
        const branch = mockBranches.find((item) => item.slug === slug);
        if (!branch) return null;
        return {
          ...branch,
          inventory: mockInventory.filter((item) => item.branchId === branch.id),
        };
      },
    );
  }

  async create(input: CreateBranchInput): Promise<DbResult<Branch>> {
    if (!process.env.DATABASE_URL) {
      const now = new Date().toISOString();
      return {
        data: {
          id: `tmp-${input.slug}`,
          code: input.code,
          slug: input.slug,
          nameAr: input.nameAr,
          nameEn: input.nameEn ?? null,
          type: input.type,
          phone: input.phone || null,
          whatsapp: input.whatsapp || null,
          address: input.address,
          addressEn: input.addressEn ?? null,
          governorate: input.governorate,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          openingHours: input.openingHours ?? null,
          managerId: null,
          active: input.active ?? true,
          displayOrder: input.displayOrder ?? 0,
          createdAt: now,
          updatedAt: now,
        },
        isMock: true,
      };
    }
    try {
      const created = await this.prisma.get().branch.create({
        data: {
          code: input.code,
          slug: input.slug,
          nameAr: input.nameAr,
          nameEn: input.nameEn ?? null,
          type: input.type,
          phone: input.phone || null,
          whatsapp: input.whatsapp || null,
          address: input.address,
          addressEn: input.addressEn ?? null,
          governorate: input.governorate,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          openingHours: input.openingHours ?? undefined,
          active: input.active ?? true,
          displayOrder: input.displayOrder ?? 0,
        },
      });
      return { data: fromPrismaBranch(created), isMock: false };
    } catch (error) {
      toDomainError(error);
    }
  }
}
