import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "لوحة الإدارة | السعد للدراجات النارية",
  robots: { index: false, follow: false },
};

// Admin routes stay dynamic: stats/inventory must never be baked at build time,
// and the mock-preview badge reflects the live DATABASE_URL state per request.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const dbConfigured = !!process.env.DATABASE_URL;
  return (
    <div className="flex min-h-screen flex-1">
      <aside className="w-64 shrink-0 border-l border-border bg-card">
        <div className="space-y-2 border-b border-border p-4">
          <p className="text-lg font-bold text-white">إدارة Elsaad</p>
          {!dbConfigured && (
            <span className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">
              معاينة بيانات تجريبية
            </span>
          )}
          {/* TODO(Phase 2D): gate this whole subtree behind ADMIN_API_KEY session
              auth (decision 1B) — reason: /admin is currently reachable by anyone. */}
        </div>
        <AdminNav />
      </aside>
      <div id="main-content" className="min-w-0 flex-1 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
