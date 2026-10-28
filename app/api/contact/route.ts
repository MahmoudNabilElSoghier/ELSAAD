import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
          error: "برجاء التحقق من صحة البيانات المدخلة",
        },
        { status: 400 }
      );
    }

    const { name, phone, message } = result.data;

    if (process.env.DATABASE_URL) {
      // Dynamic import: PrismaClient is only constructed when a database
      // is actually configured (client generation happens on first db push).
      const { db } = await import("@/lib/db");
      await db.contactMessage.create({
        data: { name, phone, message: message || null },
      });
    } else {
      console.log("Validated Contact Submission:", {
        name,
        phone,
        message: message || null,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: true, message: "تم استلام رسالتك بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
