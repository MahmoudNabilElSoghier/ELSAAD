import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "رقم موبايل مصري غير صحيح"),
  message: z.string().max(1000, "الرسالة طويلة جداً").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
