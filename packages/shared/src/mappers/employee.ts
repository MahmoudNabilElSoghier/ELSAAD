import type { Prisma } from "@prisma/client";
import type { Employee } from "../types/employee";
import { fromPrismaBranch, type BranchRow } from "./branch";

export type EmployeeRow = Prisma.EmployeeGetPayload<{}> & {
  branch?: BranchRow | null;
};

export function fromPrismaEmployee(row: EmployeeRow): Employee {
  return {
    ...row,
    branch: row.branch ? fromPrismaBranch(row.branch) : undefined,
  };
}
