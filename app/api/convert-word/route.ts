import { NextResponse } from "next/server";
import mammoth from "mammoth";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Vui lòng chọn file Word (.docx) để chuyển đổi." }, { status: 400 });
    }

    const ext = path.extname(file.name || "").toLowerCase();
    if (ext !== ".docx") {
      return NextResponse.json(
        { error: "Hệ thống hiện chỉ hỗ trợ định dạng Word chuẩn (.docx). Với file .doc cũ, vui lòng mở và Lưu dạng .docx trước." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert DOCX to clean HTML using mammoth
    const result = await mammoth.convertToHtml({ buffer });
    let html = result.value || "";

    // Extract suggested title from first heading or first line
    let suggestedTitle = "";
    const h1Match = html.match(/<h[1-2][^>]*>([\s\S]*?)<\/h[1-2]>/i);
    if (h1Match) {
      suggestedTitle = h1Match[1].replace(/<[^>]*>/g, "").trim();
    } else {
      const baseName = path.basename(file.name, ext);
      suggestedTitle = baseName.replace(/[-_]/g, " ").trim();
    }

    // Count words
    const textOnly = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = textOnly ? textOnly.split(" ").length : 0;

    return NextResponse.json({
      success: true,
      html,
      suggestedTitle,
      fileName: file.name,
      wordCount,
      messages: result.messages,
    });
  } catch (error: any) {
    console.error("Error converting DOCX:", error);
    return NextResponse.json(
      { error: "Lỗi chuyển đổi file Word: " + (error?.message || "File không hợp lệ.") },
      { status: 500 }
    );
  }
}
