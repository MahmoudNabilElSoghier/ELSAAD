"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/categories", label: "التصنيفات" },
  { href: "/admin/brands", label: "الماركات" },
  { href: "/admin/employees", label: "الموظفون" },
  { href: "/admin/branches", label: "الفروع" },
  { href: "/admin/inventory", label: "المخزون" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="قائمة الإدارة" className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-accent-strong/20 font-semibold text-white"
                : "text-muted hover:bg-bg hover:text-white"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
