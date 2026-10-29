import { z } from "zod";

export const brandFormSchema = z.object({
  name: z.string().min(1, "اسم الماركة مطلوب"),
  nameAr: z.string().optional(),
  slug: z
    .string()
    .min(1, "المعرّف مطلوب")
    .regex(/^[a-z0-9-]+$/, "المعرّف يجب أن يكون إنجليزيًا (a-z, 0-9, -)"),
  website: z.string().url("رابط غير صحيح").optional().or(z.literal("")),
  description: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;
export const createBrandSchema = brandFormSchema;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export const updateBrandSchema = brandFormSchema.partial().strict();
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

export const categoryFormSchema = z.object({
  nameAr: z.string().min(1, "اسم التصنيف مطلوب"),
  name: z.string().optional(),
  slug: z
    .string()
    .min(1, "المعرّف مطلوب")
    .regex(/^[a-z0-9-]+$/, "المعرّف يجب أن يكون إنجليزيًا (a-z, 0-9, -)"),
  order: z.string().refine((value) => value === "" || Number.isInteger(Number(value)), {
    message: "أدخل عددًا صحيحًا",
  }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export const createCategorySchema = categoryFormSchema;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export const updateCategorySchema = categoryFormSchema.partial().strict();
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
