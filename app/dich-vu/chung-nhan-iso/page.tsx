import Link from "@/components/link";
import { ArrowRight, Award, CheckCircle2, Clock, FileCheck, PhoneCall, ShieldCheck } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { ArticleContentRenderer } from "@/components/article-content-renderer";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await loadSiteContent();
  return {
    alternates: { canonical: "/dich-vu/chung-nhan-iso" },
    title: content.isoTitle || "Tư Vấn & Chứng Nhận ISO Chuyên Nghiệp | Hải Dương Media",
    description:
      content.isoDescription ||
      "Tư vấn và cấp chứng nhận ISO 9001, ISO 14001, ISO 22000, HACCP, ISO 45001 trọn gói. Đảm bảo thủ tục nhanh gọn, chi phí tối ưu, cam kết đạt chứng chỉ 100%.",
  };
}

export default async function IsoServicePage() {
  const content = await loadSiteContent();

  const eyebrow = content.isoEyebrow || "TIÊU CHUẨN QUỐC TẾ & NĂNG LỰC DOANH NGHIỆP";
  const title = content.isoTitle || "Tư Vấn & Cấp Chứng Nhận ISO Chuyên Nghiệp";
  const description =
    content.isoDescription ||
    "Hải Dương Media đồng hành cùng doanh nghiệp tư vấn xây dựng hệ thống quản lý, đào tạo và chứng nhận đạt chuẩn ISO 9001, ISO 14001, ISO 22000, HACCP, ISO 45001 với thời gian nhanh chóng, chi phí tối ưu và cam kết đạt chứng chỉ 100%.";
  const bodyContent = content.isoContent || "";
  const ctaText = content.isoCtaText || "Nhận báo giá & tư vấn ISO ngay";
  const ctaHref = content.isoCtaHref || "/lien-he";
  const hotline = content.hotline || "0931.538.666";
  const hotlineHref = content.hotlineHref || "0931538666";

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
              {[
                {
                  icon: Award,
                  color: "#d42027",
                  title: "Chứng chỉ Quốc tế",
                  desc: "Giá trị công nhận toàn cầu (IAF, BoA) hợp lệ đấu thầu & xuất khẩu.",
                },
                {
                  icon: Clock,
                  color: "#2563eb",
                  title: "Tiến độ Siêu tốc",
                  desc: "Quy trình tinh gọn, hỗ trợ hoàn thiện hồ sơ và cấp chứng chỉ nhanh.",
                },
                {
                  icon: CheckCircle2,
                  color: "#16a34a",
                  title: "Cam kết 100% Đạt",
                  desc: "Chuyên gia giàu kinh nghiệm hướng dẫn sát sao tới khi nhận bằng.",
                },
                {
                  icon: ShieldCheck,
                  color: "#9333ea",
                  title: "Bảo mật & Trọn gói",
                  desc: "Báo giá 1 lần minh bạch, không phát sinh, bảo mật toàn bộ dữ liệu.",
                },
              ].map((item, idx) => {
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
                  TƯ VẤN ISO MIỄN PHÍ TRỰC TIẾP
                </span>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px", color: "#fff" }}>
                  Đưa doanh nghiệp của bạn đạt chuẩn quốc tế ngay hôm nay
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                  Liên hệ chuyên viên tư vấn ISO cấp cao của Hải Dương Media để được khảo sát sơ bộ và nhận báo giá ưu đãi độc quyền.
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

