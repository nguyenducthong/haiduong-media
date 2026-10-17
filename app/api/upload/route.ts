import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file ảnh tải lên." }, { status: 400 });
    }

    // Check file size (e.g. limit 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Dung lượng ảnh vượt quá 10MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique safe filename
    const timestamp = Date.now();
    const originalName = file.name || "upload.jpg";
    const ext = path.extname(originalName) || ".jpg";
    const safeBaseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);
    const fileName = `${safeBaseName}-${timestamp}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName,
      message: "Tải ảnh lên thành công!",
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
