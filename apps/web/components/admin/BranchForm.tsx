"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBranchSchema, type CreateBranchInput, type UpdateBranchInput } from "@elsaad/shared";
import { createBranch, updateBranch, getEmployees } from "@elsaad/api-client";
import type { Branch, Employee } from "@elsaad/shared";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormBanner } from "./FormBanner";
import { Loader2 } from "lucide-react";

interface BranchFormProps {
  mode?: "create" | "edit";
  initialData?: Branch;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BranchForm({ mode = "create", initialData, onSuccess, onCancel }: BranchFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEmployees().then(setEmployees).catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBranchInput>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: initialData
      ? {
          code: initialData.code,
          slug: initialData.slug,
          nameAr: initialData.nameAr,
          nameEn: initialData.nameEn ?? "",
          type: initialData.type,
          phone: initialData.phone ?? "",
          whatsapp: initialData.whatsapp ?? "",
          address: initialData.address,
          addressEn: initialData.addressEn ?? "",
          governorate: initialData.governorate,
          managerId: initialData.managerId ?? "",
          displayOrder: initialData.displayOrder,
          active: initialData.active,
        }
      : {
          type: "retail",
          governorate: "القاهرة",
          displayOrder: 0,
          active: true,
        },
  });

  const onSubmit = async (data: CreateBranchInput) => {
    setLoading(true);
    setBanner(null);
    try {
      const payload = {
        ...data,
        managerId: data.managerId || null,
        phone: data.phone || undefined,
        whatsapp: data.whatsapp || undefined,
        nameEn: data.nameEn || undefined,
        addressEn: data.addressEn || undefined,
      };

      if (mode === "edit" && initialData) {
        const updatePayload: UpdateBranchInput = {
          nameAr: payload.nameAr,
          nameEn: payload.nameEn,
          type: payload.type,
          phone: payload.phone,
          whatsapp: payload.whatsapp,
          address: payload.address,
          addressEn: payload.addressEn,
          governorate: payload.governorate,
          managerId: payload.managerId,
          displayOrder: payload.displayOrder,
          active: payload.active,
        };
        await updateBranch(initialData.id, updatePayload);
        setBanner({ type: "success", message: "تم تحديث الفرع بنجاح" });
      } else {
        await createBranch(payload);
        setBanner({ type: "success", message: "تم إضافة الفرع بنجاح" });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setBanner({
        type: "error",
        message: err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الفرع",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-xl p-6 shadow-xl" dir="rtl">
      <h2 className="text-lg font-bold text-white mb-4">
        {mode === "edit" ? "تعديل الفرع" : "إضافة فرع جديد"}
      </h2>

      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="كود الفرع" {...register("code")} error={errors.code?.message} placeholder="BR-CAI-02" />
          <Input label="المعرّف (Slug)" {...register("slug")} error={errors.slug?.message} placeholder="cairo-maadi" />
          <Input label="الاسم بالعربية" {...register("nameAr")} error={errors.nameAr?.message} placeholder="فرع المعادي" />
          <Input label="الاسم بالإنجليزية" {...register("nameEn")} error={errors.nameEn?.message} placeholder="Maadi Branch" />

          <div>
            <label className="block text-sm font-medium text-white mb-1">نوع الفرع</label>
            <select
              {...register("type")}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent focus:outline-none"
            >
              <option value="retail">بيع بالتجزئة (Retail)</option>
              <option value="warehouse">مخزن (Warehouse)</option>
              <option value="showroom">صالة عرض (Showroom)</option>
              <option value="main">رئيسي (Main)</option>
              <option value="service_center">مركز صيانة (Service Center)</option>
            </select>
          </div>

          <Input label="المحافظة" {...register("governorate")} error={errors.governorate?.message} placeholder="القاهرة" />
          <Input label="رقم الموبايل" {...register("phone")} error={errors.phone?.message} placeholder="01001234567" />
          <Input label="رقم الواتساب" {...register("whatsapp")} error={errors.whatsapp?.message} placeholder="01001234567" />
          <Input label="العنوان" {...register("address")} error={errors.address?.message} placeholder="15 شارع النصر، المعادي" />
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">مدير الفرع (المشرف)</label>
            <select
              {...register("managerId")}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent focus:outline-none"
            >
              <option value="">— بدون مدير —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nameAr} ({emp.employeeNumber})
                </option>
              ))}
            </select>
          </div>

          <Input label="ترتيب العرض" type="number" {...register("displayOrder", { valueAsNumber: true })} error={errors.displayOrder?.message} />

          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="branch-active" {...register("active")} className="w-4 h-4 rounded accent-[#E63946]" />
            <label htmlFor="branch-active" className="text-sm font-medium text-white">فرع نشط</label>
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
              <span>حفظ الفرع</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
