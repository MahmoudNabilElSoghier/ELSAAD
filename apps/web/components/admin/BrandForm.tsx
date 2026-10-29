"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormBanner } from "./FormBanner";
import { brandFormSchema, type BrandFormValues, type UpdateBrandInput, type Brand } from "@elsaad/shared";
import { createBrand, updateBrand, ApiError } from "@elsaad/api-client";
import { Loader2 } from "lucide-react";

interface BrandFormProps {
  mode?: "create" | "edit";
  initialData?: Brand;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EDIT_FORBIDDEN = ["id", "slug", "createdAt", "updatedAt"] as const;

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
  return "حدث خطأ أثناء حفظ الماركة";
}

export function BrandForm({ mode = "create", initialData, onSuccess, onCancel }: BrandFormProps) {
  const [open, setOpen] = useState(mode === "edit");
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          nameAr: initialData.nameAr ?? "",
          slug: initialData.slug,
          website: initialData.website ?? "",
          description: initialData.description ?? "",
        }
      : {
          name: "",
          nameAr: "",
          slug: "",
          website: "",
          description: "",
        },
  });

  const onSubmit = async (values: BrandFormValues) => {
    setBanner(null);
    try {
      const payload = {
        ...values,
        nameAr: values.nameAr || undefined,
        website: values.website || undefined,
        description: values.description || undefined,
      };

      if (mode === "edit" && initialData) {
        const editable = pickEditable(payload, EDIT_FORBIDDEN);
        const updatePayload: UpdateBrandInput = {
          name: editable.name as string,
          nameAr: editable.nameAr as string | undefined,
          website: editable.website as string | undefined,
          description: editable.description as string | undefined,
        };
        await updateBrand(initialData.id, updatePayload);
        setBanner({ type: "success", message: "تم تحديث الماركة بنجاح" });
      } else {
        await createBrand(payload);
        setBanner({ type: "success", message: "تم إضافة الماركة بنجاح" });
        reset();
        setOpen(false);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setBanner({
        type: "error",
        message: getErrorMessage(err),
      });
    }
  };

  if (!open && mode === "create") {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:border-accent"
      >
        + ماركة جديدة
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-3 rounded-xl border border-accent/40 bg-card p-5"
      dir="rtl"
    >
      <p className="font-semibold text-white">{mode === "edit" ? "تعديل الماركة" : "ماركة جديدة"}</p>
      
      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="الاسم بالإنجليزي *"
          dir="ltr"
          placeholder="SYM"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input label="الاسم بالعربي" placeholder="سيم" {...register("nameAr")} />
        <Input
          label="المعرّف *"
          dir="ltr"
          placeholder="sym"
          hint="a-z و 0-9 و - فقط"
          error={errors.slug?.message}
          {...register("slug")}
          disabled={mode === "edit"}
        />
        <Input
          label="الموقع الإلكتروني"
          dir="ltr"
          placeholder="https://…"
          error={errors.website?.message}
          {...register("website")}
        />
      </div>
      <Input label="الوصف" {...register("description")} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-1 inline" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <span>حفظ</span>
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            reset();
            setOpen(false);
            if (onCancel) onCancel();
          }}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
