import type { Prisma } from "@prisma/client";
import type { Customer, Order, OrderItem } from "../types/order";
import { fromPrismaBranch, type BranchRow } from "./branch";
import { toNumber, toNumberOrZero } from "./decimal";
import { fromPrismaEmployee, type EmployeeRow } from "./employee";
import { fromPrismaProduct, type ProductRow } from "./product";

type CustomerScalars = Prisma.CustomerGetPayload<{}>;

export type CustomerRow = Omit<CustomerScalars, "creditLimit"> & {
  creditLimit: unknown;
};

type OrderScalars = Prisma.OrderGetPayload<{}>;

export type OrderRow = Omit<
  OrderScalars,
  "subtotal" | "taxAmount" | "discount" | "total"
> & {
  subtotal: unknown;
  taxAmount: unknown;
  discount: unknown;
  total: unknown;
  customer?: CustomerRow | null;
  branch?: BranchRow | null;
  employee?: EmployeeRow | null;
  items?: OrderItemRow[];
};

type OrderItemScalars = Prisma.OrderItemGetPayload<{}>;

export type OrderItemRow = Omit<
  OrderItemScalars,
  "unitPrice" | "discount" | "lineTotal"
> & {
  unitPrice: unknown;
  discount: unknown;
  lineTotal: unknown;
  product?: ProductRow;
};

export function fromPrismaOrder(row: OrderRow): Order {
  return {
    ...row,
    subtotal: toNumberOrZero(row.subtotal),
    taxAmount: toNumberOrZero(row.taxAmount),
    discount: toNumberOrZero(row.discount),
    total: toNumberOrZero(row.total),
    customer: row.customer ? fromPrismaCustomer(row.customer) : undefined,
    branch: row.branch ? fromPrismaBranch(row.branch) : undefined,
    employee: row.employee ? fromPrismaEmployee(row.employee) : undefined,
    items: row.items?.map(fromPrismaOrderItem),
  };
}

export function fromPrismaCustomer(row: CustomerRow): Customer {
  return {
    ...row,
    creditLimit: toNumber(row.creditLimit),
  };
}

export function fromPrismaOrderItem(row: OrderItemRow): OrderItem {
  return {
    ...row,
    unitPrice: toNumberOrZero(row.unitPrice),
    discount: toNumberOrZero(row.discount),
    lineTotal: toNumberOrZero(row.lineTotal),
    product: row.product ? fromPrismaProduct(row.product) : undefined,
  };
}
