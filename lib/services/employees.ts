import { mockEmployees } from "@/lib/mock";
import type { Employee } from "./types";
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
