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
