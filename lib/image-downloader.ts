import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";

const UPLOADS_SUBDIR = path.join("public", "uploads", "articles");

const FALLBACK_IMAGES = [
  "/images/news-placeholder.jpg",
];

// Track unreachable hosts during execution to fail-fast
const failedHosts = new Set<string>();

function ensureDirSync(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch {
    // Edge runtime filesystem is read-only
  }
}

export function getDeterministicFallback(seed: string): string {
  return "/images/news-placeholder.jpg";
}

export async function downloadAndSaveImage(
  urlOrData: string,
  articleSlug = ""
): Promise<string> {
  if (!urlOrData || typeof urlOrData !== "string") {
    return "/images/news-placeholder.jpg";
  }

  const trimmed = urlOrData.trim();
  if (!trimmed) {
    return "/images/news-placeholder.jpg";
  }

  // Already a local path or media streaming route
  if (trimmed.startsWith("/") || trimmed.startsWith("./")) {
    return trimmed;
  }

  let targetDir = "";
  try {
    targetDir = path.join(process.cwd(), UPLOADS_SUBDIR);
    ensureDirSync(targetDir);
  } catch {}

  // 1. Handle Base64 Data URI: data:image/jpeg;base64,...
  if (trimmed.startsWith("data:image/")) {
    try {
      const match = trimmed.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,([\s\S]+)$/i);
      if (match) {
        const rawExt = match[1].toLowerCase();
        const ext = rawExt.includes("png")
          ? ".png"
          : rawExt.includes("webp")
          ? ".webp"
          : rawExt.includes("gif")
          ? ".gif"
          : ".jpg";
        const base64Data = match[2].trim().replace(/\s/g, "");
        const hash = createHash("sha256").update(base64Data.slice(0, 1000)).digest("hex").slice(0, 16);
        const fileName = `b64_${hash}${ext}`;
        const mimeType = match[1].toLowerCase().startsWith("image/") ? match[1].toLowerCase() : `image/${rawExt}`;

        // 1.1 First: Try saving to Cloudflare D1 Database (works everywhere, local + cloud)
        try {
          const db = getDb();
          const fileData = {
            fileName,
            originalName: fileName,
            mimeType,
            size: Math.round((base64Data.length * 3) / 4),
            base64: base64Data,
            createdAt: Date.now(),
          };

          await db
            .insert(siteContent)
            .values({
              key: `media:${fileName}`,
              data: JSON.stringify(fileData),
              updatedBy: "system",
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: siteContent.key,
              set: {
                data: JSON.stringify(fileData),
                updatedAt: new Date(),
              },
            });

          return `/api/media?name=${encodeURIComponent(fileName)}`;
        } catch {
          // D1 not available in current environment, try local disk
        }

        // 1.2 Second: Try saving to local disk if target directory is writable
        if (targetDir) {
          try {
            const filePath = path.join(targetDir, fileName);
            if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
              fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
            }
            return `/uploads/articles/${fileName}`;
          } catch {
            // Read-only filesystem in serverless/workers
          }
        }

        // 1.3 Safe fallback: NEVER replace user's image with a stock banner! Return original base64
        return trimmed;
      }
    } catch (err: any) {
      console.warn("Lỗi xử lý ảnh base64:", err?.message);
      return trimmed;
    }

    return trimmed;
  }

  // 2. Handle Remote HTTP / HTTPS URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    let hostname = "";
    let ext = ".jpg";
    try {
      const urlObj = new URL(trimmed);
      hostname = urlObj.hostname;
      const pathname = urlObj.pathname;
      const detectedExt = path.extname(pathname).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(detectedExt)) {
        ext = detectedExt === ".jpeg" ? ".jpg" : detectedExt;
      }
    } catch {}

    const urlHash = createHash("md5").update(trimmed).digest("hex").slice(0, 16);
    const fileName = `img_${urlHash}${ext}`;
    const filePath = targetDir ? path.join(targetDir, fileName) : "";

    // If already downloaded and valid on disk
    if (filePath) {
      try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 200) {
          return `/uploads/articles/${fileName}`;
        }
      } catch {}
    }

    // Fail-fast if hostname is already known to be down/unreachable
    if (hostname && failedHosts.has(hostname)) {
      return trimmed;
    }

    // Try downloading with 3-second timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(trimmed, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length > 100) {
          // Try saving to D1
          try {
            const db = getDb();
            const b64 = buffer.toString("base64");
            const fileData = {
              fileName,
              originalName: fileName,
              mimeType: `image/${ext.replace(".", "")}`,
              size: buffer.length,
              base64: b64,
              createdAt: Date.now(),
            };
            await db
              .insert(siteContent)
              .values({
                key: `media:${fileName}`,
                data: JSON.stringify(fileData),
                updatedBy: "system",
                updatedAt: new Date(),
              })
              .onConflictDoUpdate({
                target: siteContent.key,
                set: {
                  data: JSON.stringify(fileData),
                  updatedAt: new Date(),
                },
              });
            return `/api/media?name=${encodeURIComponent(fileName)}`;
          } catch {}

          if (filePath) {
            try {
              fs.writeFileSync(filePath, buffer);
              return `/uploads/articles/${fileName}`;
            } catch {
              return trimmed;
            }
          }
        }
      } else {
        if (hostname) failedHosts.add(hostname);
      }
    } catch {
      if (hostname) failedHosts.add(hostname);
    }

    // Keep remote URL safely: NEVER replace with a stock banner!
    return trimmed;
  }

  return trimmed;
}

