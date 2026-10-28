"use client";

import { useState } from "react";
import type { BranchInventory } from "@/lib/services/types";

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

// Mirrors the service's isLowStock — kept local to avoid pulling the service
// layer and mock data into the client bundle.
function isLow(row: BranchInventory): boolean {
  const threshold = row.reorderLevel ?? row.product?.reorderLevel ?? 0;
  return row.quantity <= threshold;
}

export function InventoryTable({ rows }: { rows: BranchInventory[] }) {
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  const setQty = (id: string, value: string) =>
    setEdits((prev) => ({ ...prev, [id]: value }));

  const handleSave = (row: BranchInventory) => {
    const raw = edits[row.id] ?? String(row.quantity);
    const quantity = Number(raw);
    if (!Number.isInteger(quantity) || quantity < 0) return;
    console.log("[admin] update inventory:", {
      id: row.id,
      branchId: row.branchId,
      productId: row.productId,
      quantity,
    });
    // TODO(Phase 2D): PATCH /api/admin/inventory once ADMIN_API_KEY auth exists
    // (decision 1B) — reason: writes must never ship unauthenticated.
    setEdits((prev) => {
      const next = { ...prev };
      delete next[row.id];
      return next;
    });
    setSavedId(row.id);
  };

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card px-4 py-8 text-center text-muted">
        لا توجد أصناف بالمخزون للفروع المختارة.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="px-4 py-3 font-medium">المنتج</th>
              <th className="px-4 py-3 font-medium">الكود</th>
              <th className="px-4 py-3 font-medium">الفرع</th>
              <th className="px-4 py-3 font-medium">الكمية</th>
              <th className="px-4 py-3 font-medium">حد الطلب</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">إجراء</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const low = isLow(row);
              const dirty = edits[row.id] !== undefined;
              const threshold = row.reorderLevel ?? row.product?.reorderLevel ?? 0;
              return (
                <tr
                  key={row.id}
                  className={`border-b border-border/50 last:border-0 ${
                    low ? "bg-red-500/5" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    {row.product?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted" dir="ltr">
                    {row.product?.code ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {row.branch?.nameAr ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={edits[row.id] ?? String(row.quantity)}
                      onChange={(event) => setQty(row.id, event.target.value)}
                      aria-label={`كمية ${row.product?.name ?? ""} في ${row.branch?.nameAr ?? ""}`}
                      className="w-24 rounded-lg border border-border bg-bg px-3 py-2 text-white focus:border-accent focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-muted">{nf.format(threshold)}</td>
                  <td className="px-4 py-3">
                    {low ? (
                      <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">
                        منخفض
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                        متوفر
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleSave(row)}
                      disabled={!dirty}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        dirty
                          ? "border-accent text-white hover:bg-accent-strong/20"
                          : "border-border text-muted opacity-60"
                      }`}
                    >
                      {savedId === row.id && !dirty ? "تم" : "حفظ"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
