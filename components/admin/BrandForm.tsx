"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { brandFormSchema, type BrandFormValues } from "@/lib/schemas/catalog";

export function BrandForm() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      slug: "",
      website: "",
      description: "",
    },
  });

  const onSubmit = (values: BrandFormValues) => {
    // Mock-mode save: no write API exists yet.
    console.log("[admin] save brand payload:", values);
    // TODO(Phase 2D): persist via authenticated API — reason: admin writes must
    // wait for ADMIN_API_KEY auth (decision 1B).
    reset();
    setOpen(false);
  };

  if (!open) {
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
    >
      <p className="font-semibold text-white">ماركة جديدة</p>
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
          حفظ
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
