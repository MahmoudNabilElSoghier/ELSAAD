import type { Branch } from "./branch";
import type { Order } from "./order";
import type { Dateish } from "./common";

export interface Employee {
  id: string;
  employeeNumber: string;
  nameAr: string;
  nameEn: string | null;
  nationalId: string | null;
  phone: string;
  email: string | null;
  role: string;
  branchId: string | null;
  branch?: Branch | null;
  active: boolean;
  createdAt: Dateish;
  managedBranches?: Branch[];
  branchAssignments?: EmployeeBranchAssignment[];
  orders?: Order[];
  _count?: { orders: number; branchAssignments: number };
}

export interface EmployeeBranchAssignment {
  id: string;
  employeeId: string;
  employee?: Employee;
  branchId: string;
  branch?: Branch;
  assignedAt: Dateish;
  isActive: boolean;
}
