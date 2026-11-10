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
  let s = html;

  // 1. Loại bỏ các WordPress shortcodes: [ux_banner], [row], [col], [gap], [divider], etc.
  s = s.replace(/\[\/?(?:ux_banner|row|col|gap|divider|title)[^\]]*\]/gi, "");

  // 2. Loại bỏ các thẻ layout cấu trúc trang (structural tags) tránh phá hủy cây DOM của layout Next.js
  s = s.replace(/<\/?(?:section|article|header|footer|main|nav|aside)\b[^>]*>/gi, "");

  // 3. Loại bỏ toàn bộ thẻ SVG và thẻ SVG mồ côi
  s = s.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "");
  s = s.replace(/<\/?svg\b[^>]*>/gi, "");

  // 4. Loại bỏ các thẻ div layout rác từ Flatsome WordPress (chứa các class layout cố định / relative gây đè chữ)
  s = s.replace(
    /<div\b[^>]*\b(?:col|col-inner|row|gap-element|banner-inner|banner-bg|bg-fill|banner-layers|fill|icon-box|icon-inner|icon|section-content|relative|is-divider|divider|text-center|clearfix)\b[^>]*>/gi,
    ""
  );

  // 5. Khắc phục lỗi Invalid HTML Tag Nesting: thẻ <p> không được bao bọc các thẻ block
  for (let i = 0; i < 3; i++) {
    s = s.replace(/<p\b[^>]*>\s*(<(?:h[1-6]|ul|ol|li|div|p|table|blockquote)[^>]*>)/gi, "$1");
    s = s.replace(/(<\/(?:h[1-6]|ul|ol|li|div|p|table|blockquote)>)\s*<\/p>/gi, "$1");
  }

  // 6. Tokenizer & Stack-based Tag Balancer:
  // - BỎ HẲN các thẻ đóng thừa (excess closing tags) để KHÔNG BAO GIỜ đóng nhầm các thẻ cha của trang web
  // - Tự động bổ sung các thẻ đóng còn thiếu ở cuối chuỗi
  const tagRegex = /<\/?([a-z0-9]+)\b([^>]*)>/gi;
  const voidTags = new Set(["img", "br", "hr", "input", "meta", "link", "source", "track", "wbr", "area"]);
  const stack: string[] = [];
  let result = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(s)) !== null) {
    result += s.slice(lastIndex, match.index);
    lastIndex = tagRegex.lastIndex;

    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = fullTag.startsWith("</");
    const isSelfClosing = fullTag.endsWith("/>") || voidTags.has(tagName);

    if (isSelfClosing) {
      result += fullTag;
    } else if (isClosing) {
      const openIdx = stack.lastIndexOf(tagName);
      if (openIdx !== -1) {
        while (stack.length > openIdx) {
          const popped = stack.pop();
          result += `</${popped}>`;
        }
      } else {
        // Thẻ đóng thừa mồ côi (ví dụ </div> dư của WordPress) -> BỎ ĐI, không được đưa vào DOM
      }
    } else {
      stack.push(tagName);
      result += fullTag;
    }
  }
  result += s.slice(lastIndex);

  // Đóng tất cả các thẻ mở còn thiếu theo thứ tự LIFO
  while (stack.length > 0) {
    const popped = stack.pop();
    result += `</${popped}>`;
  }

  // 7. Dọn dẹp các thẻ rỗng vô nghĩa
  result = result.replace(/<(?:p|h[1-6]|span)\b[^>]*>\s*(?:&nbsp;|\s)*<\/(?:p|h[1-6]|span)>/gi, "");

  return result;
}

export function getArticleViewUrl(art?: EnterpriseArticle | Partial<EnterpriseArticle> | null): string {
  if (!art || !art.slug) return "#";
  const types = getArticleTypes(art);
  if (types.includes("su-kien")) return `/su-kien/${art.slug}`;
  if (types.includes("tin-tuc")) return `/tin-tuc/${art.slug}`;
  if (types.includes("dich-vu-facebook")) return `/dich-vu-facebook/${art.slug}`;
  return `/doanh-nghiep/${art.slug}`;
}

