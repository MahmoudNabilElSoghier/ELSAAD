import type { Metadata } from "next";
import { getEmployees } from "@/lib/services/employees";

export const metadata: Metadata = {
  title: "الموظفون | السعد للدراجات النارية",
};

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

const roleLabels: Record<string, string> = {
  admin: "مدير نظام",
  manager: "مدير فرع",
  cashier: "كاشير",
  warehouse: "أمين مخزن",
};

const roleStyles: Record<string, string> = {
  admin: "bg-red-500/15 text-red-400",
  manager: "bg-amber-500/15 text-amber-400",
  cashier: "bg-sky-500/15 text-sky-400",
  warehouse: "bg-violet-500/15 text-violet-400",
};

export default async function AdminEmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">الموظفون</h1>
        <p className="mt-1 text-sm text-muted">
          {nf.format(employees.length)} موظف مسجل، مع فرع وكل صلاحية.
        </p>
      </div>

      {/* TODO(Phase 2D): add/edit employee forms — reason: employee writes must
          wait for the authenticated admin API (decision 1B). */}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 font-medium">رقم الموظف</th>
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">الموبايل</th>
                <th className="px-4 py-3 font-medium">الصلاحية</th>
                <th className="px-4 py-3 font-medium">الفرع</th>
                <th className="px-4 py-3 font-medium">الطلبات</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">
                    لا يوجد موظفون بعد.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-white" dir="ltr">
                      {employee.employeeNumber}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {employee.nameAr}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`tel:${employee.phone}`}
                        className="text-white hover:text-accent"
                        dir="ltr"
                      >
                        {employee.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          roleStyles[employee.role] ?? "bg-bg text-muted"
                        }`}
                      >
                        {roleLabels[employee.role] ?? employee.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {employee.branch?.nameAr ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {nf.format(employee._count?.orders ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          employee.active
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-bg text-muted"
                        }`}
                      >
                        {employee.active ? "نشط" : "موقوف"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
