import type { Metadata } from "next";
import { getBranches } from "@/lib/services/branches";

export const metadata: Metadata = {
  title: "الفروع | السعد للدراجات النارية",
};

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

const typeLabels: Record<string, string> = {
  retail: "بيع بالتجزئة",
  warehouse: "مخزن",
  showroom: "صالة عرض",
};

const hoursLabels: Record<string, string> = {
  "sat-thu": "السبت - الخميس",
  fri: "الجمعة",
};

export default async function AdminBranchesPage() {
  const branches = await getBranches();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">الفروع</h1>
        <p className="mt-1 text-sm text-muted">
          {nf.format(branches.length)} فرع — الضمان والموظفين والمخزون لكل فرع.
        </p>
      </div>

      {/* TODO(Phase 2D): add/edit branch forms — reason: branch writes must wait
          for the authenticated admin API (decision 1B). */}

      {branches.length === 0 ? (
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
                  <p className="font-bold text-white">{branch.nameAr}</p>
                  {branch.nameEn && (
                    <p className="text-xs text-muted" dir="ltr">
                      {branch.nameEn}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    branch.active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-bg text-muted"
                  }`}
                >
                  {branch.active ? "نشط" : "موقوف"}
                </span>
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
                      className="text-white hover:text-accent"
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
                        <span className="text-white" dir="ltr">
                          {hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
                <div>
                  <p className="font-bold text-white">
                    {nf.format(branch._count?.inventory ?? 0)}
                  </p>
                  <p className="text-muted">صنف بالمخزون</p>
                </div>
                <div>
                  <p className="font-bold text-white">
                    {nf.format(branch._count?.employees ?? 0)}
                  </p>
                  <p className="text-muted">موظف</p>
                </div>
                <div>
                  <p className="font-bold text-white">
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
