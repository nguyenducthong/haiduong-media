export type EnterpriseArticle = {
  id: string;
  slug: string;
  title: string;
  type?: string[] | string;
  category: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  views?: string;
  sourceUrl?: string;
  active?: boolean;
  author?: string;
  wordCount?: number;
  readTime?: string;
  imageCount?: number;
  urlHash?: string;
  titleHash?: string;
  contentHash?: string;
  hash?: string;
  // Event-specific fields
  location?: string;
  time?: string;
  contactPerson?: string;
  organizer?: string;
  partner?: string;
  coOrganizer?: string;
  agenda?: string[] | string;
  benefits?: string[] | string;
};

export function getArticleTypes(article: any): string[] {
  if (!article) return ["doanh-nghiep"];
  if (Array.isArray(article.type)) return article.type;
  if (Array.isArray(article.types)) return article.types;
  if (typeof article.type === "string" && article.type.trim()) return [article.type.trim()];
  return ["doanh-nghiep"];
}

export function balanceHtmlTags(html: string): string {
  if (!html) return "";
  let balanced = html;

  // 1. Strip bỏ các class / thẻ layout Flatsome WordPress rác gây lồng thẻ / position absolute
  balanced = balanced.replace(/<div\b[^>]*\b(col|col-inner|row|gap-element|banner-inner|banner-bg|bg-fill|banner-layers|fill|icon-box|icon-inner|icon)\b[^>]*>/gi, "");
  balanced = balanced.replace(/<\/svg>/gi, "");
  balanced = balanced.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "");

  // 2. Cân bằng thẻ
  const tagsToCheck = ["div", "p", "span", "em", "strong", "b", "i", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6"];
  for (const tag of tagsToCheck) {
    const openRegex = new RegExp(`<${tag}\\b[^>]*>`, "gi");
    const closeRegex = new RegExp(`</${tag}>`, "gi");
    const openCount = (balanced.match(openRegex) || []).length;
    const closeCount = (balanced.match(closeRegex) || []).length;
    if (openCount > closeCount) {
      balanced += `</${tag}>`.repeat(openCount - closeCount);
    }
  }
  return balanced;
}

export function getArticleViewUrl(art?: EnterpriseArticle | Partial<EnterpriseArticle> | null): string {
  if (!art || !art.slug) return "#";
  const types = getArticleTypes(art);
  if (types.includes("su-kien")) return `/su-kien/${art.slug}`;
  if (types.includes("tin-tuc")) return `/tin-tuc/${art.slug}`;
  if (types.includes("dich-vu-facebook")) return `/dich-vu-facebook/${art.slug}`;
  return `/doanh-nghiep/${art.slug}`;
}

