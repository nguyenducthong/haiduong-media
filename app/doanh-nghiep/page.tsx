import Link from "@/components/link";
import { ArrowRight, Award, Building2, CheckCircle2, Globe, Sparkles } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { getEnterprises, getArticleTypes } from "@/lib/enterprises";
import { EnterpriseList } from "@/components/enterprise-list";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doanh Nghiệp & Thương Hiệu Tiêu Biểu",
  description:
    "Danh sách các doanh nghiệp, thương hiệu tiêu biểu được vinh danh và bảo trợ truyền thông bởi THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn).",
};

export default async function DoanhNghiepPage() {
  const content = await loadSiteContent();
  const allArticles = await getEnterprises();
  const enterprises = allArticles.filter(
    (a) => getArticleTypes(a).includes("doanh-nghiep") && a.active !== false
  );

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow="ĐỒNG HÀNH & NÂNG TẦM"
          title="Doanh Nghiệp & Thương Hiệu Tiêu Biểu"
          description="Hơn 3.000 thương hiệu hàng đầu Việt Nam đã lựa chọn Hải Dương Media để kiến tạo chiến lược truyền thông, nâng cao định vị và phủ sóng trên sóng truyền hình quốc gia."
        />

        <section className="section" style={{ paddingTop: "40px", paddingBottom: "90px" }}>
          <div className="site-container">
            {/* Interactive Enterprise List with Search & Filter & Pagination */}
            <EnterpriseList
              initialArticles={enterprises}
              basePath="/doanh-nghiep"
              title="Danh sách doanh nghiệp & thương hiệu"
              searchPlaceholder="Tìm kiếm doanh nghiệp, thương hiệu, ngành nghề..."
              pageSize={9}
            />

            {/* CTA Box */}
            <div
              style={{
                marginTop: "48px",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "20px",
                padding: "40px",
                color: "#fff",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "24px",
              }}
            >
              <div style={{ maxWidth: "600px" }}>
                <span
                  style={{
                    color: "#f87171",
                    fontSize: "12px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  DÀNH CHO DOANH NGHIỆP
                </span>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px", color: "#fff" }}>
                  Đưa thương hiệu của bạn xuất hiện trên VTV & hơn 200 báo điện tử
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                  Đồng hành cùng Hải Dương Media để sản xuất TVC chuẩn 4K, đăng ký bảng vàng Thương hiệu Quốc gia và phủ sóng truyền thông toàn diện.
                </p>
              </div>

              <Link
                href="/lien-he"
                className="button button-primary"
                style={{
                  background: "#d42027",
                  color: "#fff",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "15px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Nhận tư vấn truyền thông <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
