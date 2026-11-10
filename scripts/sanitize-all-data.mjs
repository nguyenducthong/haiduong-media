import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export function balanceHtmlTags(html) {
  if (!html) return "";
  let s = html;

  // 1. Loại bỏ các WordPress shortcodes
  s = s.replace(/\[\/?(?:ux_banner|row|col|gap|divider|title)[^\]]*\]/gi, "");

  // 2. Loại bỏ các thẻ layout cấu trúc trang
  s = s.replace(/<\/?(?:section|article|header|footer|main|nav|aside)\b[^>]*>/gi, "");

  // 3. Loại bỏ toàn bộ thẻ SVG và thẻ SVG mồ côi
  s = s.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "");
  s = s.replace(/<\/?svg\b[^>]*>/gi, "");

  // 4. Loại bỏ các thẻ div layout rác từ Flatsome WordPress
  s = s.replace(
    /<div\b[^>]*\b(?:col|col-inner|row|gap-element|banner-inner|banner-bg|bg-fill|banner-layers|fill|icon-box|icon-inner|icon|section-content|relative|is-divider|divider|text-center|clearfix)\b[^>]*>/gi,
    ""
  );

  // 5. Khắc phục lỗi Invalid HTML Tag Nesting
  for (let i = 0; i < 3; i++) {
    s = s.replace(/<p\b[^>]*>\s*(<(?:h[1-6]|ul|ol|li|div|p|table|blockquote)[^>]*>)/gi, "$1");
    s = s.replace(/(<\/(?:h[1-6]|ul|ol|li|div|p|table|blockquote)>)\s*<\/p>/gi, "$1");
  }

  // 6. Tokenizer & Stack-based Tag Balancer
  const tagRegex = /<\/?([a-z0-9]+)\b([^>]*)>/gi;
  const voidTags = new Set(["img", "br", "hr", "input", "meta", "link", "source", "track", "wbr", "area"]);
  const stack = [];
  let result = "";
  let lastIndex = 0;
  let match;

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
      }
    } else {
      stack.push(tagName);
      result += fullTag;
    }
  }
  result += s.slice(lastIndex);

  while (stack.length > 0) {
    const popped = stack.pop();
    result += `</${popped}>`;
  }

  result = result.replace(/<(?:p|h[1-6]|span)\b[^>]*>\s*(?:&nbsp;|\s)*<\/(?:p|h[1-6]|span)>/gi, "");

  return result;
}

console.log("=== BẮT ĐẦU LÀM SẠCH TOÀN BỘ DỮ LIỆU HTML BÀI VIẾT ===");

function sanitizeList(articles) {
  let modifiedCount = 0;
  const updated = articles.map(art => {
    if (!art.content) return art;
    const oldContent = art.content;
    const cleanContent = balanceHtmlTags(oldContent);
    if (cleanContent !== oldContent) {
      modifiedCount++;
      return { ...art, content: cleanContent };
    }
    return art;
  });
  return { updated, modifiedCount };
}

// 1. Clean data/enterprises.json
const jsonPath = "data/enterprises.json";
if (fs.existsSync(jsonPath)) {
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const { updated, modifiedCount } = sanitizeList(data);
  fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2), "utf8");
  console.log(`✅ Cleaned ${jsonPath}: modified ${modifiedCount} articles.`);
}

// 2. Clean facebook_services_export.json
const fbExportPath = "facebook_services_export.json";
if (fs.existsSync(fbExportPath)) {
  const data = JSON.parse(fs.readFileSync(fbExportPath, "utf8"));
  const { updated, modifiedCount } = sanitizeList(data);
  fs.writeFileSync(fbExportPath, JSON.stringify(updated, null, 2), "utf8");
  console.log(`✅ Cleaned ${fbExportPath}: modified ${modifiedCount} articles.`);
}

// 3. Clean local D1 SQLite databases
const d1Dir = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject";
if (fs.existsSync(d1Dir)) {
  const files = fs.readdirSync(d1Dir).filter(f => f.endsWith(".sqlite") && f !== "metadata.sqlite");
  for (const file of files) {
    const fullPath = path.join(d1Dir, file);
    try {
      const db = new DatabaseSync(fullPath);
      const row = db.prepare("SELECT data, updated_by, updated_at FROM site_content WHERE key = 'enterprises'").get();
      if (row && row.data) {
        const list = JSON.parse(row.data);
        const { updated, modifiedCount } = sanitizeList(list);
        if (modifiedCount > 0) {
          const newData = JSON.stringify(updated);
          db.prepare("UPDATE site_content SET data = ?, updated_at = ? WHERE key = 'enterprises'").run(newData, Date.now());
          console.log(`✅ Cleaned local D1 SQLite (${file}): updated ${modifiedCount} articles.`);
        } else {
          console.log(`ℹ️ Local D1 SQLite (${file}) already clean.`);
        }
      }
    } catch (e) {
      console.warn(`Could not process ${file}:`, e.message);
    }
  }
}

// 4. Clean lib/default-facebook-articles.ts
const defaultFbPath = "lib/default-facebook-articles.ts";
if (fs.existsSync(defaultFbPath)) {
  let content = fs.readFileSync(defaultFbPath, "utf8");
  const match = content.match(/export const DEFAULT_FACEBOOK_ARTICLES: EnterpriseArticle\[\] = (\[[\s\S]*\]);\s*$/);
  if (match) {
    const list = JSON.parse(match[1]);
    const { updated, modifiedCount } = sanitizeList(list);
    const newContent = `import type { EnterpriseArticle } from "./enterprises-types";\n\nexport const DEFAULT_FACEBOOK_ARTICLES: EnterpriseArticle[] = ${JSON.stringify(updated, null, 2)};\n`;
    fs.writeFileSync(defaultFbPath, newContent, "utf8");
    console.log(`✅ Cleaned ${defaultFbPath}: modified ${modifiedCount} articles.`);
  }
}

// 5. Clean lib/enterprises.ts
const enterprisesTsPath = "lib/enterprises.ts";
if (fs.existsSync(enterprisesTsPath)) {
  let content = fs.readFileSync(enterprisesTsPath, "utf8");
  const match = content.match(/(const FALLBACK_ENTERPRISES: EnterpriseArticle\[\] = )(\[[\s\S]*?\]);/);
  if (match) {
    try {
      const list = JSON.parse(match[2]);
      const { updated, modifiedCount } = sanitizeList(list);
      const newContent = content.replace(match[0], `${match[1]}${JSON.stringify(updated, null, 2)};`);
      fs.writeFileSync(enterprisesTsPath, newContent, "utf8");
      console.log(`✅ Cleaned ${enterprisesTsPath}: modified ${modifiedCount} articles.`);
    } catch {}
  }
}

console.log("=== HOÀN TẤT LÀM SẠCH DỮ LIỆU ===");
