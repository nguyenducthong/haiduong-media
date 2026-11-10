import type { Metadata } from "next";
import Link from "@/components/link";
import {
  Share2,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Flame,
  KeyRound,
  ShieldAlert,
  Lock,
  ShieldOff,
  Smartphone,
  HelpCircle,
  ShieldCheck,
  BadgeCheck,
  Copyright,
  AlertTriangle,
} from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { FACEBOOK_SERVICES } from "@/lib/facebook-services";
import { ArticleContentRenderer } from "@/components/article-content-renderer";
import { getEnterprises, getArticleTypes } from "@/lib/enterprises";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadSiteContent();
  return {
    alternates: { canonical: "/dich-vu-facebook" },
    title: content.facebookHubTitle || "Dịch Vụ Facebook Toàn Diện - Uy Tín Hàng Đầu | Hải Dương Media",
    description:
      content.facebookHubDescription ||
      "Hệ sinh thái dịch vụ Facebook chuyên sâu: lấy lại tài khoản bị hack, mở khóa két sắt 956, mở treo 282, bảo mật đa tầng, cấp tích xanh, bảo vệ bản quyền. Cam kết làm trước trả tiền sau.",
  };
}

const ICON_MAP: Record<string, any> = {
  KeyRound,
  ShieldAlert,
  Lock,
  ShieldOff,
  Smartphone,
  HelpCircle,
  ShieldCheck,
  BadgeCheck,
  Copyright,
  AlertTriangle,
  Share2,
};

