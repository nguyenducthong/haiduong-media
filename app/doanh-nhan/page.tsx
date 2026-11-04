import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { getEnterprisesByType } from "@/lib/enterprises";
import { EnterpriseList } from "@/components/enterprise-list";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await loadSiteContent();
  return {
    alternates: { canonical: "/doanh-nhan" },
    title: content.entrepreneursPageTitle || "Gương Mặt Doanh Nhân & Lãnh Đạo Tiêu Biểu",
    description:
      content.entrepreneursPageDescription ||
      "Chân dung các nhà lãnh đạo tiên phong, câu chuyện khởi nghiệp truyền cảm hứng đồng hành cùng THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn).",
  };
}

export default async function DoanhNhanPage() {
  const content = await loadSiteContent();
  const articles = await getEnterprisesByType("doanh-nhan");
  const visibleArticles = articles.filter((item) => item.active !== false);

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow={content.entrepreneursPageEyebrow || "CHUYÊN ĐỀ DOANH NHÂN"}
          title={content.entrepreneursPageTitle || "Gương Mặt Doanh Nhân & Lãnh Đạo Tiêu Biểu"}
          description={content.entrepreneursPageDescription || "Chân dung các nhà lãnh đạo tiên phong, câu chuyện khởi nghiệp truyền cảm hứng và hành trình phát triển doanh nghiệp."}
        />

        <section className="section" style={{ paddingTop: "40px", paddingBottom: "90px" }}>
          <div className="site-container">
            <EnterpriseList
              initialArticles={visibleArticles}
              basePath="/doanh-nghiep"
              title={content.entrepreneursPageListTitle || "Danh sách bài viết doanh nhân"}
              searchPlaceholder="Tìm kiếm doanh nhân, lãnh đạo, bài viết..."
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
