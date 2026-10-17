import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { saveSiteContent, type SiteContent } from "@/lib/site-content";

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập để cập nhật nội dung." }, { status: 401 });

  try {
    const content = await request.json() as SiteContent;
    const saved = await saveSiteContent(content, user.email);
    return NextResponse.json({ content: saved, message: "Đã lưu nội dung website." });
  } catch (error) {
    console.error("Unable to update site content", error);
    return NextResponse.json({ error: "Không thể lưu nội dung lúc này." }, { status: 500 });
  }
}
