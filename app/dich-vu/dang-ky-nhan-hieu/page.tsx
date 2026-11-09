import type { Metadata } from "next";
import Link from "@/components/link";
import { ArrowRight, Award, CheckCircle2, FileCheck, PhoneCall, Search, ShieldCheck, Users } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { ArticleContentRenderer } from "@/components/article-content-renderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadSiteContent();
  return {
    alternates: { canonical: "/dich-vu/dang-ky-nhan-hieu" },
    title: content.trademarkTitle || "Đăng Ký Nhãn Hiệu Độc Quyền Trọn Gói | Hải Dương Media",
    description:
      content.trademarkDescription ||
      "Dịch vụ đăng ký bảo hộ nhãn hiệu độc quyền trọn gói tại Cục Sở hữu trí tuệ. Tra cứu chuyên sâu miễn phí, hoàn thiện hồ sơ chuẩn xác, theo dõi văn bằng bảo hộ 10 năm.",
  };
}

export default async function TrademarkServicePage() {
  const content = await loadSiteContent();

  const eyebrow = content.trademarkEyebrow || "BẢO VỆ TÀI SẢN THƯƠNG HIỆU & DOANH NGHIỆP";
  const title = content.trademarkTitle || "Đăng Ký Nhãn Hiệu Độc Quyền Trọn Gói";
  const description =
    content.trademarkDescription ||
    "Xác lập quyền sở hữu hợp pháp đối với logo, tên thương hiệu và slogan tại Cục Sở hữu trí tuệ Việt Nam. Bảo vệ thương hiệu vững chắc trước hành vi làm giả, làm nhái và xâm phạm quyền sở hữu.";
  const bodyContent = content.trademarkContent || "";
  const ctaText = content.trademarkCtaText || "Tra cứu nhãn hiệu miễn phí";
  const ctaHref = content.trademarkCtaHref || "/lien-he";
  const hotline = content.hotline || "0931.538.666";
  const hotlineHref = content.hotlineHref || "0931538666";

  const highlights = [
    {
      icon: Search,
      color: "#d42027",
      title: "Tra cứu độc quyền",
      desc: "Tra cứu chuyên sâu sơ bộ & chính thức tại Cục SHTT với độ chính xác trên 95% trước khi nộp đơn.",
    },
    {
      icon: FileCheck,
      color: "#2563eb",
      title: "Hồ sơ chuẩn hóa",
      desc: "Soạn thảo đơn đăng ký, phân nhóm ngành nghề theo bảng phân loại Nice chuẩn xác, tối ưu chi phí.",
    },
    {
      icon: ShieldCheck,
      color: "#16a34a",
      title: "Theo dõi & Bảo vệ",
      desc: "Theo dõi toàn bộ quá trình thẩm định hình thức, công bố đơn và thẩm định nội dung đến khi nhận văn bằng.",
    },
    {
      icon: Users,
      color: "#9333ea",
      title: "Đồng hành trọn đời",
      desc: "Hỗ trợ pháp lý xử lý xâm phạm nhãn hiệu, gia hạn văn bằng bảo hộ sau 10 năm nhanh chóng.",
    },
  ];

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero eyebrow={eyebrow} title={title} description={description} />

        {/* Feature Highlights Row */}
        <section className="section" style={{ paddingTop: "40px", paddingBottom: "20px" }}>
          <div className="site-container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "40px",
              }}
            >
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--line)",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: `${item.color}14`,
                        color: item.color,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Main Content Article Body */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "20px",
                padding: "36px 40px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                marginBottom: "48px",
              }}
            >
              <ArticleContentRenderer content={bodyContent} />
            </div>

            {/* Bottom CTA Card - Chuẩn đẹp tương phản rõ ràng */}
            <div
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "20px",
                padding: "40px",
                color: "#fff",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "24px",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              }}
            >
              <div style={{ maxWidth: "620px" }}>
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
                  BẢO VỆ THƯƠNG HIỆU NGAY HÔM NAY
                </span>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px", color: "#fff" }}>
                  Bạn muốn xác lập quyền độc quyền nhãn hiệu?
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                  Liên hệ chuyên viên pháp lý Hải Dương Media để được tra cứu nhãn hiệu hoàn toàn miễn phí trong vòng 30 phút.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <a
                  href={`tel:${hotlineHref}`}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "14px 24px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <PhoneCall size={16} /> Hotline: {hotline}
                </a>

                <Link
                  href={ctaHref}
                  style={{
                    background: "#d42027",
                    color: "#fff",
                    padding: "14px 28px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(212,32,39,0.4)",
                  }}
                >
                  {ctaText} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
