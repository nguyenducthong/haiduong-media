import type { Metadata } from "next";
import Link from "@/components/link";
import { ArrowRight, BookOpen, Compass, Lightbulb, PhoneCall, Shield, ShieldCheck } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { ArticleContentRenderer } from "@/components/article-content-renderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadSiteContent();
  return {
    alternates: { canonical: "/dich-vu/so-huu-tri-tue" },
    title: content.ipTitle || "Đăng Ký & Bảo Hộ Sở Hữu Trí Tuệ Toàn Diện | Hải Dương Media",
    description:
      content.ipDescription ||
      "Dịch vụ đăng ký bảo hộ quyền tác giả, kiểu dáng công nghiệp, sáng chế và giải pháp hữu ích. Xây dựng lá chắn pháp lý tài sản trí tuệ vững chắc cho doanh nghiệp.",
  };
}

export default async function IntellectualPropertyServicePage() {
  const content = await loadSiteContent();

  const eyebrow = content.ipEyebrow || "BẢO HỘ TÀI SẢN VÔ HÌNH & PHÁP LÝ DOANH NGHIỆP";
  const title = content.ipTitle || "Đăng Ký & Bảo Hộ Sở Hữu Trí Tuệ Toàn Diện";
  const description =
    content.ipDescription ||
    "Giải pháp bảo hộ toàn diện cho bản quyền tác giả, sáng chế, kiểu dáng công nghiệp và giải pháp hữu ích. Xây dựng lá chắn pháp lý tài sản trí tuệ vững chắc cho doanh nghiệp trước nguy cơ tranh chấp.";
  const bodyContent = content.ipContent || "";
  const ctaText = content.ipCtaText || "Tư vấn xác lập quyền";
  const ctaHref = content.ipCtaHref || "/lien-he";
  const hotline = content.hotline || "0931.538.666";
  const hotlineHref = content.hotlineHref || "0931538666";

  const highlights = [
    {
      icon: BookOpen,
      color: "#d42027",
      title: "Bản quyền tác giả",
      desc: "Đăng ký bảo hộ phần mềm, tác phẩm mỹ thuật ứng dụng, bài viết, giáo trình, hình ảnh và video sản phẩm.",
    },
    {
      icon: Lightbulb,
      color: "#2563eb",
      title: "Sáng chế & Giải pháp",
      desc: "Tư vấn xác lập quyền độc quyền đối với các phát minh kỹ thuật, giải pháp hữu ích đột phá cho doanh nghiệp.",
    },
    {
      icon: Compass,
      color: "#16a34a",
      title: "Kiểu dáng công nghiệp",
      desc: "Bảo hộ hình dáng bên ngoài của sản phẩm (bao bì, vỏ hộp, thiết kế hình khối sản phẩm thương mại).",
    },
    {
      icon: Shield,
      color: "#9333ea",
      title: "Bảo vệ & Xử lý vi phạm",
      desc: "Đại diện thực thi quyền SHTT, gửi cảnh báo vi phạm, phối hợp cơ quan chức năng xử lý hàng giả, hàng nhái.",
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

            {/* Bottom CTA Card */}
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
                  XÂY DỰNG LÁ CHẮN TÀI SẢN TRÍ TUỆ VỮNG CHẮC
                </span>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px", color: "#fff" }}>
                  Bảo hộ tác quyền & sáng chế độc quyền
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                  Đội ngũ luật sư & chuyên gia SHTT Hải Dương Media hỗ trợ trọn gói từ khâu đánh giá khả năng bảo hộ đến nhận bằng độc quyền.
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
