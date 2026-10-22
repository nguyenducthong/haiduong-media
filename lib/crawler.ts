import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { balanceHtmlTags, getEnterprises, saveEnterprisesToDb } from "@/lib/enterprises";

export function generateHash(content: string, length = 32): string {
  if (!content) return "";
  return createHash("sha256")
    .update(content.trim())
    .digest("hex")
    .slice(0, length);
}

export function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectCategory(title: string, excerpt?: string): string {
  const t = (title + " " + (excerpt || "")).toLowerCase();
  if (
    t.includes("sao vàng thương hiệu") ||
    t.includes("thương hiệu quốc gia") ||
    t.includes("top 10") ||
    t.includes("thương hiệu xuất sắc")
  ) {
    return "Thương hiệu Quốc gia";
  }
  if (
    t.includes("phòng khám") ||
    t.includes("dược") ||
    t.includes("khám chữa bệnh") ||
    t.includes("y tế") ||
    t.includes("thẩm mỹ") ||
    t.includes("sức khỏe") ||
    t.includes("anvy") ||
    t.includes("bệnh viện")
  ) {
    return "Y tế & Chăm sóc sức khỏe";
  }
  if (
    t.includes("hồ sơ") ||
    t.includes("tiếp nhận") ||
    t.includes("đăng ký tham gia") ||
    t.includes("v/v")
  ) {
    return "Thông báo & Tiếp nhận hồ sơ";
  }
  if (
    t.includes("sản xuất") ||
    t.includes("vật liệu") ||
    t.includes("công nghệ") ||
    t.includes("nhà máy") ||
    t.includes("khí công nghiệp")
  ) {
    return "Công nghệ & Sản xuất";
  }
  if (
    t.includes("hotel") ||
    t.includes("travel") ||
    t.includes("du lịch") ||
    t.includes("khách sạn")
  ) {
    return "Du lịch & Khách sạn";
  }
  return "Doanh nghiệp tiêu biểu";
}

export function toAbsoluteUrl(baseUrl: string, relativeUrl: string): string {
  if (!relativeUrl) return "";
  if (
    relativeUrl.startsWith("http://") ||
    relativeUrl.startsWith("https://") ||
    relativeUrl.startsWith("data:")
  ) {
    return relativeUrl;
  }
  return `https://kinhtechaua.vn/${relativeUrl.replace(/^\//, "")}`;
}

export async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`Không thể tải trang ${url} (HTTP ${res.status})`);
  return await res.text();
}

export function extractDetailFromHtml(html: string): string {
  if (!html) return "";

  // 1. Try explicit comment match used by kinhtechaua.vn
  const commentMatch = html.match(
    /<div class="f-detail[^"]*">([\s\S]*?)<\/div>\s*<!--\s*End\s*\.f-detail\s*-->/i
  );
  let rawContent = "";
  if (commentMatch && commentMatch[1]?.trim()) {
    rawContent = commentMatch[1].trim();
  } else {
    // 2. Tag balancer to handle arbitrarily nested <div> tags inside f-detail
    const markerIdx = html.search(/<div class="f-detail[^"]*"/i);
    if (markerIdx !== -1) {
      const openTagEnd = html.indexOf(">", markerIdx);
      if (openTagEnd !== -1) {
        const contentStart = openTagEnd + 1;
        let depth = 1;
        const divRegex = /<\/?div\b[^>]*>/gi;
        divRegex.lastIndex = contentStart;
        let match;
        while ((match = divRegex.exec(html)) !== null) {
          const tag = match[0].toLowerCase();
          if (tag.startsWith("</div")) {
            depth--;
            if (depth === 0) {
              rawContent = html.slice(contentStart, match.index).trim();
              break;
            }
          } else if (!tag.endsWith("/>")) {
            depth++;
          }
        }
      }
    }
  }

  // 3. Fallback for generic article containers
  if (!rawContent) {
    const genericMatch = html.match(
      /<(?:article|div)[^>]*class="[^"]*(?:article-body|detail-content|post-content|entry-content)[^"]*"[^>]*>([\s\S]*?)<\/(?:article|div)>/i
    );
    if (genericMatch) {
      rawContent = genericMatch[1].trim();
    }
  }

  if (!rawContent) return "";

  // Convert relative images to absolute
  rawContent = rawContent.replace(/src="([^"]+)"/g, (match, src) => {
    return `src="${toAbsoluteUrl("https://kinhtechaua.vn", src)}"`;
  });

  // Remove empty placeholder tags
  rawContent = rawContent.replace(
    /<h1 style="text-align:center">\s*(&nbsp;|\s)*<\/h1>/gi,
    ""
  );

  return rawContent.trim();
}