export async function localizeArticleContentImages(
  contentHtml: string,
  articleSlug = ""
): Promise<string> {
  if (!contentHtml) return "";

  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const matches = Array.from(contentHtml.matchAll(imgRegex));
  if (matches.length === 0) return contentHtml;

  let localizedHtml = contentHtml;

  // Process unique sources in parallel
  const uniqueSrcs = Array.from(new Set(matches.map((m) => m[1]).filter(Boolean)));
  const replacementMap = new Map<string, string>();

  await Promise.all(
    uniqueSrcs.map(async (src) => {
      // If already a local media or uploads URL, leave unchanged
      if (src.startsWith("/uploads/") || src.startsWith("/images/") || src.startsWith("/api/media")) {
        replacementMap.set(src, src);
        return;
      }
      try {
        const localUrl = await downloadAndSaveImage(src, articleSlug);
        // Only replace if localUrl is valid and NOT a generic placeholder / banner!
        if (localUrl && !localUrl.includes("placeholder") && !FALLBACK_IMAGES.includes(localUrl)) {
          replacementMap.set(src, localUrl);
        } else {
          // Keep original src so user's image is NEVER lost
          replacementMap.set(src, src);
        }
      } catch {
        replacementMap.set(src, src);
      }
    })
  );

  for (const match of matches) {
    const fullTag = match[0];
    const src = match[1];
    const localUrl = replacementMap.get(src);
    if (localUrl && localUrl !== src) {
      const updatedTag = fullTag
        .replace(`src="${src}"`, `src="${localUrl}"`)
        .replace(`src='${src}'`, `src='${localUrl}'`);
      localizedHtml = localizedHtml.replace(fullTag, updatedTag);
    }
  }

  return localizedHtml;
}

export async function localizeArticleImages(article: any): Promise<any> {
  if (!article) return article;

  const slug = article.slug || article.id || "art";

  // 1. Localize featured thumbnail (preserve user's image, never overwrite with stock banner)
  let localImage = article.image;
  if (article.image) {
    try {
      const resImg = await downloadAndSaveImage(article.image, slug);
      if (resImg && !FALLBACK_IMAGES.includes(resImg) && !resImg.includes("news-placeholder")) {
        localImage = resImg;
      }
    } catch {
      // Keep original article.image
    }
  } else {
    localImage = "/images/news-placeholder.jpg";
  }

  // 2. Localize all inline content images
  const localContent = await localizeArticleContentImages(article.content || "", slug);

  return {
    ...article,
    image: localImage,
    content: localContent,
  };
}
