import fs from "node:fs";
import path from "node:path";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";

export type { EnterpriseArticle } from "./enterprises-types";
export { getArticleTypes, balanceHtmlTags } from "./enterprises-types";
import { getArticleTypes, balanceHtmlTags, type EnterpriseArticle } from "./enterprises-types";

// Fallback in case file isn't created yet or reading in edge worker
export const fallbackEnterprises: EnterpriseArticle[] = [
  {
    id: "cong-nghe-va-nang-luc-san-xuat-phia-sau-dau-an-top-10-sao-vang-thuong-hieu-quoc-gia-cua-anvy",
    slug: "cong-nghe-va-nang-luc-san-xuat-phia-sau-dau-an-top-10-sao-vang-thuong-hieu-quoc-gia-cua-anvy",
    title: "Công nghệ và năng lực sản xuất phía sau dấu ấn TOP 10 Sao Vàng Thương hiệu Quốc gia của ANVY",
    category: "Thương hiệu Quốc gia",
    excerpt: "ANVY được xướng tên trong TOP 10 Sao Vàng Thương hiệu Quốc gia 2026, thuộc khuôn khổ chương trình “Sao Vàng Thương hiệu Quốc gia 2026 - Lần thứ XII”.",
    image: "/uploads/articles/b64_c662df6b8326be10.jpg",
    date: "03/10/2026",
    views: "193",
    sourceUrl: "/doanh-nghiep/cong-nghe-va-nang-luc-san-xuat-phia-sau-dau-an-top-10-sao-vang-thuong-hieu-quoc-gia-cua-anvy",
    active: true,
  },
  {
    id: "hobi-viet-nam-khang-dinh-dau-an-thuong-hieu-trong-linh-vuc-vat-lieu-san-viet",
    slug: "hobi-viet-nam-khang-dinh-dau-an-thuong-hieu-trong-linh-vuc-vat-lieu-san-viet",
    title: "Hobi Việt Nam: Khẳng định dấu ấn thương hiệu trong lĩnh vực vật liệu sàn Việt",
    category: "Công nghệ & Sản xuất",
    excerpt: "Công ty Cổ phần Hobi Việt Nam được vinh danh tại chương trình “Sao Vàng Thương Hiệu Quốc Gia 2026 – Gold Star National Brand 2026”.",
    image: "/uploads/articles/b64_55509e8f22771b94.png",
    date: "03/10/2026",
    views: "325",
    sourceUrl: "/doanh-nghiep/hobi-viet-nam-khang-dinh-dau-an-thuong-hieu-trong-linh-vuc-vat-lieu-san-viet",
    active: true,
  },
  {
    id: "phong-kham-da-khoa-an-nhien-duoc-vinh-danh-top-10-phong-kham-da-khoa-uy-tin-chat-luong-quoc-gia",
    slug: "phong-kham-da-khoa-an-nhien-duoc-vinh-danh-top-10-phong-kham-da-khoa-uy-tin-chat-luong-quoc-gia",
    title: "PHÒNG KHÁM ĐA KHOA AN NHIÊN ĐƯỢC VINH DANH “TOP 10 PHÒNG KHÁM ĐA KHOA UY TÍN CHẤT LƯỢNG QUỐC GIA”",
    category: "Y tế & Chăm sóc sức khỏe",
    excerpt: "Phòng khám Đa khoa An Nhiên vinh dự được xướng tên trong danh sách “Top 10 Phòng khám Đa khoa Uy tín Chất lượng Quốc gia” tại Lễ trao giải Sao Vàng Thương Hiệu Quốc Gia 2026.",
    image: "/uploads/articles/b64_ae6d99404ce1f3ee.png",
    date: "03/10/2026",
    views: "1.582",
    sourceUrl: "/doanh-nghiep/phong-kham-da-khoa-an-nhien-duoc-vinh-danh-top-10-phong-kham-da-khoa-uy-tin-chat-luong-quoc-gia",
    active: true,
  },
  {
    id: "pure-aesthetics-clinic-kien-tao-trai-nghiem-lam-dep-hien-dai-tu-su-chin-chu-trong-tung-chi-tiet",
    slug: "pure-aesthetics-clinic-kien-tao-trai-nghiem-lam-dep-hien-dai-tu-su-chin-chu-trong-tung-chi-tiet",
    title: "PURE AESTHETICS CLINIC – KIẾN TẠO TRẢI NGHIỆM LÀM ĐẸP HIỆN ĐẠI TỪ SỰ CHỈN CHU TRONG TỪNG CHI TIẾT",
    category: "Y tế & Chăm sóc sức khỏe",
    excerpt: "Trong những năm gần đây, thị trường thẩm mỹ Việt Nam có sự chuyển dịch rõ rệt khi khách hàng ngày càng chủ động tìm hiểu về công nghệ, phương pháp điều trị và chất lượng dịch vụ.",
    image: "/uploads/articles/b64_a0cc7347204f6bd8.png",
    date: "03/10/2026",
    views: "1.555",
    sourceUrl: "/doanh-nghiep/pure-aesthetics-clinic-kien-tao-trai-nghiem-lam-dep-hien-dai-tu-su-chin-chu-trong-tung-chi-tiet",
    active: true,
  },
  {
    id: "kingsport-duoc-vinh-danh-voi-hang-muc-thuong-hieu-kien-tao-he-sinh-thai-cham-soc-suc-khoe-chu-dong-xuat-sac-viet-nam",
    slug: "kingsport-duoc-vinh-danh-voi-hang-muc-thuong-hieu-kien-tao-he-sinh-thai-cham-soc-suc-khoe-chu-dong-xuat-sac-viet-nam",
    title: "Kingsport được vinh danh với hạng mục “Thương hiệu Kiến tạo hệ sinh thái chăm sóc sức khỏe chủ động xuất sắc Việt Nam”",
    category: "Y tế & Chăm sóc sức khỏe",
    excerpt: "Kingsport được vinh danh tại chương trình VIETNAM EXCELLENCE BRAND 2026 với hạng mục “Thương hiệu Kiến tạo hệ sinh thái chăm sóc sức khỏe chủ động xuất sắc Việt Nam”.",
    image: "/uploads/articles/b64_3fc4cfd6e44396c7.png",
    date: "29/09/2026",
    views: "230",
    sourceUrl: "/doanh-nghiep/kingsport-duoc-vinh-danh-voi-hang-muc-thuong-hieu-kien-tao-he-sinh-thai-cham-soc-suc-khoe-chu-dong-xuat-sac-viet-nam",
    active: true,
  },
];

