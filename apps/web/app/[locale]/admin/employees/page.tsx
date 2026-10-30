"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@elsaad/api-client";
import { EmployeeForm } from "@/components/admin/EmployeeForm";
import { FormBanner } from "@/components/admin/FormBanner";
import type { Employee } from "@elsaad/shared";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

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

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    setLoading(true);
    getEmployees()
      .then(setEmployees)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg">الموظفون</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "جاري التحميل..." : `${nf.format(employees.length)} موظف مسجل، مع فرع وكل صلاحية.`}
          </p>
        </div>
        {!showCreate && (
          <Button size="sm" onClick={() => setShowCreate(true)}>
            + إضافة موظف
          </Button>
        )}
      </div>

      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      {showCreate && (
        <EmployeeForm
          mode="create"
          onSuccess={() => {
            setShowCreate(false);
            setBanner({ type: "success", message: "تم إضافة الموظف بنجاح" });
            refetch();
          }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editingEmployee && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <EmployeeForm
              mode="edit"
              initialData={editingEmployee}
              onSuccess={() => {
                setEditingEmployee(null);
                setBanner({ type: "success", message: "تم تحديث الموظف بنجاح" });
                refetch();
              }}
              onCancel={() => setEditingEmployee(null)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-4 py-3 font-medium text-right">رقم الموظف</th>
                  <th className="px-4 py-3 font-medium text-right">الاسم</th>
                  <th className="px-4 py-3 font-medium text-right">الموبايل</th>
                  <th className="px-4 py-3 font-medium text-right">الصلاحية</th>
                  <th className="px-4 py-3 font-medium text-right">الفرع</th>
                  <th className="px-4 py-3 font-medium text-right">الطلبات</th>
                  <th className="px-4 py-3 font-medium text-right">الحالة</th>
                  <th className="px-4 py-3 font-medium text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted">
                      لا يوجد موظفون بعد.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-fg" dir="ltr">
                        {employee.employeeNumber}
                      </td>
                      <td className="px-4 py-3 font-semibold text-fg">
                        {employee.nameAr}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${employee.phone}`}
                          className="text-fg hover:text-accent"
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
                      <td className="px-4 py-3 text-fg">
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
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setEditingEmployee(employee)}
                          className="font-semibold text-accent hover:underline"
                        >
                          تعديل
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
