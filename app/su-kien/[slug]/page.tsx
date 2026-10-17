import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Share2,
  Award,
  Users,
  Building2,
  Sparkles,
} from "lucide-react";
import { FloatingContact, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getEventBySlug, loadSiteContent } from "@/lib/site-content";
import { ArticleContentRenderer } from "@/components/article-content-renderer";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await loadSiteContent();
  const event = content.upcomingEvents.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const otherEvents = content.upcomingEvents.filter((e) => e.slug !== slug);

  return (
    <>
      <SiteHeader content={content} />
      <main className="event-detail-page">
        {/* Breadcrumb & Hero */}
        <section className="event-detail-hero">
          <div className="site-container">
            <nav className="event-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <Link href="/su-kien">Sự kiện</Link>
              <span>/</span>
              <span className="current">{event.title}</span>
            </nav>

            <div className="event-hero-meta">
              <span className="event-tag" style={{ background: "#d42027", color: "#fff", padding: "5px 12px", borderRadius: "999px" }}>
                {event.tag}
              </span>
            </div>

            <h1 className="event-detail-title">{event.title}</h1>
            <p className="event-detail-summary">{event.summary}</p>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="section event-detail-body">
          <div className="site-container event-layout-grid">
            {/* Left Column: Event Poster & Content */}
            <article className="event-main-content">
              {/* Event Poster Card */}
              <div className="event-poster-container">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-main-poster"
                />
              </div>

              {/* Event Quick Specs Strip */}
              <div className="event-specs-strip">
                <div className="spec-item">
                  <Calendar size={20} className="spec-icon" />
                  <div>
                    <small>Thời gian tổ chức</small>
                    <strong>{event.date}</strong>
                    <span>{event.time || "Theo lịch trình"}</span>
                  </div>
                </div>
                <div className="spec-item">
                  <MapPin size={20} className="spec-icon" />
                  <div>
                    <small>Địa điểm</small>
                    <strong>{event.location}</strong>
                  </div>
                </div>
                <div className="spec-item">
                  <Building2 size={20} className="spec-icon" />
                  <div>
                    <small>Đơn vị đồng hành</small>
                    <strong>Hải Dương Media & Đối tác</strong>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="event-content-section">
                <h2>Giới thiệu sự kiện</h2>
                <ArticleContentRenderer content={event.description || event.summary} />
              </div>

              {/* Agenda / Schedule */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="event-content-section">
                  <h2>Lịch trình chương trình</h2>
                  <div className="agenda-timeline">
                    {event.agenda.map((item, idx) => (
                      <div className="agenda-item" key={idx}>
                        <div className="agenda-marker">{idx + 1}</div>
                        <div className="agenda-text">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {event.benefits && event.benefits.length > 0 && (
                <div className="event-content-section">
                  <h2>Quyền lợi đại biểu & Doanh nghiệp</h2>
                  <ul className="benefits-list">
                    {event.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={18} className="benefit-icon" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Media Sponsor Note */}
              <div className="event-media-sponsor-box">
                <Sparkles size={22} className="sponsor-icon" />
                <div>
                  <strong>Bảo trợ truyền thông & Đưa tin phát sóng</strong>
                  <p>
                    Sự kiện được bảo trợ truyền thông bởi Hải Dương Media, phát sóng phóng sự trên các đài truyền hình
                    quốc gia VTV1, VTV3, HTV9 và đưa tin trên hơn 200+ báo điện tử hàng đầu (VnExpress, Dân Trí, Tuổi Trẻ, CafeF...).
                  </p>
                </div>
              </div>
            </article>

            {/* Right Column: Event Info & Contact Support */}
            <aside className="event-sidebar">
              <div className="sidebar-sticky-box">
                <div className="registration-card">
                  <div className="reg-header">
                    <Phone size={24} className="reg-icon" />
                    <h3>Thông tin & Hỗ trợ</h3>
                    <p>Ban tổ chức chương trình & Tiếp nhận thông tin</p>
                  </div>

                  <div style={{ padding: "0 24px 20px", display: "grid", gap: "14px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <small style={{ color: "var(--muted)", fontSize: "12px" }}>Đơn vị tổ chức:</small>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>Hải Dương Media & Đối tác</strong>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <small style={{ color: "var(--muted)", fontSize: "12px" }}>Thời gian:</small>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                        {event.date} ({event.time || "Theo lịch trình"})
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <small style={{ color: "var(--muted)", fontSize: "12px" }}>Địa điểm tổ chức:</small>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{event.location}</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <small style={{ color: "var(--muted)", fontSize: "12px" }}>Người phụ trách tiếp nhận:</small>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#d42027" }}>
                        {event.contactPerson || "Hotline Ban Tổ Chức: 090 377 2086"}
                      </span>
                    </div>
                  </div>

                  <div className="reg-support-box" style={{ borderTop: "1px solid var(--line)", margin: "0", borderRadius: "0 0 20px 20px" }}>
                    <small>Liên hệ trực tiếp để được tư vấn:</small>
                    <a href={`tel:${content.hotlineHref}`} className="support-link">
                      <Phone size={16} /> Hotline: {content.hotline}
                    </a>
                    <a
                      href={content.zaloUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="support-link"
                    >
                      <MessageCircle size={16} /> Nhắn tin Zalo Ban Tổ Chức
                    </a>
                  </div>
                </div>

                {/* Danh sách các sự kiện khác */}
                {otherEvents.length > 0 && (
                  <div className="sidebar-card" style={{ marginTop: "24px" }}>
                    <h3>Sự kiện tiếp theo</h3>
                    <div className="recent-posts-list">
                      {otherEvents.slice(0, 3).map((item, idx) => (
                        <article className="recent-post-item" key={idx}>
                          <span className="recent-category">{item.tag}</span>
                          <h4>
                            <Link href={`/su-kien/${item.slug}`}>{item.title}</Link>
                          </h4>
                          <small>{item.date} • {item.location}</small>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* Other Events */}
        {otherEvents.length > 0 && (
          <section className="section other-events-section">
            <div className="site-container">
              <div className="section-heading split-heading">
                <div>
                  <span className="eyebrow" style={{ color: "#d42027" }}>CÁC SỰ KIỆN KHÁC</span>
                  <h2>Diễn Đàn & Sự Kiện Tiếp Theo</h2>
                </div>
                <Link href="/su-kien" className="text-link">
                  Xem tất cả sự kiện →
                </Link>
              </div>

              <div className="events-grid">
                {otherEvents.slice(0, 3).map((item, idx) => (
                  <article className="event-card has-poster" key={idx}>
                    <Link href={`/su-kien/${item.slug}`} className="event-poster-wrapper">
                      <img src={item.image} alt={item.title} className="event-poster-img" />
                      <div className="event-poster-overlay">
                        <span className="event-tag">{item.tag}</span>
                      </div>
                    </Link>
                    <div className="event-card-body">
                      <h3 className="event-card-title">
                        <Link href={`/su-kien/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <div className="event-info-list">
                        <div className="event-info-item">
                          <Calendar size={15} className="event-icon" />
                          <span>{item.date}</span>
                        </div>
                        <div className="event-info-item">
                          <MapPin size={15} className="event-icon" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
