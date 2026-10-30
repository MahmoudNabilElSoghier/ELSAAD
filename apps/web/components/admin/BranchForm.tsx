"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBranchSchema, type CreateBranchInput, type UpdateBranchInput } from "@elsaad/shared";
import { createBranch, updateBranch, getEmployees, ApiError } from "@elsaad/api-client";
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

const EDIT_FORBIDDEN = ["id", "code", "slug", "createdAt", "updatedAt"] as const;

function pickEditable<T extends Record<string, unknown>>(input: T, forbidden: readonly string[]): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (!forbidden.includes(k)) out[k] = v;
  }
  return out as Partial<T>;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const errBody = err.body as { message?: string; issues?: Array<{ path?: string | string[]; message?: string }> };
    if (errBody?.issues && Array.isArray(errBody.issues)) {
      const details = errBody.issues
        .map((i) => `${Array.isArray(i.path) ? i.path.join(".") : i.path || ""}: ${i.message}`)
        .join("; ");
      return `فشل التحقق — ${details}`;
    }
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return "حدث خطأ أثناء حفظ الفرع";
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
        ...(initialData ? {
          ...initialData,
          latitude: initialData.latitude ?? undefined,
          longitude: initialData.longitude ?? undefined,
          managerId: initialData.managerId ?? undefined,
          phone: initialData.phone ?? undefined,
          whatsapp: initialData.whatsapp ?? undefined,
          nameEn: initialData.nameEn ?? undefined,
          addressEn: initialData.addressEn ?? undefined,
          openingHours: initialData.openingHours ?? undefined,
        } : {}),
        ...data,
        managerId: data.managerId || null,
        phone: data.phone || undefined,
        whatsapp: data.whatsapp || undefined,
        nameEn: data.nameEn || undefined,
        addressEn: data.addressEn || undefined,
      };

      if (mode === "edit" && initialData) {
        const editable = pickEditable(payload, EDIT_FORBIDDEN);
        const updatePayload: UpdateBranchInput = {
          nameAr: editable.nameAr as string,
          nameEn: editable.nameEn as string | undefined,
          type: editable.type as string,
          phone: editable.phone as string | undefined,
          whatsapp: editable.whatsapp as string | undefined,
          address: editable.address as string,
          addressEn: editable.addressEn as string | undefined,
          governorate: editable.governorate as string,
          managerId: editable.managerId as string | null | undefined,
          displayOrder: editable.displayOrder as number | undefined,
          active: editable.active as boolean | undefined,
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
        message: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-xl" dir="rtl">
      <h2 className="text-lg font-bold text-fg mb-4">
        {mode === "edit" ? "تعديل الفرع" : "إضافة فرع جديد"}
      </h2>

      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="كود الفرع" {...register("code")} error={errors.code?.message} placeholder="BR-CAI-02" disabled={mode === "edit"} />
          <Input label="المعرّف (Slug)" {...register("slug")} error={errors.slug?.message} placeholder="cairo-maadi" disabled={mode === "edit"} />
          <Input label="الاسم بالعربية" {...register("nameAr")} error={errors.nameAr?.message} placeholder="فرع المعادي" />
          <Input label="الاسم بالإنجليزية" {...register("nameEn")} error={errors.nameEn?.message} placeholder="Maadi Branch" />

          <div>
            <label className="block text-sm font-medium text-fg mb-1">نوع الفرع</label>
            <select
              {...register("type")}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-fg text-sm focus:border-accent focus:outline-none"
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
            <label className="block text-sm font-medium text-fg mb-1">مدير الفرع (المشرف)</label>
            <select
              {...register("managerId")}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-fg text-sm focus:border-accent focus:outline-none"
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
            <input type="checkbox" id="branch-active" {...register("active")} className="w-4 h-4 rounded accent-accent" />
            <label htmlFor="branch-active" className="text-sm font-medium text-fg">فرع نشط</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
