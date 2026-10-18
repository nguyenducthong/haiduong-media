import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file tải lên." }, { status: 400 });
    }

    // Check file size (hard limit 25MB for system stability)
    const MAX_DOC_SIZE = 25 * 1024 * 1024;
    const MAX_IMG_SIZE = 10 * 1024 * 1024;
    const originalName = file.name || "tailieu.dat";
    const ext = path.extname(originalName).toLowerCase().replace(".", "") || "dat";
    const isImage = file.type.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);

    if (file.size > MAX_DOC_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `Dung lượng file (${sizeMb} MB) quá lớn. Giới hạn tối đa cho phép là 25MB. Vui lòng nén hoặc chọn file nhỏ hơn.`,
        },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMG_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `Ảnh có dung lượng quá lớn (${sizeMb} MB). Giới hạn tối đa cho ảnh là 10MB (khuyên dùng dưới 2MB) để đảm bảo tốc độ tải trang nhanh cho độc giả.`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique safe filename preserving extension
    const timestamp = Date.now();
    const baseWithoutExt = path.basename(originalName, path.extname(originalName));
    const safeBaseName = baseWithoutExt
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40) || "file";
    const fileName = `${safeBaseName}-${timestamp}.${ext}`;

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
    const mimeType = file.type || mimeTypes[ext] || "application/octet-stream";
    const base64 = buffer.toString("base64");

    // 1. Try saving to D1 Database with chunking support for files of any size
    let savedInD1 = false;
    const CHUNK_SIZE = 400 * 1024; // 400KB base64 chunk (~300KB binary), well within SQLite 1MB statement limit

    try {
      const db = getDb();
      if (base64.length <= CHUNK_SIZE) {
        // Single row save
        const fileData = {
          fileName,
          originalName,
          mimeType,
          size: file.size,
          base64,
          createdAt: Date.now(),
        };

        await db
          .insert(siteContent)
          .values({
            key: `media:${fileName}`,
            data: JSON.stringify(fileData),
            updatedBy: "admin",
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: siteContent.key,
            set: {
              data: JSON.stringify(fileData),
              updatedAt: new Date(),
            },
          });
      } else {
        // Chunked save
        const totalChunks = Math.ceil(base64.length / CHUNK_SIZE);
        for (let i = 0; i < totalChunks; i++) {
          const chunkStr = base64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          await db
            .insert(siteContent)
            .values({
              key: `media_chunk:${fileName}:${i}`,
              data: chunkStr,
              updatedBy: "admin",
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: siteContent.key,
              set: {
                data: chunkStr,
                updatedAt: new Date(),
              },
            });
        }

        // Master index row (no raw base64)
        const masterData = {
          fileName,
          originalName,
          mimeType,
          size: file.size,
          chunkCount: totalChunks,
          createdAt: Date.now(),
        };

        await db
          .insert(siteContent)
          .values({
            key: `media:${fileName}`,
            data: JSON.stringify(masterData),
            updatedBy: "admin",
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: siteContent.key,
            set: {
              data: JSON.stringify(masterData),
              updatedAt: new Date(),
            },
          });
      }

      savedInD1 = true;
    } catch (d1Err: any) {
      console.warn("Could not save to D1:", d1Err?.message);
    }

    // Public URL:
    // When saved in D1, use standard streaming endpoint /api/media?name=fileName
    const publicUrl = savedInD1
      ? `/api/media?name=${encodeURIComponent(fileName)}`
      : `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      // Only include dataUrl for small files to avoid bloating client payloads
      ...(file.size < 200 * 1024 ? { dataUrl: `data:${mimeType};base64,${base64}` } : {}),
      fileName,
      originalName,
      size: file.size,
      ext,
      mimeType,
      message: "Tải file lên thành công!",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi tải file lên." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const imagesMap = new Map<string, { url: string; name: string }>();
    const documentsMap = new Map<string, { url: string; name: string; ext: string }>();

    // 1. Load from D1 database
    try {
      const db = getDb();
      const rows = await db
        .select({
          key: siteContent.key,
          data: siteContent.data,
        })
        .from(siteContent)
        .where(sql`${siteContent.key} LIKE 'media:%'`)
        .all();

      for (const row of rows) {
        try {
          const item = JSON.parse(row.data);
          const ext = path.extname(item.fileName).replace(".", "").toLowerCase();
          const isImg = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);
          const url = `/api/media?name=${encodeURIComponent(item.fileName)}`;

          if (isImg) {
            imagesMap.set(item.fileName, {
              url,
              name: item.originalName || item.fileName,
            });
          } else {
            documentsMap.set(item.fileName, {
              url,
              name: item.originalName || item.fileName,
              ext,
            });
          }
        } catch {}
      }
    } catch (d1Err) {
      console.warn("D1 list query failed:", d1Err);
    }

    // 2. Scan disk files (public/uploads and public/uploads/articles)
    const scanDirs = [
      { dir: new URL("file:///F:/project/haiduong-media/public/uploads/articles"), prefix: "/uploads/articles" },
      { dir: new URL("file:///F:/project/haiduong-media/public/uploads"), prefix: "/uploads" },
      { dir: path.join(process.cwd(), "public/uploads/articles"), prefix: "/uploads/articles" },
      { dir: path.join(process.cwd(), "public/uploads"), prefix: "/uploads" },
    ];

    for (const { dir, prefix } of scanDirs) {
      try {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)) {
              if (!imagesMap.has(file)) {
                imagesMap.set(file, {
                  url: `${prefix}/${file}`,
                  name: file,
                });
              }
            } else if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(file)) {
              const ext = path.extname(file).replace(".", "").toLowerCase();
              if (!documentsMap.has(file)) {
                documentsMap.set(file, {
                  url: `${prefix}/${file}`,
                  name: file,
                  ext,
                });
              }
            }
          }
        }
      } catch {}
    }

    // 3. Extract existing images from enterprises.json database
    try {
      const { getEnterprises } = await import("@/lib/enterprises");
      const enterprises = await getEnterprises();
      for (const art of enterprises) {
        if (art.image && typeof art.image === "string" && art.image.startsWith("/")) {
          const fileName = path.basename(art.image);
          if (!imagesMap.has(fileName)) {
            imagesMap.set(fileName, {
              url: art.image,
              name: fileName,
            });
          }
        }
        // Also extract from content HTML
        if (art.content && typeof art.content === "string") {
          const imgMatches = art.content.matchAll(/src="(\/uploads\/[^"]+)"/g);
          for (const match of imgMatches) {
            const url = match[1];
            const fileName = path.basename(url);
            if (!imagesMap.has(fileName)) {
              imagesMap.set(fileName, {
                url,
                name: fileName,
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn("Error reading enterprises for media library:", e);
    }

    return NextResponse.json({
      images: Array.from(imagesMap.values()),
      documents: Array.from(documentsMap.values()),
    });
  } catch (err: any) {
    return NextResponse.json({ images: [], documents: [] });
  }
}
