import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { getEnterprisesByType } from "@/lib/enterprises";
import { EnterpriseList } from "@/components/enterprise-list";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sản Phẩm & Thương Hiệu Tiêu Biểu",
  description:
    "Các sản phẩm, giải pháp chất lượng cao được bảo trợ truyền thông và vinh danh bởi THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn).",
};

export default async function ProductsPage() {
  const content = await loadSiteContent();
  const productArticles = await getEnterprisesByType("san-pham");
  const visibleArticles = productArticles.filter((item) => item.active !== false);

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow="SẢN PHẨM & DỊCH VỤ TRUYỀN THÔNG"
          title="Giải Pháp Truyền Thông & Xây Dựng Thương Hiệu Toàn Diện"
          description="Hải Dương Media cung cấp hệ sinh thái sản phẩm và dịch vụ đồng bộ từ sản xuất phim TVC, booking báo đài, tư vấn nhận diện đến tổ chức sự kiện quốc tế."
        />

        <section className="section" style={{ paddingTop: "40px", paddingBottom: "90px" }}>
          <div className="site-container">
            <EnterpriseList
              initialArticles={visibleArticles}
              basePath="/doanh-nghiep"
              title="Danh sách sản phẩm & dịch vụ"
              searchPlaceholder="Tìm kiếm sản phẩm, dịch vụ, thương hiệu..."
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
