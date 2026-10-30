"use client";

import { useEffect, useState } from "react";
import { getBranches } from "@elsaad/api-client";
import { BranchForm } from "@/components/admin/BranchForm";
import { FormBanner } from "@/components/admin/FormBanner";
import type { Branch } from "@elsaad/shared";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

const typeLabels: Record<string, string> = {
  retail: "بيع بالتجزئة",
  warehouse: "مخزن",
  showroom: "صالة عرض",
  main: "رئيسي",
  service_center: "مركز صيانة",
};

const hoursLabels: Record<string, string> = {
  "sat-thu": "السبت - الخميس",
  fri: "الجمعة",
};

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    setLoading(true);
    getBranches()
      .then(setBranches)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg">الفروع</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "جاري التحميل..." : `${nf.format(branches.length)} فرع — الضمان والموظفين والمخزون لكل فرع.`}
          </p>
        </div>
        {!showCreate && (
          <Button size="sm" onClick={() => setShowCreate(true)}>
            + إضافة فرع
          </Button>
        )}
      </div>

      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      {showCreate && (
        <BranchForm
          mode="create"
          onSuccess={() => {
            setShowCreate(false);
            setBanner({ type: "success", message: "تم إضافة الفرع بنجاح" });
            refetch();
          }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <BranchForm
              mode="edit"
              initialData={editingBranch}
              onSuccess={() => {
                setEditingBranch(null);
                setBanner({ type: "success", message: "تم تحديث الفرع بنجاح" });
                refetch();
              }}
              onCancel={() => setEditingBranch(null)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : branches.length === 0 ? (
        <p className="text-muted">لا توجد فروع بعد.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {branches.map((branch) => (
            <li
              key={branch.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-fg">{branch.nameAr}</p>
                  {branch.nameEn && (
                    <p className="text-xs text-muted" dir="ltr">
                      {branch.nameEn}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      branch.active
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-bg text-muted"
                    }`}
                  >
                    {branch.active ? "نشط" : "موقوف"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingBranch(branch)}
                    className="text-xs font-semibold text-accent hover:underline mr-1"
                  >
                    تعديل
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-bg px-2.5 py-1 font-mono text-muted" dir="ltr">
                  {branch.code}
                </span>
                <span className="rounded-full bg-bg px-2.5 py-1 text-muted">
                  {typeLabels[branch.type] ?? branch.type}
                </span>
                <span className="rounded-full bg-bg px-2.5 py-1 text-muted">
                  {branch.governorate}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <p className="text-muted">{branch.address}</p>
                {branch.phone && (
                  <p>
                    <a
                      href={`tel:${branch.phone}`}
                      className="text-fg hover:text-accent"
                      dir="ltr"
                    >
                      {branch.phone}
                    </a>
                  </p>
                )}
                {branch.whatsapp && (
                  <p>
                    <a
                      href={`https://wa.me/${branch.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                      dir="ltr"
                    >
                      واتساب
                    </a>
                  </p>
                )}
                {branch.openingHours && (
                  <ul className="space-y-0.5 pt-1">
                    {Object.entries(branch.openingHours).map(([day, hours]) => (
                      <li key={day} className="flex justify-between text-xs">
                        <span className="text-muted">
                          {hoursLabels[day] ?? day}
                        </span>
                        <span className="text-fg" dir="ltr">
                          {hours as string}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
                <div>
                  <p className="font-bold text-fg">
                    {nf.format(branch._count?.inventory ?? 0)}
                  </p>
                  <p className="text-muted">صنف بالمخزون</p>
                </div>
                <div>
                  <p className="font-bold text-fg">
                    {nf.format(branch._count?.employees ?? 0)}
                  </p>
                  <p className="text-muted">موظف</p>
                </div>
                <div>
                  <p className="font-bold text-fg">
                    {nf.format(branch._count?.orders ?? 0)}
                  </p>
                  <p className="text-muted">طلب</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
