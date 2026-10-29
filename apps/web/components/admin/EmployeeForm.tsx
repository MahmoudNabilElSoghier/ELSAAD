"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployeeSchema, type CreateEmployeeInput, type UpdateEmployeeInput } from "@elsaad/shared";
import { createEmployee, updateEmployee, getBranches } from "@elsaad/api-client";
import type { Employee, Branch } from "@elsaad/shared";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormBanner } from "./FormBanner";
import { Loader2 } from "lucide-react";

interface EmployeeFormProps {
  mode?: "create" | "edit";
  initialData?: Employee;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EmployeeForm({ mode = "create", initialData, onSuccess, onCancel }: EmployeeFormProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBranches().then(setBranches).catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: initialData
      ? {
          employeeNumber: initialData.employeeNumber,
          nameAr: initialData.nameAr,
          nameEn: initialData.nameEn ?? "",
          nationalId: initialData.nationalId ?? "",
          phone: initialData.phone,
          email: initialData.email ?? "",
          role: initialData.role,
          branchId: initialData.branchId ?? "",
          active: initialData.active,
        }
      : {
          employeeNumber: `EMP-${Math.floor(100 + Math.random() * 900)}`,
          role: "cashier",
          active: true,
        },
  });

  const onSubmit = async (data: CreateEmployeeInput) => {
    setLoading(true);
    setBanner(null);
    try {
      const payload = {
        ...data,
        branchId: data.branchId || null,
        nameEn: data.nameEn || undefined,
        nationalId: data.nationalId || undefined,
        email: data.email || undefined,
      };

      if (mode === "edit" && initialData) {
        const updatePayload: UpdateEmployeeInput = {
          nameAr: payload.nameAr,
          nameEn: payload.nameEn,
          nationalId: payload.nationalId,
          phone: payload.phone,
          email: payload.email,
          role: payload.role,
          branchId: payload.branchId,
          active: payload.active,
        };
        await updateEmployee(initialData.id, updatePayload);
        setBanner({ type: "success", message: "تم تحديث الموظف بنجاح" });
      } else {
        await createEmployee(payload);
        setBanner({ type: "success", message: "تم إضافة الموظف بنجاح" });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setBanner({
        type: "error",
        message: err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الموظف",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-xl p-6 shadow-xl" dir="rtl">
      <h2 className="text-lg font-bold text-white mb-4">
        {mode === "edit" ? "تعديل الموظف" : "إضافة موظف جديد"}
      </h2>

      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="رقم الموظف" {...register("employeeNumber")} error={errors.employeeNumber?.message} placeholder="EMP-001" />
          <Input label="الاسم بالعربية" {...register("nameAr")} error={errors.nameAr?.message} placeholder="أحمد محمد" />
          <Input label="الاسم بالإنجليزية" {...register("nameEn")} error={errors.nameEn?.message} placeholder="Ahmed Mohamed" />
          <Input label="الرقم القومي" {...register("nationalId")} error={errors.nationalId?.message} placeholder="29501010101010" />
          <Input label="رقم الموبايل" {...register("phone")} error={errors.phone?.message} placeholder="01001234567" />
          <Input label="البريد الإلكتروني" {...register("email")} error={errors.email?.message} placeholder="ahmed@elsaad.com" />

          <div>
            <label className="block text-sm font-medium text-white mb-1">الوظيفة / الصلاحية</label>
            <select
              {...register("role")}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent focus:outline-none"
            >
              <option value="cashier">كاشير (Cashier)</option>
              <option value="manager">مدير فرع (Manager)</option>
              <option value="warehouse">أمين مخزن (Warehouse)</option>
              <option value="admin">مدير نظام (Admin)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">الفرع الأساسي</label>
            <select
              {...register("branchId")}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent focus:outline-none"
            >
              <option value="">— بدون فرع —</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="employee-active" {...register("active")} className="w-4 h-4 rounded accent-[#E63946]" />
            <label htmlFor="employee-active" className="text-sm font-medium text-white">موظف نشط</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
          {onCancel && (
            <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
              إلغاء
            </Button>
          )}
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <span>حفظ الموظف</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
