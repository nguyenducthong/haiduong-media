import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, User, Share2, Tag, ArrowRight } from "lucide-react";
import { FloatingContact, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getNewsBySlug, loadSiteContent } from "@/lib/site-content";
import { ArticleContentRenderer } from "@/components/article-content-renderer";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await loadSiteContent();
  const article = content.news.find((n) => n.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedNews = content.news.filter((n) => n.slug !== slug);

  return (
    <>
      <SiteHeader content={content} />
      <main className="news-detail-page">
        <section className="news-detail-hero">
          <div className="site-container">
            <nav className="event-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <Link href="/tin-tuc">Tin tức & Kiến thức</Link>
              <span>/</span>
              <span className="current">{article.title}</span>
            </nav>

            <span className="article-category-badge">{article.category}</span>
            <h1 className="news-detail-title">{article.title}</h1>

            <div className="article-meta-row">
              <span>
                <CalendarDays size={15} /> {article.date}
              </span>
              <span>
                <User size={15} /> {article.author || "Ban Biên Tập"}
              </span>
            </div>
          </div>
        </section>

        <section className="section news-detail-body">
          <div className="site-container news-layout-grid">
            <article className="news-main-article">
              {article.image && (
                <div className="article-featured-img">
                  <img src={article.image} alt={article.title} />
                </div>
              )}

              <p className="article-lead-p">{article.excerpt}</p>

              <div className="article-full-text">
                <ArticleContentRenderer content={article.content || article.excerpt} />
              </div>

              <div className="article-share-cta">
                <div>
                  <strong>Cần tư vấn chiến lược cho thương hiệu của bạn?</strong>
                  <p>Liên hệ hotline {content.hotline} để nhận báo giá phát sóng VTV & báo chí.</p>
                </div>
                <Link href="/lien-he" className="button button-primary">
                  Nhận tư vấn ngay <ArrowRight size={16} />
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="news-sidebar">
              <div className="sidebar-card">
                <h3>Bài viết mới nhất</h3>
                <div className="recent-posts-list">
                  {relatedNews.slice(0, 4).map((item, idx) => (
                    <article className="recent-post-item" key={idx}>
                      <span className="recent-category">{item.category}</span>
                      <h4>
                        <Link href={`/tin-tuc/${item.slug}`}>{item.title}</Link>
                      </h4>
                      <small>{item.date}</small>
                    </article>
                  ))}
                </div>
              </div>

              <div className="sidebar-card vtv-ad-box">
                <span className="vtv-badge">QUẢNG CÁO VTV</span>
                <h4>Sản xuất TVC & Booking khung giờ vàng VTV1, VTV3</h4>
                <p>Chiết khấu hấp dẫn, thủ tục kiểm duyệt nhanh gọn, đạt chuẩn phát sóng 4K.</p>
                <Link href="/#vtv-commercials" className="sidebar-btn">
                  Xem chi tiết →
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
