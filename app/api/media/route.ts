import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import path from "node:path";
import fs from "node:fs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";
    const isDownload = searchParams.get("download") === "1";

    if (!name) {
      return new NextResponse("Tên file không hợp lệ.", { status: 400 });
    }

    // 1. Try reading from D1 database first
    try {
      const db = getDb();
      const row = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, `media:${name}`))
        .get();

      if (row && row.data) {
        const fileInfo = JSON.parse(row.data);
        let buffer: Buffer;

        if (fileInfo.chunkCount && typeof fileInfo.chunkCount === "number") {
          // Reassemble chunks by exact primary key lookups (avoids SQLite LIKE pattern length limit)
          const chunkPromises = Array.from({ length: fileInfo.chunkCount }, (_, i) =>
            db
              .select({ data: siteContent.data })
              .from(siteContent)
              .where(eq(siteContent.key, `media_chunk:${name}:${i}`))
              .get()
          );
          const chunkRows = await Promise.all(chunkPromises);
          const fullBase64 = chunkRows.map((r) => r?.data || "").join("");
          buffer = Buffer.from(fullBase64, "base64");
        } else if (fileInfo.base64) {
          buffer = Buffer.from(fileInfo.base64, "base64");
        } else {
          buffer = Buffer.alloc(0);
        }

        const mimeType = fileInfo.mimeType || "application/octet-stream";
        const filename = fileInfo.originalName || name;

        return new Response(new Uint8Array(buffer), {
          headers: {
            "Content-Type": mimeType,
            "Content-Disposition": isDownload
              ? `attachment; filename="${encodeURIComponent(filename)}"`
              : `inline; filename="${encodeURIComponent(filename)}"`,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch (d1Err) {
      console.warn("D1 media lookup failed:", d1Err);
    }

    // 2. Try reading from disk (public/uploads or public/uploads/articles)
    const diskCandidates = [
      path.join(process.cwd(), "public/uploads", name),
      path.join(process.cwd(), "public/uploads/articles", name),
      path.resolve("public/uploads", name),
      path.resolve("public/uploads/articles", name),
    ];

    for (const diskPath of diskCandidates) {
      try {
        if (fs.existsSync(diskPath)) {
          const buffer = fs.readFileSync(diskPath);
          const ext = path.extname(name).toLowerCase().replace(".", "");
          const mimeTypes: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            webp: "image/webp",
            gif: "image/gif",
            svg: "image/svg+xml",
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            xls: "application/vnd.ms-excel",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          };
          const mimeType = mimeTypes[ext] || "application/octet-stream";

          return new Response(new Uint8Array(buffer), {
            headers: {
              "Content-Type": mimeType,
              "Content-Disposition": isDownload
                ? `attachment; filename="${encodeURIComponent(name)}"`
                : `inline; filename="${encodeURIComponent(name)}"`,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
      } catch {}
    }

    return new NextResponse("File không tồn tại trên hệ thống.", { status: 404 });
  } catch (error: any) {
    return new NextResponse(`Lỗi: ${error?.message || "Không thể tải file"}`, { status: 500 });
  }
}
