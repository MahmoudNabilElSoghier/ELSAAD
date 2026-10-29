"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { authApi, type AuthUser } from "@elsaad/api-client";
import { LogOut, User } from "lucide-react";

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
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    authApi.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full justify-between p-3" dir="rtl">
      <nav aria-label="قائمة الإدارة" className="flex flex-col gap-1">
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

      <div className="pt-4 border-t border-[#262626] mt-auto">
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 text-xs text-[#9CA3AF] truncate">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
