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

    /*
     * TODO (Phase 2): Replace console.log with Prisma database write:
     * await prisma.contactMessage.create({
     *   data: { name, phone, message: message || null }
     * });
     */
    console.log("Validated Contact Submission:", {
      name,
      phone,
      message: message || null,
      timestamp: new Date().toISOString(),
    });

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
