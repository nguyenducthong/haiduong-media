import Link from "@/components/link";
import { ArrowUpRight, Globe2, MapPin, MessageCircle, Phone, Search, Tv } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";
import { HeaderNav } from "@/components/header-nav";

const links = [
  ["Trang chủ", "/"],
  ["Giới thiệu", "/gioi-thieu"],
  ["Tin tức", "/tin-tuc"],
  ["Doanh nghiệp", "/doanh-nghiep"],
  ["Doanh nhân", "/doanh-nhan"],
  ["Sản phẩm", "/san-pham"],
  ["Liên hệ", "/lien-he"],
] as const;

export function SiteHeader({ content }: { content: SiteContent }) {
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand" aria-label="Trang chủ">
          <img
            src="/images/logo.png"
            alt={content.brandName}
            className="brand-logo-img"
          />
          <span className="brand-text">
            <strong className="brand-title">{content.brandName}</strong>
            <small className="brand-subtitle">{content.brandKicker || "XÂY DỰNG THƯƠNG HIỆU TOÀN DIỆN"}</small>
          </span>
        </Link>

        <HeaderNav links={links} />

        <div className="header-actions">
          <form action="/tin-tuc" method="GET" className="header-search">
            <input
              type="search"
              name="q"
              placeholder="Tìm kiếm..."
              aria-label="Tìm kiếm bài viết"
              className="header-search-input"
            />
            <button type="submit" className="header-search-btn" aria-label="Tìm kiếm">
              <Search size={15} />
            </button>
          </form>
        </div>

        <details className="mobile-menu">
          <summary aria-label="Mở menu">
            <span>Menu</span>
          </summary>
          <div className="mobile-menu-dropdown">
            <form action="/tin-tuc" method="GET" className="mobile-search">
              <input
                type="search"
                name="q"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm"
              />
              <button type="submit" aria-label="Tìm kiếm">
                <Search size={15} />
              </button>
            </form>
            <nav>
              {links.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
              <Link href="/admin">Quản trị CMS</Link>
            </nav>
            <a
              className="mobile-phone-btn"
              href={`tel:${content.hotlineHref}`}
            >
              <Phone size={15} />
              <span>Hotline: {content.hotline}</span>
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter({ content }: { content: SiteContent }) {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div>
          <div className="brand footer-brand">
            <img
              src="/images/logo.png"
              alt={content.brandName}
              className="brand-logo-img"
              style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "8px", flexShrink: 0 }}
            />
            <span>
              <strong>{content.brandName}</strong>
              <small style={{ color: "#94a3b8" }}>{content.brandKicker}</small>
            </span>
          </div>
          <p>{content.footerNote}</p>
        </div>
        <div>
          <h3>Khám phá</h3>
          <Link href="/#vtv-commercials">Phim quảng cáo trên VTV</Link>
          <Link href="/tin-tuc">Tin tức & Hoạt động</Link>
          <Link href="/doanh-nghiep">Doanh nghiệp tiêu biểu</Link>
          <Link href="/#press-coverage">Báo chí nói về chúng tôi</Link>
          <Link href="/#our-brands">Thương hiệu của chúng tôi</Link>
          <Link href="/#our-partners">Đối tác & Khách hàng</Link>
        </div>
        <div>
          <h3>Liên hệ nhanh</h3>
          <a href={`tel:${content.hotlineHref}`}>Hotline: {content.hotline}</a>
          <a href={`mailto:${content.email}`}>{content.email}</a>
          <span>{content.address}</span>
        </div>
        <div>
          <h3>Quản lý website</h3>
          <Link href="/admin" className="admin-link">
            Mở trang quản trị <ArrowUpRight size={15} />
          </Link>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#64748b" }}>
            Hệ thống CMS cập nhật nội dung tức thời.
          </p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        © 2026 {content.brandName}. Đối tác chiến lược truyền thông & sản xuất phim quảng cáo VTV.
      </div>
    </footer>
  );
}

export function FloatingContact({ content }: { content: SiteContent }) {
  return (
    <div className="floating-contact" aria-label="Liên hệ nhanh">
      <a
        href={`tel:${content.hotlineHref}`}
        aria-label="Gọi điện"
        className="floating-btn-phone"
        style={{ background: "#d42027" }}
      >
        <Phone size={21} />
      </a>
      <a
        href={content.zaloUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat Zalo"
        className="floating-btn-zalo"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <img
          src="/images/zalo-round-color-icon.png?v=2"
          alt="Zalo"
          className="floating-icon-img"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </a>
      <a
        href={content.facebookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Mở Fanpage"
        className="floating-btn-facebook"
        style={{ background: "#1877f2", padding: 0, overflow: "hidden" }}
      >
        <img
          src="/images/facebook-round-color-icon.png"
          alt="Facebook"
          className="floating-icon-img"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </a>
      <a
        href={content.mapUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Xem bản đồ"
        className="floating-btn-map"
        style={{ background: "#ea4335" }}
      >
        <MapPin size={21} />
      </a>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="site-container">
        <span className="eyebrow" style={{ color: "#d42027" }}>
          {eyebrow}
        </span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
