import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import initialEnterprises from "@/data/enterprises.json";
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

    const detailMatch = html.match(/<div class="f-detail clearfix">([\s\S]*?)<\/div>/);
    if (!detailMatch) return "";

    let contentHtml = detailMatch[1];

    // Convert relative images to absolute
    contentHtml = contentHtml.replace(/src="([^"]+)"/g, (match, src) => {
      return `src="${toAbsoluteUrl("https://kinhtechaua.vn", src)}"`;
    });

    // Remove empty placeholder tags
    contentHtml = contentHtml.replace(/<h1 style="text-align:center">\s*(&nbsp;|\s)*<\/h1>/gi, "");

    return contentHtml.trim();
  } catch (err: any) {
    console.warn(`Error fetching detail from ${url}:`, err.message);
    return "";
  }
}

export function parseArticlesFromHtml(html: string) {
  const listMatch = html.match(/<ul class="list_cata">([\s\S]*?)<\/ul><!-- End \.list_cata -->/);
  if (!listMatch) return [];

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
      category,
      excerpt,
      image: imgUrl,
      date,
      views,
      sourceUrl: detailUrl,
      author: "Viện Nghiên Cứu Kinh Tế Châu Á",
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
  const items = parseArticlesFromHtml(html);

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
    author: article.author || "Viện Nghiên Cứu Kinh Tế Châu Á",
    type: Array.isArray(article.type)
      ? article.type
      : article.type
      ? [article.type]
      : ["doanh-nghiep"],
    active: true,
  };
}

function getFileTarget(): string {
  const candidates = [
    path.join(process.cwd(), "data", "enterprises.json"),
    path.resolve("data", "enterprises.json"),
    "F:/project/haiduong-media/data/enterprises.json",
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return candidates[0];
}

export const loadCurrentEnterprises = getEnterprises;

export async function saveEnterprises(newArticles: any[], mode: "merge" | "overwrite" = "merge") {
  let finalArticles: any[] = [];
  let added = 0;
  let updated = 0;
  let skipped = 0;

  if (mode === "overwrite") {
    finalArticles = newArticles;
    added = newArticles.length;
  } else {
    const current = await getEnterprises();
    const map = new Map<string, any>();

    // Index existing articles by slug
    for (const a of current) {
      map.set(a.slug, a);
    }

    // Process new articles with hash comparison
    for (const a of newArticles) {
      const existing = map.get(a.slug);
      if (!existing) {
        map.set(a.slug, a);
        added++;
      } else {
        // Compare contentHash
        if (
          existing.contentHash &&
          a.contentHash &&
          existing.contentHash === a.contentHash
        ) {
          skipped++;
        } else {
          // Update existing with new data
          map.set(a.slug, { ...existing, ...a });
          updated++;
        }
      }
    }
    finalArticles = Array.from(map.values());
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
