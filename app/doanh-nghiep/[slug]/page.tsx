import Link from "@/components/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Eye,
  ArrowRight,
  ArrowLeft,
  Building2,
  Share2,
} from "lucide-react";
import { FloatingContact, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";
import { getEnterpriseBySlug, getEnterprises, balanceHtmlTags } from "@/lib/enterprises";
import { ViewCounter } from "@/components/view-counter";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getEnterpriseBySlug(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };

  return {
    alternates: { canonical: `/doanh-nghiep/${encodeURIComponent(article.slug || slug)}` },
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: `${article.title} - Thương Hiệu Hàng Đầu VN`,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function EnterpriseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [content, article, allEnterprises] = await Promise.all([
    loadSiteContent(),
    getEnterpriseBySlug(slug),
    getEnterprises(),
  ]);

  if (!article) {
    notFound();
  }

  const related = allEnterprises.filter((a) => a.slug !== article.slug).slice(0, 4);

  return (
    <>
      <SiteHeader content={content} />
      <main className="news-detail-page">
        {/* Hero / Header Section */}
        <section className="news-detail-hero">
          <div className="site-container">
            <nav className="event-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <Link href="/doanh-nghiep">Doanh nghiệp</Link>
              <span>/</span>
              <span className="current">
                {article.title}
              </span>
            </nav>

            <span className="article-category-badge">{article.category}</span>
            <h1 className="news-detail-title">{article.title}</h1>

            <div className="article-meta-row">
              <span>
                <CalendarDays size={15} /> {article.date}
              </span>
              <ViewCounter slug={article.slug || article.id} initialViews={article.views} iconSize={15} />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section news-detail-body">
          <div className="site-container news-layout-grid">
            <article className="news-main-article">


              {article.excerpt && (
                <div
                  className="article-lead-p"
                  style={{
                    background: "#f8fafc",
                    borderLeft: "4px solid #d42027",
                    borderRadius: "0 12px 12px 0",
                    padding: "16px 20px",
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: 1.7,
                    color: "#334155",
                    marginBottom: "28px",
                  }}
                >
                  {article.excerpt}
                </div>
              )}

              {/* HTML Content */}
              {article.content ? (
                <div
                  className="article-full-text enterprise-content"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: balanceHtmlTags(article.content) }}
                />
              ) : (
                <p style={{ lineHeight: 1.8, fontSize: "16px", color: "#334155" }}>
                  {article.excerpt}
                </p>
              )}

              {/* Consultation CTA Card */}
              <div className="article-share-cta article-enterprise-cta">
                <div>
                  <strong>
                    Doanh nghiệp của bạn muốn đăng ký chương trình & booking truyền thông?
                  </strong>
                  <p>
                    Liên hệ ngay hotline {content.hotline} để nhận tư vấn hồ sơ và báo giá phát sóng VTV/HTV.
                  </p>
                </div>
                <Link
                  href="/lien-he"
                  className="button button-primary"
                >
                  Nhận tư vấn ngay <ArrowRight size={15} />
                </Link>
              </div>

              {/* Back to list */}
              <div style={{ marginTop: "32px" }}>
                <Link
                  href="/doanh-nghiep"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <ArrowLeft size={16} /> Quay lại danh sách doanh nghiệp
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="news-sidebar">
              <div className="sidebar-card">
                <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>
                  Bài viết liên quan
                </h3>
                <div className="recent-posts-list">
                  {related.map((item, idx) => (
                    <article className="recent-post-item" key={idx} style={{ marginBottom: "16px" }}>
                      <span
                        className="recent-category"
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#d42027",
                          textTransform: "uppercase",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        {item.category}
                      </span>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.4, margin: "0 0 4px" }}>
                        <Link href={`/doanh-nghiep/${item.slug}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                          {item.title}
                        </Link>
                      </h4>
                      <small style={{ color: "#94a3b8", fontSize: "12px" }}>{item.date}</small>
                    </article>
                  ))}
                </div>
              </div>

              {/* Advertising Callout Box */}
              <div className="sidebar-card vtv-ad-box" style={{ marginTop: "24px" }}>
                <span className="vtv-badge">QUẢNG CÁO VTV & TRUYỀN THÔNG</span>
                <h4>Sản xuất TVC & Booking khung giờ vàng VTV1, VTV3</h4>
                <p>Chiết khấu hấp dẫn, hồ sơ duyệt phát sóng nhanh, phóng sự doanh nghiệp chuẩn 4K.</p>
                <Link href="/lien-he" className="sidebar-btn">
                  Đăng ký phát sóng ngay →
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
