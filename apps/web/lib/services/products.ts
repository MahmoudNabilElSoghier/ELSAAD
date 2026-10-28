import { mockCompatibilities, mockModels, mockProducts } from "@/lib/mock";
import type { Product } from "./types";
import { withDb } from "./withDb";

export interface ProductFilter {
  q?: string;
  brandSlug?: string;
  categorySlug?: string;
  page?: number;
  pageSize?: number;
  // Admin lists need inactive rows too; the public catalog keeps active-only.
  includeInactive?: boolean;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const toNumber = (value: number | string | null | undefined): number | null =>
  value == null ? null : Number(value);

// Prisma Decimal price fields → plain numbers (see types.ts header).
const mapProduct = (product: Product): Product => ({
  ...product,
  costPrice: toNumber(product.costPrice),
  wholesalePrice: toNumber(product.wholesalePrice),
  retailPrice: toNumber(product.retailPrice),
  vipPrice: toNumber(product.vipPrice),
  taxRate: Number(product.taxRate),
});

export function totalStock(product: Product): number {
  return (product.inventory ?? []).reduce((sum, item) => sum + item.quantity, 0);
}

// Prisma-specific where builder — only used on the DB path (mock filtering is
// done separately in the fallback via the predicate below).
function buildWhere(filter: ProductFilter): Record<string, unknown> {
  const where: Record<string, unknown> = { deletedAt: null };
  if (!filter.includeInactive) where.active = true;
  if (filter.q) {
    const q = filter.q;
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
      { oemCode: { contains: q, mode: "insensitive" } },
    ];
  }
  if (filter.brandSlug) where.brand = { slug: filter.brandSlug };
  if (filter.categorySlug) where.partCategory = { slug: filter.categorySlug };
  return where;
}

// Mock-path filter mirroring buildWhere semantics (case-insensitive contains).
function matchesMock(product: Product, filter: ProductFilter): boolean {
  if (product.deletedAt) return false;
  if (!product.active && !filter.includeInactive) return false;
  if (filter.brandSlug && product.brand?.slug !== filter.brandSlug) return false;
  if (filter.categorySlug && product.partCategory?.slug !== filter.categorySlug) return false;
  if (filter.q) {
    const needle = filter.q.toLowerCase();
    const haystack = `${product.name} ${product.code} ${product.oemCode ?? ""}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export async function getProducts(filter: ProductFilter = {}): Promise<ProductPage> {
  const page = Math.max(1, filter.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filter.pageSize ?? 20));
  const where = buildWhere(filter);
  const data = await withDb<{ items: Product[]; total: number }>(
    async (db) => {
      const [items, total] = await Promise.all([
        db.product.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { name: "asc" },
          include: { brand: true, partCategory: true, inventory: true, images: true },
        }),
        db.product.count({ where }),
      ]);
      return { items: items.map(mapProduct), total };
    },
    async () => {
      const filtered = mockProducts.filter((product) => matchesMock(product, filter));
      const start = (page - 1) * pageSize;
      return { items: filtered.slice(start, start + pageSize), total: filtered.length };
    }
  );
  return {
    items: data.items,
    total: data.total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(data.total / pageSize)),
  };
}

// Public catalog detail lookup — URL param is the product code (part number).
export async function getProductByCode(code: string): Promise<Product | null> {
  return withDb<Product | null>(
    async (db) => {
      const product = await db.product.findFirst({
        where: { code, deletedAt: null },
        include: {
          brand: true,
          partCategory: true,
          supplier: true,
          images: { orderBy: { order: "asc" } },
          compatibilities: { include: { model: { include: { brand: true } } } },
          inventory: { include: { branch: true } },
        },
      });
      return product ? mapProduct(product) : null;
    },
    async () => {
      const product = mockProducts.find(
        (item) => item.code === code && item.active && !item.deletedAt
      );
      if (!product) return null;
      return {
        ...product,
        compatibilities: mockCompatibilities
          .filter((compat) => compat.productId === product.id)
          .map((compat) => ({
            ...compat,
            model: mockModels.find((model) => model.id === compat.modelId),
          })),
      };
    }
  );
}

// Admin edit lookup — includes inactive/soft-deleted rows so existing data stays editable.
export async function getProductById(id: string): Promise<Product | null> {
  return withDb<Product | null>(
    async (db) => {
      const product = await db.product.findUnique({
        where: { id },
        include: {
          brand: true,
          partCategory: true,
          supplier: true,
          images: { orderBy: { order: "asc" } },
        },
      });
      return product ? mapProduct(product) : null;
    },
    async () => mockProducts.find((item) => item.id === id) ?? null
  );
}

export async function getLowStockProducts(): Promise<Product[]> {
  return withDb<Product[]>(
    async (db) => {
      const products = await db.product.findMany({
        where: { deletedAt: null, active: true },
        include: { inventory: true },
      });
      return products
        .map(mapProduct)
        .filter((product: Product) => totalStock(product) <= product.reorderLevel);
    },
    async () =>
      mockProducts.filter(
        (product) =>
          product.active && !product.deletedAt && totalStock(product) <= product.reorderLevel
      )
  );
}
