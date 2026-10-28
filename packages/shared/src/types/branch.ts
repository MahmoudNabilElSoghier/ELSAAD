import type { Employee, EmployeeBranchAssignment } from "./employee";
import type { Order } from "./order";
import type { Product } from "./product";
import type { Dateish } from "./common";

export type OpeningHours = Record<string, string>;

export interface Branch {
  id: string;
  code: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  type: string;
  phone: string | null;
  whatsapp: string | null;
  address: string;
  addressEn: string | null;
  governorate: string;
  latitude: number | null;
  longitude: number | null;
  openingHours: OpeningHours | null;
  managerId: string | null;
  manager?: Employee | null;
  active: boolean;
  displayOrder: number;
  createdAt: Dateish;
  updatedAt: Dateish;
  employees?: Employee[];
  assignments?: EmployeeBranchAssignment[];
  inventory?: BranchInventory[];
  orders?: Order[];
  _count?: { inventory: number; employees: number; orders: number };
}

export interface BranchInventory {
  id: string;
  branchId: string;
  branch?: Branch;
  productId: string;
  product?: Product;
  quantity: number;
  reorderLevel: number | null;
  updatedAt: Dateish;
}