export default async function FacebookServicesHubPage() {
  const content = await loadSiteContent();

  const eyebrow = content.facebookHubEyebrow || "GIẢI PHÁP MẠNG XÃ HỘI CHUYÊN NGHIỆP 24/7";
  const title = content.facebookHubTitle || "Dịch Vụ Facebook Toàn Diện - Uy Tín Hàng Đầu";
  const description =
    content.facebookHubDescription ||
    "Hải Dương Media cung cấp hệ sinh thái dịch vụ Facebook chuyên sâu: lấy lại tài khoản bị hack, mở khóa 956, mở treo 282, bảo mật đa tầng, cấp tích xanh, bảo vệ bản quyền và xử lý khủng hoảng. Cam kết làm trước nghiệm thu, hài lòng mới thanh toán.";
  const hotline = content.hotline || "0931.538.666";
  const hotlineHref = content.hotlineHref || "0931538666";

  // Lấy dữ liệu bài viết thực tế từ Database D1
  const allArticles = await getEnterprises();
  const dbFbArticles = allArticles.filter((art) => {
    const types = getArticleTypes(art);
    const cat = (art.category || "").toLowerCase();
    return (
      types.includes("dich-vu-facebook") ||
      cat.includes("facebook") ||
      cat.includes("dịch vụ facebook")
    );
  });

  // Hợp nhất dữ liệu DB với metadata (để bài viết mới thêm vào Database tự động xuất hiện ngay lập tức)
  const servicesList: Array<{
    id: string;
    slug: string;
    number: number;
    title: string;
    subtitle: string;
    shortDesc: string;
    isHot: boolean;
    tags: string[];
    iconName: string;
    image?: string;
  }> = [];

  const processedSlugs = new Set<string>();

  // 1. Duyệt qua các bài viết Facebook trong DB (ưu tiên thứ tự DB)
  dbFbArticles.forEach((art, idx) => {
    const fbMeta = FACEBOOK_SERVICES.find((s) => s.slug === art.slug || s.id === art.id);
    processedSlugs.add(art.slug);
    servicesList.push({
      id: art.id || `fb-${idx + 1}`,
      slug: art.slug,
      number: fbMeta?.number || idx + 1,
      title: art.title || fbMeta?.title || "Dịch vụ Facebook",
      subtitle: fbMeta?.subtitle || "Dịch vụ Facebook chuyên nghiệp",
      shortDesc: art.excerpt || fbMeta?.shortDesc || "Hỗ trợ xử lý nhanh chóng - Cam kết bảo mật tuyệt đối.",
      isHot: fbMeta?.isHot ?? false,
      tags: fbMeta?.tags || ["Facebook", "Bảo mật", "Hải Dương Media"],
      iconName: fbMeta?.iconName || "ShieldCheck",
      image: art.image || fbMeta?.image,
    });
  });

  // 2. Dự phòng các dịch vụ có trong FACEBOOK_SERVICES mà chưa có trong DB
  FACEBOOK_SERVICES.forEach((srv) => {
    if (!processedSlugs.has(srv.slug)) {
      processedSlugs.add(srv.slug);
      servicesList.push({
        id: srv.id,
        slug: srv.slug,
        number: srv.number,
        title: srv.title,
        subtitle: srv.subtitle,
        shortDesc: srv.shortDesc,
        isHot: srv.isHot,
        tags: srv.tags,
        iconName: srv.iconName,
        image: srv.image,
      });
    }
  });

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero eyebrow={eyebrow} title={title} description={description} />

        <section className="section" style={{ paddingTop: "40px", paddingBottom: "20px" }}>
          <div className="site-container">
            {/* Optional WYSIWYG Content from Admin (hỗ trợ bảng giá, bài viết chi tiết, hình ảnh) */}
            {content.facebookHubContent && content.facebookHubContent.trim() !== "" && (
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
                <ArticleContentRenderer content={content.facebookHubContent} />
              </div>
            )}

            {/* Grid Dịch vụ Facebook tự động mở rộng theo Database */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span style={{ color: "#d42027", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                DANH MỤC GIẢI PHÁP
              </span>
              <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginTop: "6px", marginBottom: "8px" }}>
                Tổng Hợp Toàn Bộ {servicesList.length} Dịch Vụ Facebook Chuyên Sâu
              </h2>
              <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
                Chọn đúng dịch vụ bạn đang gặp sự cố để xem hướng dẫn xử lý và quy trình lấy lại tài khoản an toàn nhất.
              </p>
            </div>

            <div
              className="fb-services-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: "24px",
                marginBottom: "48px",
              }}
            >
              {servicesList.map((srv, index) => {
                const Icon = ICON_MAP[srv.iconName] || ShieldCheck;
                const displayNumber = srv.number || index + 1;
                return (
                  <div
                    key={srv.id}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--line)",
                      borderRadius: "18px",
                      padding: "24px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "16px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div>
                      {/* Ảnh đại diện nếu có */}
                      {srv.image && (
                        <div
                          style={{
                            width: "100%",
                            height: "160px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            background: "#f1f5f9",
                            marginBottom: "16px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <img
                            src={srv.image}
                            alt={srv.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "10px",
                              background: "#eff6ff",
                              color: "#1d4ed8",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={20} />
                          </div>
                          <div>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                              Dịch vụ #{displayNumber}
                            </span>
                            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1.35 }}>
                              {displayNumber}. {srv.title}
                            </h3>
                          </div>
                        </div>

                        {srv.isHot && (
                          <span
                            style={{
                              background: "#fee2e2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: "999px",
                              padding: "4px 10px",
                              fontSize: "11px",
                              fontWeight: 800,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              flexShrink: 0,
                            }}
                          >
                            <Flame size={12} fill="#dc2626" /> HOT
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "6px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#1e40af",
                          marginBottom: "10px",
                        }}
                      >
                        {srv.subtitle}
                      </div>

                      <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: "0 0 12px 0" }}>
                        {srv.shortDesc}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {srv.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              background: "#f1f5f9",
                              color: "#475569",
                              borderRadius: "6px",
                              padding: "3px 8px",
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        paddingTop: "14px",
                        borderTop: "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 size={14} /> Làm trước trả tiền sau
                      </span>
                      <Link
                        href={`/dich-vu-facebook/${srv.slug}`}
                        style={{
                          color: "#1d4ed8",
                          fontWeight: 700,
                          fontSize: "13px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Xem bài viết <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Emergency Card */}
            <div
              className="fb-emergency-card"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "20px",
                padding: "36px",
                color: "#fff",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "24px",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              }}
            >
              <div style={{ maxWidth: "640px" }}>
                <span style={{ color: "#f87171", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  HỖ TRỢ KHẨN CẤP 24/7
                </span>
                <h3 style={{ fontSize: "24px", fontWeight: 800, margin: "6px 0 10px 0" }}>
                  Bạn không chắc Facebook của mình đang gặp lỗi gì?
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
                  Hãy liên hệ ngay với kỹ thuật viên của Hải Dương Media. Chúng tôi sẽ kiểm tra và phân tích lỗi tài khoản miễn phí chỉ trong 5-10 phút.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <a
                  href={`tel:${hotlineHref}`}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "12px 20px",
                    borderRadius: "10px",
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

                <a
                  href={`https://zalo.me/${hotlineHref}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#d42027",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(212,32,39,0.4)",
                  }}
                >
                  Chat Zalo Ngay <ArrowRight size={16} />
                </a>
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