let tableEnsured = false;
async function ensureDbTable() {
  if (tableEnsured) return;
  try {
    const db = getDb();
    await db.run(sql`CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_by TEXT,
      updated_at INTEGER NOT NULL
    )`);
    tableEnsured = true;
  } catch {}
}

export async function getEnterprises(): Promise<EnterpriseArticle[]> {
  // 1. Try reading from Cloudflare D1 database
  try {
    await ensureDbTable();
    const db = getDb();
    const [row] = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, "enterprises"))
      .limit(1);

    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      if (Array.isArray(parsed)) {
        return sortArticlesByDateDescending(parsed);
      }
    }
  } catch (err: any) {
    // D1 not initialized or running outside worker
  }

  // 2. Try reading from local data/enterprises.json file
  try {
    const candidates = [
      path.join(process.cwd(), "data", "enterprises.json"),
      path.resolve("data", "enterprises.json"),
      "F:/project/haiduong-media/data/enterprises.json",
    ];
    for (const dataFilePath of candidates) {
      if (fs.existsSync(dataFilePath)) {
        const raw = fs.readFileSync(dataFilePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return sortArticlesByDateDescending(parsed);
        }
      }
    }
  } catch (err) {
    console.warn("Error reading local data file:", err);
  }
  return [];
}

export async function saveEnterprisesToDb(articles: EnterpriseArticle[]): Promise<void> {
  // 1. Save to Cloudflare D1 database (persists in Cloudflare Workers)
  try {
    await ensureDbTable();
    const db = getDb();
    const values = {
      key: "enterprises",
      data: JSON.stringify(articles),
      updatedBy: "admin",
      updatedAt: new Date(),
    };
    await db
      .insert(siteContent)
      .values(values)
      .onConflictDoUpdate({
        target: siteContent.key,
        set: values,
      });
  } catch (err: any) {
    console.warn("Error saving enterprises to D1:", err?.message);
  }

  // 2. Also try writing to local file on disk if filesystem is writable
  try {
    const candidates = [
      path.join(process.cwd(), "data", "enterprises.json"),
      path.resolve("data", "enterprises.json"),
      "f:/project/haiduong-media/data/enterprises.json",
    ];
    for (const p of candidates) {
      try {
        fs.writeFileSync(p, JSON.stringify(articles, null, 2), "utf-8");
        break;
      } catch (e: any) {
        console.warn("fs.writeFileSync failed on", p, e?.message);
      }
    }
  } catch (e: any) {
    console.warn("File sync block error:", e?.message);
  }
}

