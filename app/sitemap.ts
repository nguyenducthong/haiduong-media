import type { MetadataRoute } from "next";
import { loadSiteContent } from "@/lib/site-content";
import { getEnterprises, getAllEvents } from "@/lib/enterprises";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://thuonghieuhangdauvn.com"
  ).replace(/\/$/, "");

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

    // 2. Các bài viết tin tức
    const newsRoutes: MetadataRoute.Sitemap = (content?.news || [])
      .filter((item) => item.active !== false && item.slug)
      .map((item) => ({
        url: `${baseUrl}/tin-tuc/${item.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    // 3. Các bài viết doanh nghiệp / thương hiệu
    const enterpriseRoutes: MetadataRoute.Sitemap = (enterprises || [])
      .filter((item) => item.active !== false && (item.slug || item.id))
      .map((item) => ({
        url: `${baseUrl}/doanh-nghiep/${item.slug || item.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    // 4. Các sự kiện
    const eventRoutes: MetadataRoute.Sitemap = (events || [])
      .filter((item) => item.active !== false && item.slug)
      .map((item) => ({
        url: `${baseUrl}/su-kien/${item.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...newsRoutes, ...enterpriseRoutes, ...eventRoutes];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return staticRoutes;
  }
}