export async function scanArticleDetail(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return "";
    const html = await res.text();
    return extractDetailFromHtml(html);
  } catch (err: any) {
    console.warn(`Error fetching detail from ${url}:`, err.message);
    return "";
  }
}

export function detectTypeFromUrl(url: string): string[] {
  if (!url) return ["doanh-nghiep"];
  const u = url.toLowerCase();
  if (u.includes("doanh-nhan")) return ["doanh-nhan"];
  if (u.includes("tin-tuc")) return ["tin-tuc"];
  if (u.includes("san-pham")) return ["san-pham"];
  if (u.includes("su-kien")) return ["su-kien"];
  return ["doanh-nghiep"];
}

export function parseSingleArticleFromHtml(html: string, url = "") {
  const ogTitle =
    html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1] ||
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();

  if (!ogTitle) return [];

  const title = cleanText(ogTitle);
  const ogImage =
    html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] || "";
  const ogDesc =
    html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)?.[1] ||
    html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "";
  const excerpt = cleanText(ogDesc);

  const dateMatch = html.match(/<i class="icon_web_1"><\/i>\s*([^<\s]+)/);
  const viewsMatch = html.match(/<i class="icon_web_2"><\/i>\s*([^<\s]+)/);
  const date = dateMatch ? dateMatch[1].trim() : "16/09/2026";
  const views = viewsMatch ? viewsMatch[1].trim() : "100";

  const slug =
    url.replace(/^.*\/([^/]+)\.htm(?:[?#].*)?$/, "$1") ||
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const category = detectCategory(title, excerpt);
  const detailUrl = url || `https://kinhtechaua.vn/${slug}.htm`;
  const imgUrl = toAbsoluteUrl("https://kinhtechaua.vn", ogImage);

  const urlHash = generateHash(detailUrl, 16);
  const titleHash = generateHash(title.toLowerCase(), 16);
  const hash = generateHash(detailUrl + "::" + title, 32);

  return [
    {
      id: slug,
      slug,
      title,
      type: detectTypeFromUrl(detailUrl || url),
      category,
      excerpt,
      image: imgUrl,
      date,
      views,
      author: "",
      urlHash,
      titleHash,
      hash,
      active: true,
    },
  ];
}

export function parseArticlesFromHtml(html: string, url = "") {
  const listMatch = html.match(/<ul class="list_cata">([\s\S]*?)<\/ul><!-- End \.list_cata -->/);
  if (!listMatch) {
    return parseSingleArticleFromHtml(html, url);
  }

  const rawItems = listMatch[1].split(/<li>\s*<figure>/).slice(1);
  const items = [];

  for (const raw of rawItems) {
    const linkMatch = raw.match(/<a href="([^"]+)">/);
    const imgMatch = raw.match(/<img class="img_object_fit" src="([^"]+)"/);
    const titleMatch = raw.match(/<h3>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/h3>/);
    const dateMatch = raw.match(/<i class="icon_web_1"><\/i>\s*([^<\s]+)/);
    const viewsMatch = raw.match(/<i class="icon_web_2"><\/i>\s*([^<\s]+)/);
    const pMatch = raw.match(/<p>([\s\S]*?)<\/p>/);

    const title = titleMatch ? cleanText(titleMatch[1]) : "";
    const relLink = linkMatch ? linkMatch[1].trim() : "";
    const detailUrl = toAbsoluteUrl("https://kinhtechaua.vn", relLink);
    const relImg = imgMatch ? imgMatch[1].trim() : "";
    const imgUrl = toAbsoluteUrl("https://kinhtechaua.vn", relImg);
    const date = dateMatch ? dateMatch[1].trim() : "03/10/2026";
    const views = viewsMatch ? viewsMatch[1].trim() : "100";
    const excerpt = pMatch ? cleanText(pMatch[1]) : "";

    const slug =
      relLink.replace(/^.*\/([^/]+)\.htm$/, "$1") ||
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const category = detectCategory(title, excerpt);

    // Hashes for deduplication
    const urlHash = generateHash(detailUrl, 16);
    const titleHash = generateHash(title.toLowerCase(), 16);
    const hash = generateHash(detailUrl + "::" + title, 32);

    items.push({
      id: slug,
      slug,
      title,
      type: detectTypeFromUrl(detailUrl || url),
      category,
      excerpt,
      image: imgUrl,
      date,
      views,
      author: "",
      urlHash,
      titleHash,
      hash,
      active: true,
    });
  }

  return items;
}

