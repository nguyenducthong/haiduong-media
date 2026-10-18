import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const UPLOADS_SUBDIR = path.join("public", "uploads", "articles");

const FALLBACK_IMAGES = [
  "/images/posts/post-thuong-hieu-manh.png",
  "/images/posts/post-ceo-branding.png",
  "/images/posts/post-thoi-su-vtv.png",
  "/images/posts/post-tet-3-mien.png",
  "/images/posts/post-lens-11-nam.png",
  "/images/posts/post-marketing-trend.jpeg",
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
  let hashVal = 0;
  for (let i = 0; i < seed.length; i++) {
    hashVal = (hashVal << 5) - hashVal + seed.charCodeAt(i);
    hashVal |= 0;
  }
  const idx = Math.abs(hashVal) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[idx];
}

export async function downloadAndSaveImage(
  urlOrData: string,
  articleSlug = ""
): Promise<string> {
  if (!urlOrData || typeof urlOrData !== "string") {
    return getDeterministicFallback(articleSlug || "default");
  }

  const trimmed = urlOrData.trim();

  // Already a local path
  if (trimmed.startsWith("/") || trimmed.startsWith("./")) {
    return trimmed;
  }

  let targetDir = "";
  try {
    targetDir = path.join(process.cwd(), UPLOADS_SUBDIR);
    ensureDirSync(targetDir);
  } catch {}

  // Handle Base64 Data URI: data:image/jpeg;base64,...
  if (trimmed.startsWith("data:image/")) {
    try {
      const match = trimmed.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match && targetDir) {
        const rawExt = match[1].toLowerCase();
        const ext = rawExt === "jpeg" ? ".jpg" : `.${rawExt.split("+")[0]}`;
        const base64Data = match[2];
        const hash = createHash("sha256").update(base64Data.slice(0, 1000)).digest("hex").slice(0, 16);
        const fileName = `b64_${hash}${ext}`;
        const filePath = path.join(targetDir, fileName);

        try {
          if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
            fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
          }
          return `/uploads/articles/${fileName}`;
        } catch {
          return getDeterministicFallback(articleSlug || "b64");
        }
      }
    } catch (err: any) {
      console.warn("Lỗi lưu ảnh base64:", err.message);
      return getDeterministicFallback(articleSlug || "b64");
    }
  }

  // Handle Remote HTTP / HTTPS URL
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

    // If already downloaded and valid, return local path immediately
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
        if (buffer.length > 100 && filePath) {
          try {
            fs.writeFileSync(filePath, buffer);
            return `/uploads/articles/${fileName}`;
          } catch {
            // Filesystem read-only in Cloudflare Workerd edge runtime: safely keep original remote URL!
            return trimmed;
          }
        }
      } else {
        if (hostname) failedHosts.add(hostname);
      }
    } catch (err: any) {
      if (hostname) failedHosts.add(hostname);
    }

    // If existing file is valid
    if (filePath) {
      try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
          return `/uploads/articles/${fileName}`;
        }
      } catch {}
    }

    // Keep remote URL safely
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
      if (src.startsWith("/uploads/") || src.startsWith("/images/")) {
        replacementMap.set(src, src);
        return;
      }
      try {
        const localUrl = await downloadAndSaveImage(src, articleSlug);
        if (localUrl) {
          replacementMap.set(src, localUrl);
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

  // 1. Localize featured thumbnail
  const localImage = await downloadAndSaveImage(article.image, slug);

  // 2. Localize all inline content images
  const localContent = await localizeArticleContentImages(article.content || "", slug);

  return {
    ...article,
    image: localImage,
    content: localContent,
  };
}
