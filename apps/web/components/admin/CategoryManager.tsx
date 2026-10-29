"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormBanner } from "./FormBanner";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  categoryFormSchema,
  type CategoryFormValues,
  type UpdateCategoryInput,
  type PartCategory,
} from "@elsaad/shared";
import { createCategory, updateCategory, deleteCategory } from "@elsaad/api-client";
import { Loader2 } from "lucide-react";

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

type Mode =
  | { type: "edit"; category: PartCategory }
  | { type: "add"; parentId: string | null };

function CategoryFormPanel({
  mode,
  onCancel,
  onSuccess,
}: {
  mode: Mode;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const isEdit = mode.type === "edit";
  const category = isEdit ? mode.category : null;
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  const onSubmit = async (values: CategoryFormValues) => {
    setBanner(null);
    try {
      const payload = {
        nameAr: values.nameAr,
        name: values.name || undefined,
        slug: values.slug,
        order: values.order ? String(values.order) : "0",
        parentId: isEdit ? category?.parentId ?? null : mode.type === "add" ? mode.parentId : null,
      };

      if (isEdit && category) {
        const updatePayload: UpdateCategoryInput = {
          nameAr: payload.nameAr,
          name: payload.name,
          order: String(payload.order),
        };
        await updateCategory(category.id, updatePayload);
      } else {
        await createCategory(payload);
      }

      onSuccess();
      onCancel();
    } catch (err) {
      setBanner({
        type: "error",
        message: err instanceof Error ? err.message : "حدث خطأ أثناء حفظ التصنيف",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-3 rounded-lg border border-accent/40 bg-bg p-4"
      dir="rtl"
    >
      <p className="text-sm font-semibold text-white">
        {isEdit ? `تعديل: ${category?.nameAr ?? category?.name}` : "تصنيف جديد"}
      </p>

      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

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
          disabled={isEdit}
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
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-1 inline" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <span>حفظ</span>
          )}
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}

export function CategoryManager({ tree, onSuccess }: { tree: PartCategory[]; onSuccess: () => void }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PartCategory | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setBanner({ type: "success", message: "تم حذف التصنيف بنجاح" });
      setDeleteTarget(null);
      onSuccess();
    } catch (err) {
      setBanner({
        type: "error",
        message: err instanceof Error ? err.message : "تعسّر حذف التصنيف",
      });
      setDeleteTarget(null);
    }
  };

  const renderNode = (category: PartCategory, depth: number): ReactNode => (
    <li key={category.id} className="space-y-2">
      <div
        className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
        style={{ marginInlineStart: depth * 16 }}
        dir="rtl"
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
          <button
            type="button"
            onClick={() => setDeleteTarget(category)}
            className="text-red-400 hover:text-red-300"
          >
            حذف
          </button>
        </span>
      </div>
      {mode?.type === "edit" && mode.category.id === category.id && (
        <CategoryFormPanel
          key={`edit-${category.id}`}
          mode={mode}
          onCancel={() => setMode(null)}
          onSuccess={onSuccess}
        />
      )}
      {mode?.type === "add" && mode.parentId === category.id && (
        <CategoryFormPanel
          key={`add-${category.id}`}
          mode={mode}
          onCancel={() => setMode(null)}
          onSuccess={onSuccess}
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
    <div className="space-y-4" dir="rtl">
      {banner && <FormBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

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
        <CategoryFormPanel key="add-root" mode={mode} onCancel={() => setMode(null)} onSuccess={onSuccess} />
      )}
      {tree.length === 0 ? (
        <p className="text-muted">لا توجد تصنيفات بعد.</p>
      ) : (
        <ul className="space-y-2">{tree.map((category) => renderNode(category, 0))}</ul>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="حذف التصنيف"
          message={`هل أنت متأكد من حذف التصنيف "${deleteTarget.nameAr ?? deleteTarget.name}"؟`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