export async function scanList(url: string) {
  const html = await fetchPage(url);
  const items = parseArticlesFromHtml(html, url);

  // Cross-reference with existing articles to detect duplicates
  const current = await getEnterprises();
  const existingSlugs = new Set(current.map((a: any) => a.slug));
  const existingUrls = new Set(current.map((a: any) => a.sourceUrl).filter(Boolean));
  const existingUrlHashes = new Set(current.map((a: any) => a.urlHash).filter(Boolean));
  const existingTitleHashes = new Set(current.map((a: any) => a.titleHash).filter(Boolean));
  const existingHashes = new Set(current.map((a: any) => a.hash).filter(Boolean));

  return items.map((item) => {
    const isDuplicate =
      existingSlugs.has(item.slug) ||
      existingUrls.has(item.sourceUrl) ||
      existingUrlHashes.has(item.urlHash) ||
      existingTitleHashes.has(item.titleHash) ||
      existingHashes.has(item.hash);

    return {
      ...item,
      isDuplicate,
    };
  });
}

export function enrichArticle(article: any, contentHtml: string) {
  const safeContent = balanceHtmlTags(contentHtml || article.content || "");
  const textOnly = safeContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = textOnly ? textOnly.split(" ").length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 220)) + " phút đọc";

  const imgMatches = safeContent.match(/<img[^>]+>/g) || [];
  const imageCount = imgMatches.length;

  // Content hash to detect if content body has changed
  const contentHash = generateHash(safeContent, 32);

  return {
    ...article,
    content: safeContent,
    contentHash,
    wordCount,
    readTime,
    imageCount,
    category: article.category || detectCategory(article.title, article.excerpt),
    author: article.author || "",
    type: Array.isArray(article.type) && article.type.length > 0
      ? article.type
      : typeof article.type === "string" && article.type.trim()
      ? [article.type.trim()]
      : detectTypeFromUrl(article.sourceUrl || ""),
    active: true,
  };
}

function getFileTarget(): string {
  const candidates = [
    path.join(process.cwd(), "data", "enterprises.json"),
    path.resolve("data", "enterprises.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return candidates[0];
}

export const loadCurrentEnterprises = getEnterprises;

export async function saveEnterprises(
  newArticles: any[],
  mode: "merge" | "overwrite" | "replace_all" = "merge"
) {
  let finalArticles: any[] = [];
  let added = 0;
  let updated = 0;
  let skipped = 0;

  if (mode === "replace_all") {
    finalArticles = newArticles;
    added = newArticles.length;
  } else {
    const current = await getEnterprises();
    finalArticles = [...current];

    for (const a of newArticles) {
      // Tìm bài viết trùng theo slug, id, sourceUrl, urlHash, hoặc hash
      const existingIdx = finalArticles.findIndex((x) =>
        (a.slug && x.slug === a.slug) ||
        (a.id && x.id === a.id) ||
        (a.sourceUrl && x.sourceUrl === a.sourceUrl) ||
        (a.urlHash && x.urlHash && x.urlHash === a.urlHash) ||
        (a.hash && x.hash && x.hash === a.hash)
      );

      if (existingIdx === -1) {
        // Bài viết mới hoàn toàn -> thêm vào đầu danh sách
        finalArticles.unshift(a);
        added++;
      } else {
        const existing = finalArticles[existingIdx];

        if (mode === "overwrite") {
          // Ghi đè thay thế bài cũ bằng dữ liệu mới cào
          finalArticles[existingIdx] = {
            ...existing,
            ...a,
            id: existing.id || a.id,
            slug: a.slug || existing.slug,
          };
          updated++;
        } else {
          // Chế độ merge: kiểm tra xem có thay đổi nội dung, type, tiêu đề, ảnh, hay chuyên mục không
          const typeA = JSON.stringify(a.type || []);
          const typeEx = JSON.stringify(existing.type || []);
          const isContentSame =
            existing.contentHash && a.contentHash && existing.contentHash === a.contentHash;
          const isTypeSame = typeA === typeEx;
          const isTitleSame = existing.title === a.title;
          const isCategorySame = existing.category === a.category;

          if (isContentSame && isTypeSame && isTitleSame && isCategorySame) {
            skipped++;
          } else {
            // Có thay đổi (nội dung hoặc phân loại menu/chuyên mục) -> Cập nhật
            finalArticles[existingIdx] = {
              ...existing,
              ...a,
              id: existing.id || a.id,
              slug: a.slug || existing.slug,
            };
            updated++;
          }
        }
      }
    }
  }

  await saveEnterprisesToDb(finalArticles);

  return {
    total: finalArticles.length,
    added,
    updated,
    skipped,
    articles: finalArticles,
  };
}
