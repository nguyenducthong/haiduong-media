import Link from "@/components/link";
import { ArrowUpRight, Globe2, MapPin, MessageCircle, Phone, Tv } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

const links = [
  ["Trang chủ", "/"],
  ["Giới thiệu", "/gioi-thieu"],
  ["Doanh nghiệp", "/doanh-nghiep"],
  ["Doanh nhân", "/doanh-nhan"],
  ["Sản phẩm", "/san-pham"],
  ["Tin tức", "/tin-tuc"],
  ["Liên hệ", "/lien-he"],
] as const;

export function SiteHeader({ content }: { content: SiteContent }) {
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand" aria-label="Trang chủ">
          <img
            src="/images/logo.jpg"
            alt={content.brandName}
            className="brand-logo-img"
            style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "8px", flexShrink: 0 }}
          />
          <span>
            <strong>{content.brandName}</strong>
            <small>{content.brandKicker}</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <a
          className="header-phone"
          href={`tel:${content.hotlineHref}`}
          style={{ background: "#d42027" }}
        >
          <Phone size={17} />
          <span>{content.hotline}</span>
        </a>
        <details className="mobile-menu">
          <summary aria-label="Mở menu">Menu</summary>
          <nav>
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            <Link href="/admin">Quản trị CMS</Link>
          </nav>
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
              src="/images/logo.jpg"
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
          <Link href="/#upcoming-events">Sự kiện sắp diễn ra</Link>
          <Link href="/#news-and-knowledge">Tin mới & Kiến thức</Link>
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
        style={{ background: "#d42027" }}
      >
        <Phone size={20} />
      </a>
      <a
        href={content.zaloUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat Zalo"
        style={{ background: "#0068ff" }}
      >
        <MessageCircle size={20} />
      </a>
      <a
        href={content.facebookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Mở Fanpage"
        style={{ background: "#1877f2" }}
      >
        <Globe2 size={20} />
      </a>
      <a
        href={content.mapUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Xem bản đồ"
        style={{ background: "#ea4335" }}
      >
        <MapPin size={20} />
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
