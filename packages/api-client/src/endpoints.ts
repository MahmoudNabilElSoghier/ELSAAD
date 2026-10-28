import type {
  Branch,
  Brand,
  BranchInventory,
  Employee,
  MachineModel,
  Order,
  PartCategory,
  Product,
} from "@elsaad/shared";
import { apiGet, apiGetOrNull } from "./client";

export interface ProductFilter {
  q?: string;
  brandSlug?: string;
  categorySlug?: string;
  page?: number;
  pageSize?: number;
  includeInactive?: boolean;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderFilter {
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface OrderPage {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const encode = encodeURIComponent;

export const getBrands = (): Promise<Brand[]> => apiGet<Brand[]>("/brands");

export const getBrandBySlug = (slug: string): Promise<Brand | null> =>
  apiGetOrNull<Brand>(`/brands/${encode(slug)}`);

export const getPartCategories = (): Promise<PartCategory[]> =>
  apiGet<PartCategory[]>("/categories");

export const getCategoryTree = (): Promise<PartCategory[]> =>
  apiGet<PartCategory[]>("/categories/tree");

export const getCategoryBySlug = (slug: string): Promise<PartCategory | null> =>
  apiGetOrNull<PartCategory>(`/categories/${encode(slug)}`);

export const getModels = (brandSlug?: string): Promise<MachineModel[]> =>
  apiGet<MachineModel[]>(
    brandSlug ? `/models?brandSlug=${encode(brandSlug)}` : "/models",
  );

export const getModelBySlug = (
  brandSlug: string,
  modelSlug: string,
): Promise<MachineModel | null> =>
  apiGetOrNull<MachineModel>(`/models/${encode(brandSlug)}/${encode(modelSlug)}`);

export const getProducts = (filter: ProductFilter = {}): Promise<ProductPage> => {
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.brandSlug) params.set("brandSlug", filter.brandSlug);
  if (filter.categorySlug) params.set("categorySlug", filter.categorySlug);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.pageSize) params.set("pageSize", String(filter.pageSize));
  if (filter.includeInactive) params.set("includeInactive", "true");
  const qs = params.toString();
  return apiGet<ProductPage>(`/products${qs ? `?${qs}` : ""}`);
};

export const getProductByCode = (code: string): Promise<Product | null> =>
  apiGetOrNull<Product>(`/products/code/${encode(code)}`);

export const getProductById = (id: string): Promise<Product | null> =>
  apiGetOrNull<Product>(`/products/${encode(id)}`);

export const getLowStockProducts = (): Promise<Product[]> =>
  apiGet<Product[]>("/products/low-stock");

export const getBranches = (): Promise<Branch[]> => apiGet<Branch[]>("/branches");

export const getBranchBySlug = (slug: string): Promise<Branch | null> =>
  apiGetOrNull<Branch>(`/branches/${encode(slug)}`);

export const getEmployees = (): Promise<Employee[]> =>
  apiGet<Employee[]>("/employees");

export const getInventory = (branchId?: string): Promise<BranchInventory[]> =>
  apiGet<BranchInventory[]>(
    branchId ? `/inventory?branchId=${encode(branchId)}` : "/inventory",
  );

export const getLowStockItems = (branchId?: string): Promise<BranchInventory[]> =>
  apiGet<BranchInventory[]>(
    branchId ? `/inventory/low-stock?branchId=${encode(branchId)}` : "/inventory/low-stock",
  );

export const getOrders = (filter: OrderFilter = {}): Promise<OrderPage> => {
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.pageSize) params.set("pageSize", String(filter.pageSize));
  const qs = params.toString();
  return apiGet<OrderPage>(`/orders${qs ? `?${qs}` : ""}`);
};

export const getOrderById = (id: string): Promise<Order | null> =>
  apiGetOrNull<Order>(`/orders/${encode(id)}`);
