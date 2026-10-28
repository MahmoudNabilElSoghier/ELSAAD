import { Injectable } from "@nestjs/common";
import { mockEmployees } from "@elsaad/shared";
import type { CreateEmployeeInput, Employee } from "@elsaad/shared";
import { withDb, type DbResult } from "../common/with-db";
import { toDomainError } from "../common/prisma-errors";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  getEmployees(): Promise<DbResult<Employee[]>> {
    return withDb(
      this.prisma,
      (db) =>
        db.employee.findMany({
          orderBy: { employeeNumber: "asc" },
          include: {
            branch: true,
            _count: { select: { orders: true, branchAssignments: true } },
          },
        }),
      () => mockEmployees,
    );
  }

  async create(input: CreateEmployeeInput): Promise<DbResult<Employee>> {
    if (!process.env.DATABASE_URL) {
      const now = new Date().toISOString();
      return {
        data: {
          id: `tmp-${input.employeeNumber.toLowerCase()}`,
          employeeNumber: input.employeeNumber,
          nameAr: input.nameAr,
          nameEn: input.nameEn ?? null,
          nationalId: input.nationalId ?? null,
          phone: input.phone,
          email: input.email || null,
          role: input.role,
          branchId: input.branchId ?? null,
          active: input.active ?? true,
          createdAt: now,
        },
        isMock: true,
      };
    }
    try {
      const created = await this.prisma.employee.create({
        data: {
          employeeNumber: input.employeeNumber,
          nameAr: input.nameAr,
          nameEn: input.nameEn ?? null,
          nationalId: input.nationalId ?? null,
          phone: input.phone,
          email: input.email || null,
          role: input.role,
          branchId: input.branchId || null,
          active: input.active ?? true,
        },
      });
      return { data: created, isMock: false };
    } catch (error) {
      toDomainError(error);
    }
  }
}
