import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dataDir = path.join(projectRoot, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export function cleanText(text) {
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

export function detectCategory(title, excerpt) {
  const t = (title + " " + (excerpt || "")).toLowerCase();
  if (t.includes("sao vàng thương hiệu") || t.includes("thương hiệu quốc gia") || t.includes("top 10") || t.includes("thương hiệu xuất sắc")) {
    return "Thương hiệu Quốc gia";
  }
  if (t.includes("phòng khám") || t.includes("dược") || t.includes("khám chữa bệnh") || t.includes("y tế") || t.includes("thẩm mỹ") || t.includes("sức khỏe") || t.includes("anvy") || t.includes("bệnh viện")) {
    return "Y tế & Chăm sóc sức khỏe";
  }
  if (t.includes("hồ sơ") || t.includes("tiếp nhận") || t.includes("đăng ký tham gia") || t.includes("v/v")) {
    return "Thông báo & Tiếp nhận hồ sơ";
  }
  if (t.includes("sản xuất") || t.includes("vật liệu") || t.includes("công nghệ") || t.includes("nhà máy") || t.includes("khí công nghiệp")) {
    return "Công nghệ & Sản xuất";
  }
  if (t.includes("hotel") || t.includes("travel") || t.includes("du lịch") || t.includes("khách sạn")) {
    return "Du lịch & Khách sạn";
  }
  return "Doanh nghiệp tiêu biểu";
}

export function toAbsoluteUrl(baseUrl, relativeUrl) {
  if (!relativeUrl) return "";
  if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://") || relativeUrl.startsWith("data:")) {
    return relativeUrl;
  }
  return `https://kinhtechaua.vn/${relativeUrl.replace(/^\//, "")}`;
}

export async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`Không thể tải trang ${url} (HTTP ${res.status})`);
  return await res.text();
}

export function extractDetailFromHtml(html) {
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

  // Remove empty h1 placeholder
  rawContent = rawContent.replace(/<h1 style="text-align:center">\s*(&nbsp;|\s)*<\/h1>/gi, "");

  return rawContent.trim();
}

export async function scanArticleDetail(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return "";
    const html = await res.text();
    return extractDetailFromHtml(html);
  } catch (err) {
    console.warn(`Error fetching detail from ${url}:`, err.message);
    return "";
  }
}

export function detectTypeFromUrl(url) {
  if (!url) return ["doanh-nghiep"];
  const u = url.toLowerCase();
  if (u.includes("doanh-nhan")) return ["doanh-nhan"];
  if (u.includes("tin-tuc")) return ["tin-tuc"];
  if (u.includes("san-pham")) return ["san-pham"];
  if (u.includes("su-kien")) return ["su-kien"];
  return ["doanh-nghiep"];
}

export function parseArticlesFromHtml(html, url = "") {
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

    const slug = relLink.replace(/^.*\/([^/]+)\.htm$/, "$1") ||
      title.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const category = detectCategory(title, excerpt);

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
      sourceUrl: detailUrl,
      author: "Viện Nghiên Cứu Kinh Tế Châu Á",
      active: true,
    });
  }

  return items;
}

export async function scanList(url) {
  const html = await fetchPage(url);
  return parseArticlesFromHtml(html, url);
}

export function enrichArticle(article, contentHtml) {
  const textOnly = (contentHtml || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = textOnly ? textOnly.split(" ").length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 220)) + " phút đọc";

  // Image count
  const imgMatches = (contentHtml || "").match(/<img[^>]+>/g) || [];
  const imageCount = imgMatches.length;

  return {
    ...article,
    content: contentHtml || article.content || "",
    wordCount,
    readTime,
    imageCount,
    category: article.category || detectCategory(article.title, article.excerpt),
    author: article.author || "Viện Nghiên Cứu Kinh Tế Châu Á",
    type: Array.isArray(article.type) && article.type.length > 0
      ? article.type
      : article.type && typeof article.type === "string"
      ? [article.type.trim()]
      : detectTypeFromUrl(article.sourceUrl || ""),
    active: true,
  };
}

export function loadCurrentEnterprises() {
  const outputPath = path.join(dataDir, "enterprises.json");
  if (!fs.existsSync(outputPath)) return [];
  try {
    const raw = fs.readFileSync(outputPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveEnterprises(newArticles, mode = "merge") {
  const outputPath = path.join(dataDir, "enterprises.json");
  let finalArticles = [];

  if (mode === "overwrite") {
    finalArticles = newArticles;
  } else {
    // merge by slug
    const current = loadCurrentEnterprises();
    const map = new Map();
    // first put existing
    for (const a of current) {
      map.set(a.slug, a);
    }
    // then overwrite or prepend with new
    for (const a of newArticles) {
      map.set(a.slug, a);
    }
    finalArticles = Array.from(map.values());
  }

  fs.writeFileSync(outputPath, JSON.stringify(finalArticles, null, 2), "utf-8");
  return finalArticles;
}

export async function crawlDoanhNghiep(urls) {
  const targetUrls = Array.isArray(urls) && urls.length > 0 ? urls : [
    "https://kinhtechaua.vn/thong-tin-doanh-nghiep/doanh-nghiep.htm",
  ];

  const allArticles = [];
  const seenSlugs = new Set();

  for (const url of targetUrls) {
    try {
      const articles = await scanList(url);
      for (const a of articles) {
        if (!seenSlugs.has(a.slug)) {
          seenSlugs.add(a.slug);
          allArticles.push(a);
        }
      }
    } catch (err) {
      console.error(`Error crawling ${url}:`, err.message);
    }
  }

  for (let i = 0; i < allArticles.length; i++) {
    const article = allArticles[i];
    const content = await scanArticleDetail(article.sourceUrl);
    allArticles[i] = enrichArticle(article, content);
    await new Promise((r) => setTimeout(r, 150));
  }

  saveEnterprises(allArticles, "merge");
  return allArticles;
}

// CLI usage
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const customUrl = process.argv[2];
  const list = customUrl ? [customUrl] : undefined;
  crawlDoanhNghiep(list).then(() => {
    console.log("Done!");
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
