import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  User,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  Share2,
} from "lucide-react";
import { FloatingContact, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { getArticleBySlug } from "@/lib/enterprises";
import { ArticleContentRenderer } from "@/components/article-content-renderer";
import { ViewCounter } from "@/components/view-counter";
import { FACEBOOK_SERVICES } from "@/lib/facebook-services";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dbArticle = await getArticleBySlug(slug);
  const fbMeta = FACEBOOK_SERVICES.find((s) => s.slug === slug);

  const title = dbArticle?.title || fbMeta?.title || "Dịch vụ Facebook";
  const desc =
    dbArticle?.excerpt ||
    fbMeta?.shortDesc ||
    "Dịch vụ Facebook toàn diện uy tín - Làm trước trả tiền sau tại Hải Dương Media";

  return {
    alternates: { canonical: `/dich-vu-facebook/${encodeURIComponent(slug)}` },
    title: `${title} - Làm Trước Trả Tiền Sau | Hải Dương Media`,
    description: desc,
    openGraph: {
      title: `${title} - Hải Dương Media`,
      description: desc,
      images: dbArticle?.image ? [dbArticle.image] : [],
    },
  };
}

export default async function FacebookServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await loadSiteContent();
  const dbArticle = await getArticleBySlug(slug);
  const fbMeta = FACEBOOK_SERVICES.find((s) => s.slug === slug);

  if (!dbArticle && !fbMeta) {
    notFound();
  }

  const title = dbArticle?.title || fbMeta?.title || "Dịch vụ Facebook";
  const subtitle = fbMeta?.subtitle || "Dịch vụ Facebook chuyên nghiệp";
  const excerpt = dbArticle?.excerpt || fbMeta?.shortDesc || "";
  const bodyContent = dbArticle?.content || "";
  const isHot = fbMeta?.isHot ?? false;
  const image = dbArticle?.image;
  const date = dbArticle?.date || "09/11/2026";
  const author = dbArticle?.author || "Kỹ Thuật Viên Hải Dương Media";
  const hotline = content.hotline || "0931.538.666";
  const hotlineHref = content.hotlineHref || "0931538666";

  const otherServices = FACEBOOK_SERVICES.filter((s) => s.slug !== slug);

  return (
    <>
      <SiteHeader content={content} />
      <main className="news-detail-page">
        {/* Detail Header Hero - Khổ lớn thoáng đạt */}
        <section className="news-detail-hero" style={{ padding: "50px 0 40px 0" }}>
          <div className="site-container">
            <nav className="event-breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: "16px" }}>
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <Link href="/dich-vu-facebook">Dịch vụ Facebook</Link>
              <span>/</span>
              <span className="current">{title}</span>
            </nav>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              <span className="article-category-badge" style={{ fontSize: "13px", padding: "6px 14px" }}>
                Dịch vụ Facebook Toàn Diện
              </span>
              {isHot && (
                <span
                  style={{
                    background: "#fee2e2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    borderRadius: "999px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Flame size={13} fill="#dc2626" /> Dịch vụ HOT
                </span>
              )}
            </div>

            <h1
              className="news-detail-title"
              style={{
                fontSize: "clamp(26px, 4vw, 38px)",
                fontWeight: 900,
                lineHeight: 1.3,
                maxWidth: "1100px",
                margin: "0 0 12px 0",
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p style={{ color: "#93c5fd", fontSize: "18px", fontWeight: 600, margin: "0 0 20px 0" }}>
                {subtitle}
              </p>
            )}

            <div className="article-meta-row" style={{ fontSize: "14px" }}>
              <span>
                <CalendarDays size={16} /> {date}
              </span>
              <span>
                <User size={16} /> {author}
              </span>
              <ViewCounter slug={`fb-${slug}`} initialViews={dbArticle?.views || "1.250"} iconSize={16} />
            </div>
          </div>
        </section>

        {/* Main Content Area - Full width 100% không bị co ép bên phải */}
        <section className="section news-detail-body" style={{ paddingTop: "40px" }}>
          <div className="site-container">
            <article
              className="news-main-article fb-detail-card"
              style={{
                width: "100%",
                maxWidth: "100%",
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "20px",
                padding: "40px 48px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              {image && (
                <div
                  className="fb-featured-img-box"
                  style={{
                    marginBottom: "32px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                    background: "#f8fafc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <img
                    src={image}
                    alt={title}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "none",
                      objectFit: "contain",
                      borderRadius: "10px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                      display: "block",
                    }}
                  />
                </div>
              )}

              {excerpt && (
                <div className="article-lead-p" style={{ fontSize: "18px", lineHeight: "1.7", marginBottom: "32px" }}>
                  {excerpt}
                </div>
              )}

              {/* Nội dung bài viết to rõ ràng */}
              <div className="article-full-text" style={{ fontSize: "16px", lineHeight: "1.8", color: "#1e293b" }}>
                <ArticleContentRenderer content={bodyContent} />
              </div>

              {/* Bottom Emergency Card */}
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
                  marginTop: "48px",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                }}
              >
                <div style={{ maxWidth: "620px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Zap size={22} color="#fde047" />
                    <span style={{ color: "#f87171", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      HỖ TRỢ XỬ LÝ KHẨN CẤP 24/7
                    </span>
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 10px 0" }}>
                    Cần hỗ trợ xử lý ngay trường hợp này?
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
                    Kỹ thuật viên Hải Dương Media sẵn sàng tiếp nhận và chẩn đoán tỷ lệ cứu nick chỉ trong 5-10 phút. Làm trước - nghiệm thu xong mới thanh toán!
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
                      fontSize: "15px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <PhoneCall size={18} /> Hotline: {hotline}
                  </a>

                  <a
                    href={`https://zalo.me/${hotlineHref}`}
                    target="_blank"
                    rel="noreferrer"
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
                      boxShadow: "0 4px 15px rgba(212,32,39,0.4)",
                    }}
                  >
                    Chat Zalo Hỗ Trợ Ngay <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </article>

            {/* Các Dịch Vụ Facebook Khác - Đã chuyển xuống dưới cùng toàn màn hình */}
            <div style={{ marginTop: "56px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px", gap: "12px" }}>
                <div>
                  <span style={{ color: "#d42027", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    DỊCH VỤ LIÊN QUAN
                  </span>
                  <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", margin: "6px 0 0 0" }}>
                    Các Dịch Vụ Facebook Khác Có Thể Bạn Đang Cần
                  </h2>
                </div>
                <Link
                  href="/dich-vu-facebook"
                  style={{
                    color: "#1d4ed8",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Xem toàn bộ 10 dịch vụ Facebook <ArrowRight size={16} />
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "20px",
                }}
              >
                {otherServices.map((srv) => (
                  <Link
                    key={srv.id}
                    href={`/dich-vu-facebook/${srv.slug}`}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--line)",
                      borderRadius: "16px",
                      padding: "22px",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "12px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>
                          Dịch vụ #{srv.number}
                        </span>
                        {srv.isHot && (
                          <span
                            style={{
                              background: "#fee2e2",
                              color: "#dc2626",
                              borderRadius: "999px",
                              padding: "2px 8px",
                              fontSize: "11px",
                              fontWeight: 800,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            <Flame size={11} fill="#dc2626" /> HOT
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0", lineHeight: 1.4 }}>
                        {srv.number}. {srv.title}
                      </h3>

                      <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                        {srv.shortDesc}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 size={13} /> Không cọc
                      </span>
                      <span style={{ fontSize: "13px", color: "#1d4ed8", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        Xem chi tiết <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
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
