import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    // Validate basic fields
    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Console log for Phase 1 (ready for Prisma / database integration in Phase 2)
    console.log("Contact Form Submission:", {
      name,
      phone,
      message,
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