// Helper to parse date strings like "03/10/2026", "2026-10-03", "03.10.2026"
export function parseArticleDate(dateStr?: string): number {
  if (!dateStr || typeof dateStr !== "string") return 0;
  const s = dateStr.trim();
  // Check DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY
  const dmyMatch = s.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    return new Date(year, month, day).getTime();
  }
  const parsed = Date.parse(s);
  return isNaN(parsed) ? 0 : parsed;
}

export function sortArticlesByDateDescending(articles: EnterpriseArticle[]): EnterpriseArticle[] {
  return [...articles].sort((a, b) => {
    const timeB = parseArticleDate(b.date);
    const timeA = parseArticleDate(a.date);
    if (timeB !== timeA) {
      return timeB - timeA; // Descending (newest first)
    }
    return (b.id || "").localeCompare(a.id || "");
  });
}

export async function getEnterprisesByType(type: string): Promise<EnterpriseArticle[]> {
  const all = await getEnterprises();
  const filtered = all.filter((a) => {
    const types = getArticleTypes(a);
    if (types.includes(type)) return true;
    if (type === "su-kien" && (a.category === "Sự kiện & Diễn đàn" || a.category === "Sự kiện")) {
      return true;
    }
    return false;
  });
  return sortArticlesByDateDescending(filtered);
}

export async function getEnterpriseBySlug(slug: string): Promise<EnterpriseArticle | null> {
  const all = await getEnterprises();
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();
  return (
    all.find(
      (a) =>
        a.slug.toLowerCase() === normalizedSlug ||
        a.id.toLowerCase() === normalizedSlug
    ) || null
  );
}

export function parseViewCount(val?: string | number): number {
  if (val === undefined || val === null || val === "") return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[\.,\s]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

export function formatViewCount(num: number): string {
  return num.toLocaleString("vi-VN");
}

export async function incrementArticleViews(slug: string): Promise<string> {
  const all = await getEnterprises();
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  const item = all.find(
    (a) =>
      a.slug.toLowerCase() === normalized ||
      (a.id && a.id.toLowerCase() === normalized)
  );
  if (!item) return "1";

  const currentCount = parseViewCount(item.views);
  const nextCount = currentCount + 1;
  const formatted = formatViewCount(nextCount);
  item.views = formatted;

  // Persist updated list to D1 and enterprises.json
  await saveEnterprisesToDb(all);
  return formatted;
}

export function articleToEventItem(article: EnterpriseArticle): any {
  return {
    id: article.id || article.slug,
    slug: article.slug,
    title: article.title,
    date: article.date || "2026",
    time: "Theo lịch trình",
    location: "Việt Nam & Quốc Tế",
    tag: article.category || "Sự kiện",
    image: article.image || "/images/events/event-korea.png",
    summary: article.excerpt || "",
    description: article.content || article.excerpt || "",
    agenda: [],
    benefits: [],
    contactPerson: "Hotline Ban Tổ Chức: 090 377 2086",
    active: article.active !== false,
  };
}

export async function getAllEvents(): Promise<any[]> {
  const { loadSiteContent } = await import("./site-content");
  const [content, dbEvents] = await Promise.all([
    loadSiteContent(),
    getEnterprisesByType("su-kien"),
  ]);

  const dbEventItems = dbEvents.filter((a) => a.active !== false).map(articleToEventItem);
  const slugSet = new Set(dbEventItems.map((e) => e.slug));
  const staticEvents = (content.upcomingEvents || []).filter(
    (e) => e.active !== false && !slugSet.has(e.slug)
  );

  return [...dbEventItems, ...staticEvents];
}

export async function getUnifiedEventBySlug(slug: string): Promise<any | null> {
  const { loadSiteContent } = await import("./site-content");
  const content = await loadSiteContent();
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();

  const staticEvent = (content.upcomingEvents || []).find(
    (e) => e.slug.toLowerCase() === normalizedSlug
  );
  if (staticEvent) return staticEvent;

  const dbArticle = await getEnterpriseBySlug(slug);
  if (dbArticle) {
    return articleToEventItem(dbArticle);
  }

  return null;
}

export const getAllArticles = getEnterprises;
export const getArticlesByType = getEnterprisesByType;
export const getArticleBySlug = getEnterpriseBySlug;

