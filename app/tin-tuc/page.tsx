import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { getEnterprisesByType, sortArticlesByDateDescending } from "@/lib/enterprises";
import { EnterpriseList } from "@/components/enterprise-list";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await loadSiteContent();
  return {
    alternates: { canonical: "/tin-tuc" },
    title: content.newsPageTitle || "Hoạt Động & Sự Kiện Nổi Bật",
    description:
      content.newsPageDescription ||
      "Cập nhật hoạt động doanh nghiệp, sự kiện nổi bật và cẩm nang truyền thông mới nhất từ THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn).",
  };
}

export default async function NewsPage() {
  const content = await loadSiteContent();
  const dbNews = await getEnterprisesByType("tin-tuc");
  const rawNews = dbNews.length > 0 
    ? dbNews.filter((item) => item.active !== false)
    : (content.news || []).filter((item) => item.active !== false);
  const visibleNews = sortArticlesByDateDescending(rawNews);

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow={content.newsPageEyebrow || "HOẠT ĐỘNG & SỰ KIỆN"}
          title={content.newsPageTitle || "Hoạt Động & Sự Kiện Nổi Bật"}
          description={content.newsPageDescription || "Nội dung chuyên sâu, cập nhật hoạt động mới nhất cùng kiến thức thực chiến dành cho doanh nghiệp trong kỷ nguyên số."}
        />

        <section className="section" style={{ paddingTop: "40px", paddingBottom: "90px" }}>
          <div className="site-container">
            <EnterpriseList
              initialArticles={visibleNews}
              basePath="/tin-tuc"
              title={content.newsPageListTitle || "Danh sách hoạt động & sự kiện"}
              searchPlaceholder="Tìm kiếm hoạt động, sự kiện, thông báo..."
              pageSize={9}
            />
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
