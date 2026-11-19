import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { loadSiteContent } from "@/lib/site-content";
import { getEnterprises, getAllEvents } from "@/lib/enterprises";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl.origin;

  const now = new Date();

  // 1. Các trang tĩnh chính
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dich-vu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/doanh-nghiep`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/doanh-nhan`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/su-kien`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const [content, enterprises, events] = await Promise.all([
      loadSiteContent().catch(() => null),
      getEnterprises().catch(() => []),
      getAllEvents().catch(() => []),
    ]);

    // 2. Các bài viết tin tức (chuẩn hóa đúng chuyên mục /tin-tuc/)
    // 2. Các bài viết tin tức / hoạt động (chuẩn hóa đúng chuyên mục /tin-tuc/)
    const newsSlugs = new Set();
    const allNewsItems = [
      ...(content?.news || []),
      ...(enterprises || []).filter((item) => item.type === "tin-tuc"),
      ...(enterprises || []).filter((item) => {
        const t = Array.isArray(item.type) ? item.type : [item.type];
        return t.includes("tin-tuc");
      }),
    ];
    const newsRoutes: MetadataRoute.Sitemap = allNewsItems
      .filter((item) => {
        if (!item || item.active === false || !item.slug) return false;
        if (newsSlugs.has(item.slug)) return false;
        newsSlugs.add(item.slug);
        return true;
      })
      .map((item) => ({
        url: `${baseUrl}/tin-tuc/${item.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    // 3. Các bài viết sự kiện (chuẩn hóa đúng chuyên mục /su-kien/)
    const eventSlugs = new Set();
    const allEventItems = [
      ...(events || []),
      ...(enterprises || []).filter((item) => item.type === "su-kien"),
      ...(enterprises || []).filter((item) => {
        const t = Array.isArray(item.type) ? item.type : [item.type];
        return t.includes("su-kien");
      }),
    ];
    const eventRoutes: MetadataRoute.Sitemap = allEventItems
      .filter((item) => {
        if (!item || item.active === false || !item.slug) return false;
        if (eventSlugs.has(item.slug)) return false;
        eventSlugs.add(item.slug);
        return true;
      })
      .map((item) => ({
        url: `${baseUrl}/su-kien/${item.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    // 4. Các bài viết doanh nghiệp / thương hiệu (chỉ lấy bài doanh nghiệp, loại trừ tin-tuc và su-kien để tránh trùng lặp tuyệt đối)
    // 4. Các dịch vụ Facebook chuyên sâu (/dich-vu-facebook/:slug)
    const fbSlugs = new Set();
    const fbRoutes: MetadataRoute.Sitemap = (enterprises || [])
      .filter((item) => {
        if (!item || item.active === false || !item.slug) return false;
        const t = Array.isArray(item.type) ? item.type : [item.type];
        const cat = (item.category || "").toLowerCase();
        return (
          t.includes("dich-vu-facebook") ||
          cat.includes("facebook") ||
          cat.includes("dịch vụ facebook")
        );
      })
      .filter((item) => {
        if (fbSlugs.has(item.slug)) return false;
        fbSlugs.add(item.slug);
        return true;
      })
      .map((item) => ({
        url: `${baseUrl}/dich-vu-facebook/${item.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    // 5. Các bài viết doanh nghiệp / thương hiệu (/doanh-nghiep/:slug)
    const processedOtherSlugs = new Set([...newsSlugs, ...eventSlugs, ...fbSlugs]);
    const enterpriseRoutes: MetadataRoute.Sitemap = (enterprises || [])
      .filter(
        (item) =>
          item.active !== false &&
          (item.slug || item.id) &&
          item.type !== "su-kien" &&
          item.type !== "tin-tuc"
      )
      .filter((item) => {
        if (!item || item.active === false) return false;
        const s = item.slug || item.id;
        if (!s || processedOtherSlugs.has(s)) return false;
        processedOtherSlugs.add(s);
        return true;
      })
      .map((item) => ({
        url: `${baseUrl}/doanh-nghiep/${item.slug || item.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...newsRoutes, ...enterpriseRoutes, ...eventRoutes];
    return [...staticRoutes, ...newsRoutes, ...enterpriseRoutes, ...eventRoutes, ...fbRoutes];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return staticRoutes;
  }
}
