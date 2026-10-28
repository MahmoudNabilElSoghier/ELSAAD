import type { Order, OrderItem } from "./types";
import { withDb } from "./withDb";

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

const toNumber = (value: number | string | null | undefined): number | null =>
  value == null ? null : Number(value);

// Prisma Decimal → plain numbers (see types.ts header).
const mapOrderItem = (item: OrderItem): OrderItem => ({
  ...item,
  unitPrice: Number(item.unitPrice),
  discount: Number(item.discount),
  lineTotal: Number(item.lineTotal),
});

const mapOrder = (order: Order): Order => ({
  ...order,
  subtotal: Number(order.subtotal),
  taxAmount: Number(order.taxAmount),
  discount: Number(order.discount),
  total: Number(order.total),
  items: order.items?.map(mapOrderItem),
  customer: order.customer
    ? { ...order.customer, creditLimit: toNumber(order.customer.creditLimit) }
    : order.customer,
});

export async function getOrders(filter: OrderFilter = {}): Promise<OrderPage> {
  const page = Math.max(1, filter.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filter.pageSize ?? 20));
  const where: Record<string, unknown> = { deletedAt: null };
  if (filter.status) where.status = filter.status;
  const data = await withDb<{ items: Order[]; total: number }>(
    async (db) => {
      const [items, total] = await Promise.all([
        db.order.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          include: {
            customer: true,
            branch: true,
            employee: true,
            _count: { select: { items: true } },
          },
        }),
        db.order.count({ where }),
      ]);
      return { items: items.map(mapOrder), total };
    },
    async () => ({ items: [], total: 0 })
  );
  return {
    items: data.items,
    total: data.total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(data.total / pageSize)),
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  return withDb<Order | null>(
    async (db) => {
      const order = await db.order.findFirst({
        where: { id, deletedAt: null },
        include: {
          customer: true,
          branch: true,
          employee: true,
          items: { include: { product: { include: { brand: true } } } },
        },
      });
      return order ? mapOrder(order) : null;
    },
    async () => null
  );
}
