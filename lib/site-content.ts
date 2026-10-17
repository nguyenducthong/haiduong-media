import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";

export type ServiceItem = { title: string; description: string };
export type NewsItem = { category: string; title: string; excerpt: string };

export type SiteContent = {
  brandName: string; brandKicker: string; heroEyebrow: string; heroTitle: string;
  heroDescription: string; primaryCta: string; secondaryCta: string;
  aboutTitle: string; aboutBody: string; trustTitle: string; trustBody: string;
  services: ServiceItem[]; news: NewsItem[]; hotline: string; hotlineHref: string;
  email: string; address: string; zaloUrl: string; facebookUrl: string;
  mapUrl: string; footerNote: string;
};

export const defaultSiteContent: SiteContent = {
  brandName: "HẢI DƯƠNG MEDIA",
  brandKicker: "Truyền thông và phát triển thương hiệu",
  heroEyebrow: "Đồng hành cùng doanh nghiệp trong kỷ nguyên số",
  heroTitle: "Giải pháp truyền thông giúp thương hiệu được nhìn thấy và ghi nhớ",
  heroDescription: "Từ chiến lược thương hiệu, nội dung, quảng cáo đến sản xuất hình ảnh và sự kiện. Mọi dịch vụ được triển khai trên một quy trình rõ ràng, dễ theo dõi.",
  primaryCta: "Nhận tư vấn", secondaryCta: "Khám phá dịch vụ",
  aboutTitle: "Một đối tác cho toàn bộ hành trình truyền thông",
  aboutBody: "Chúng tôi kết nối chiến lược, nội dung và thiết kế để doanh nghiệp truyền tải đúng thông điệp trên từng điểm chạm. Website này đang sử dụng nội dung mẫu và có thể cập nhật trực tiếp tại trang quản trị.",
  trustTitle: "Tập trung vào kết quả có thể theo dõi",
  trustBody: "Mỗi dự án bắt đầu bằng mục tiêu cụ thể, kế hoạch triển khai và các chỉ số cần đo lường. Doanh nghiệp luôn biết công việc đang ở đâu và bước tiếp theo là gì.",
  services: [
    { title: "Booking quảng cáo", description: "Lập kế hoạch và triển khai quảng cáo báo chí, truyền hình, radio và nền tảng số." },
    { title: "Sản xuất video", description: "Phim doanh nghiệp, TVC, video mạng xã hội và nội dung ghi hình sự kiện." },
    { title: "Tổ chức sự kiện", description: "Xây dựng ý tưởng, kế hoạch truyền thông và vận hành chương trình theo mục tiêu." },
    { title: "Tư vấn truyền thông", description: "Chiến lược thương hiệu doanh nghiệp, thương hiệu cá nhân và xử lý khủng hoảng." },
    { title: "Thiết kế thương hiệu", description: "Logo, bộ nhận diện, hồ sơ năng lực, ấn phẩm và website doanh nghiệp." },
    { title: "Sản xuất nội dung", description: "Bài PR, nội dung website, fanpage và kế hoạch nội dung đa kênh." },
  ],
  news: [
    { category: "Kiến thức", title: "Xây dựng thương hiệu nhất quán trên nhiều kênh", excerpt: "Những nguyên tắc giúp doanh nghiệp giữ đúng thông điệp từ website đến mạng xã hội." },
    { category: "Góc nhìn", title: "Website doanh nghiệp cần chuẩn bị gì trước khi chạy quảng cáo", excerpt: "Một checklist ngắn để tránh lãng phí ngân sách và tăng tỷ lệ khách hàng liên hệ." },
    { category: "Kinh nghiệm", title: "Cách biến một dịch vụ phức tạp thành nội dung dễ hiểu", excerpt: "Bắt đầu từ vấn đề của khách hàng, sau đó trình bày giải pháp bằng ngôn ngữ cụ thể." },
  ],
  hotline: "0900 000 000", hotlineHref: "+84900000000", email: "hello@example.com",
  address: "Cập nhật địa chỉ doanh nghiệp trong trang quản trị",
  zaloUrl: "https://zalo.me/84900000000", facebookUrl: "https://facebook.com",
  mapUrl: "https://maps.google.com", footerNote: "Nội dung hiện tại là bản mẫu và có thể chỉnh sửa trong trang quản trị.",
};

export async function loadSiteContent(): Promise<SiteContent> {
  try {
    const [row] = await getDb().select().from(siteContent).where(eq(siteContent.key, "main")).limit(1);
    return row ? normalizeContent(JSON.parse(row.data)) : defaultSiteContent;
  } catch { return defaultSiteContent; }
}

export async function saveSiteContent(content: SiteContent, updatedBy: string): Promise<SiteContent> {
  const normalized = normalizeContent(content);
  const values = { key: "main", data: JSON.stringify(normalized), updatedBy, updatedAt: new Date() };
  await getDb().insert(siteContent).values(values).onConflictDoUpdate({ target: siteContent.key, set: values });
  return normalized;
}

function normalizeContent(value: Partial<SiteContent>): SiteContent {
  const read = (key: keyof SiteContent) => {
    const candidate = value[key];
    return typeof candidate === "string" && candidate.trim() ? candidate.trim() : defaultSiteContent[key] as string;
  };
  const services = Array.isArray(value.services) ? value.services.slice(0, 6).map((item, index) => ({
    title: item?.title?.trim() || defaultSiteContent.services[index]?.title || "Dịch vụ",
    description: item?.description?.trim() || defaultSiteContent.services[index]?.description || "Nội dung đang được cập nhật.",
  })) : defaultSiteContent.services;
  const news = Array.isArray(value.news) ? value.news.slice(0, 3).map((item, index) => ({
    category: item?.category?.trim() || defaultSiteContent.news[index]?.category || "Tin tức",
    title: item?.title?.trim() || defaultSiteContent.news[index]?.title || "Bài viết mới",
    excerpt: item?.excerpt?.trim() || defaultSiteContent.news[index]?.excerpt || "Nội dung đang được cập nhật.",
  })) : defaultSiteContent.news;
  return {
    brandName: read("brandName"), brandKicker: read("brandKicker"), heroEyebrow: read("heroEyebrow"),
    heroTitle: read("heroTitle"), heroDescription: read("heroDescription"), primaryCta: read("primaryCta"),
    secondaryCta: read("secondaryCta"), aboutTitle: read("aboutTitle"), aboutBody: read("aboutBody"),
    trustTitle: read("trustTitle"), trustBody: read("trustBody"), services: services.length ? services : defaultSiteContent.services,
    news: news.length ? news : defaultSiteContent.news, hotline: read("hotline"), hotlineHref: read("hotlineHref"),
    email: read("email"), address: read("address"), zaloUrl: read("zaloUrl"), facebookUrl: read("facebookUrl"),
    mapUrl: read("mapUrl"), footerNote: read("footerNote"),
  };
}
