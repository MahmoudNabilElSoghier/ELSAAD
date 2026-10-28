import { mockEmployees } from "@elsaad/shared";
import type { Employee } from "@elsaad/shared";
import { withDb } from "./withDb";

export async function getEmployees(): Promise<Employee[]> {
  return withDb<Employee[]>(
    (db) =>
      db.employee.findMany({
        orderBy: { employeeNumber: "asc" },
        include: {
          branch: true,
          _count: { select: { orders: true, branchAssignments: true } },
        },
      }),
    () => mockEmployees
  );
}
