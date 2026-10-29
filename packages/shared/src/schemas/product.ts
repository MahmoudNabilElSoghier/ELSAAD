import { z } from "zod";

// Prices/tax/quantity arrive as strings (input fields) and are converted to
// numbers in the form's onSubmit — keeps RHF typing simple and avoids the
// z.coerce.number() pitfall where "" silently becomes 0.
const optionalNumber = z
  .string()
  .optional()
  .refine((value) => value === undefined || value === "" || !Number.isNaN(Number(value)), {
    message: "أدخل رقمًا صحيحًا",
  });

export const productFormSchema = z.object({
  code: z.string().min(1, "كود المنتج مطلوب"),
  name: z.string().min(2, "اسم المنتج مطلوب"),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  oemCode: z.string().optional(),
  brandId: z.string().optional(),
  partCategoryId: z.string().optional(),
  costPrice: optionalNumber,
  wholesalePrice: optionalNumber,
  retailPrice: optionalNumber,
  vipPrice: optionalNumber,
  taxRate: optionalNumber,
  unitOfMeasure: z.string().min(1, "وحدة القياس مطلوبة"),
  reorderLevel: z
    .string()
    .refine((value) => value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0), {
      message: "أدخل عددًا صحيحًا",
    }),
  tags: z.string().optional(),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export const createProductSchema = productFormSchema;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export const updateProductSchema = productFormSchema.partial().strict();
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
