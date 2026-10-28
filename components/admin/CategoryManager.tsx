"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/schemas/catalog";
import type { PartCategory } from "@/lib/services/types";

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

type Mode =
  | { type: "edit"; category: PartCategory }
  | { type: "add"; parentId: string | null };

function CategoryFormPanel({
  mode,
  onCancel,
}: {
  mode: Mode;
  onCancel: () => void;
}) {
  const isEdit = mode.type === "edit";
  const category = isEdit ? mode.category : null;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nameAr: category?.nameAr ?? "",
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      order: category ? String(category.order) : "",
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      ...values,
      order: values.order ? Number(values.order) : 0,
      parentId: isEdit ? category?.parentId ?? null : mode.type === "add" ? mode.parentId : null,
    };
    // Mock-mode save: no write API exists yet.
    console.log("[admin] save category payload:", payload);
    // TODO(Phase 2D): persist via authenticated API — reason: admin writes must
    // wait for ADMIN_API_KEY auth (decision 1B).
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-3 rounded-lg border border-accent/40 bg-bg p-4"
    >
      <p className="text-sm font-semibold text-white">
        {isEdit ? `تعديل: ${category?.nameAr ?? category?.name}` : "تصنيف جديد"}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="الاسم بالعربي *"
          error={errors.nameAr?.message}
          {...register("nameAr")}
        />
        <Input label="الاسم بالإنجليزية" dir="ltr" {...register("name")} />
        <Input
          label="المعرّف *"
          dir="ltr"
          placeholder="oil-filter"
          error={errors.slug?.message}
          {...register("slug")}
        />
        <Input
          label="الترتيب"
          type="number"
          dir="ltr"
          error={errors.order?.message}
          {...register("order")}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          حفظ
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}

export function CategoryManager({ tree }: { tree: PartCategory[] }) {
  const [mode, setMode] = useState<Mode | null>(null);

  const renderNode = (category: PartCategory, depth: number): ReactNode => (
    <li key={category.id} className="space-y-2">
      <div
        className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
        style={{ marginInlineStart: depth * 16 }}
      >
        <span className="font-semibold text-white">
          {category.nameAr ?? category.name}
        </span>
        <span className="font-mono text-xs text-muted" dir="ltr">
          {category.slug}
        </span>
        <span className="rounded-full bg-bg px-2 py-0.5 text-xs text-muted">
          {nf.format(category._count?.products ?? 0)} منتج
        </span>
        <span className="ms-auto flex gap-3 text-sm">
          <button
            type="button"
            onClick={() => setMode({ type: "edit", category })}
            className="font-semibold text-accent hover:underline"
          >
            تعديل
          </button>
          <button
            type="button"
            onClick={() => setMode({ type: "add", parentId: category.id })}
            className="text-muted hover:text-white"
          >
            إضافة فرعي
          </button>
        </span>
      </div>
      {mode?.type === "edit" && mode.category.id === category.id && (
        <CategoryFormPanel
          key={`edit-${category.id}`}
          mode={mode}
          onCancel={() => setMode(null)}
        />
      )}
      {mode?.type === "add" && mode.parentId === category.id && (
        <CategoryFormPanel
          key={`add-${category.id}`}
          mode={mode}
          onCancel={() => setMode(null)}
        />
      )}
      {category.children && category.children.length > 0 && (
        <ul className="space-y-2">
          {category.children.map((child) => renderNode(child, depth + 1))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          onClick={() => setMode({ type: "add", parentId: null })}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:border-accent"
        >
          + تصنيف رئيسي
        </button>
      </div>
      {mode?.type === "add" && mode.parentId === null && (
        <CategoryFormPanel key="add-root" mode={mode} onCancel={() => setMode(null)} />
      )}
      {tree.length === 0 ? (
        <p className="text-muted">لا توجد تصنيفات بعد.</p>
      ) : (
        <ul className="space-y-2">{tree.map((category) => renderNode(category, 0))}</ul>
      )}
    </div>
  );
}
