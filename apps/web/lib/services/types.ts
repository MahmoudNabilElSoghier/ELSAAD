// Service-layer types mirroring prisma/schema.prisma (Phase 2 foundation).
// Why local instead of Prisma-generated: model type exports from @prisma/client do
// not exist until `prisma generate` runs, and that requires a real DATABASE_URL
// (not provisioned yet — strict rule: no migrate/db push/generate in this phase).
// TODO(Phase 2D): after `prisma generate`, switch these to Prisma-generated types.
// Note: Prisma Decimal price fields arrive as objects — services convert them to
// plain `number` before returning (see mapProduct/mapOrder) so values survive
// React server → client serialization.

export type Dateish = string | Date;

export interface Brand {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  order: number;
  createdAt: Dateish;
  updatedAt: Dateish;
  models?: MachineModel[];
  products?: Product[];
  _count?: { models: number; products: number };
}

export interface MachineModel {
  id: string;
  brandId: string;
  brand?: Brand;
  name: string;
  nameAr: string | null;
  slug: string;
  category: string;
  yearFrom: number | null;
  yearTo: number | null;
  engineCc: number | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: Dateish;
  compatibilities?: ProductCompatibility[];
  _count?: { compatibilities: number };
}

export interface PartCategory {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  parentId: string | null;
  parent?: PartCategory | null;
  children?: PartCategory[];
  order: number;
  createdAt: Dateish;
  products?: Product[];
  _count?: { products: number };
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  note: string | null;
  createdAt: Dateish;
  products?: Product[];
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
}

export interface ProductCompatibility {
  id: string;
  productId: string;
  product?: Product;
  modelId: string;
  model?: MachineModel;
  note: string | null;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  nameEn: string | null;
  description: string | null;
  oemCode: string | null;
  partCategoryId: string | null;
  partCategory?: PartCategory | null;
  brandId: string | null;
  brand?: Brand | null;
  supplierId: string | null;
  supplier?: Supplier | null;
  costPrice: number | null;
  wholesalePrice: number | null;
  retailPrice: number | null;
  vipPrice: number | null;
  taxRate: number;
  unitOfMeasure: string;
  reorderLevel: number;
  tags: string[];
  active: boolean;
  deletedAt: Dateish | null;
  createdAt: Dateish;
  updatedAt: Dateish;
  images?: ProductImage[];
  compatibilities?: ProductCompatibility[];
  inventory?: BranchInventory[];
  orderItems?: OrderItem[];
}

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

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  phone2: string | null;
  email: string | null;
  type: string;
  address: string | null;
  governorate: string | null;
  taxNumber: string | null;
  creditLimit: number | null;
  notes: string | null;
  createdAt: Dateish;
  orders?: Order[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customer?: Customer | null;
  branchId: string | null;
  branch?: Branch | null;
  employeeId: string | null;
  employee?: Employee | null;
  status: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentMethod: string | null;
  paymentStatus: string;
  notes: string | null;
  deletedAt: Dateish | null;
  createdAt: Dateish;
  updatedAt: Dateish;
  items?: OrderItem[];
  _count?: { items: number };
}

export interface OrderItem {
  id: string;
  orderId: string;
  order?: Order;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
  note: string | null;
}
