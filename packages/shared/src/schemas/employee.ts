import { z } from "zod";

export const createEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "كود الموظف مطلوب"),
  nameAr: z.string().min(1, "الاسم بالعربية مطلوب"),
  nameEn: z.string().optional(),
  nationalId: z.string().optional(),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "رقم موبايل مصري غير صحيح"),
  email: z.string().email().optional().or(z.literal("")),
  role: z.string().min(1, "الوظيفة مطلوبة"),
  branchId: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial().strict();
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
