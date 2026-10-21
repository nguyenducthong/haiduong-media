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
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter({ content }: { content: SiteContent }) {
  const brandName = content.brandName || "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM";
  const hotline = content.hotline || "0931 538 666";
  const hotlineHref = content.hotlineHref || "0931538666";
  const email = content.email || "bantochuc.thuonghieu2009@gmail.com";
  const address = content.address || "89 Lê Đức Thọ, Mỹ Đình 2, Hà Nội";
  const zaloUrl = content.zaloUrl || "https://zalo.me/0931538666";
  const facebookUrl = content.facebookUrl || "https://www.facebook.com/haiduongmedia";

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main-grid">
            {/* Cột 1: Thông tin thương hiệu */}
            <div className="footer-col-brand">
              <div className="footer-brand-header">
                <div className="footer-logo-badge">
                  <img
                    src="/images/logo.png"
                    alt={brandName}
                    className="footer-logo-img"
                  />
                </div>
                <h3 className="footer-brand-title">{brandName}</h3>
              </div>
              <p className="footer-brand-desc">
                Đơn vị tư vấn chiến lược truyền thông, sản xuất phim quảng cáo và kết nối doanh nghiệp với các chương trình truyền hình, báo chí.
              </p>
              <div className="footer-brand-tagline">
                Đồng hành cùng giá trị thương hiệu Việt
              </div>
            </div>

            {/* Cột 2: VỀ CHÚNG TÔI */}
            <div className="footer-col-nav">
              <h4 className="footer-col-title">VỀ CHÚNG TÔI</h4>
              <nav className="footer-links-list" aria-label="Về chúng tôi">
                <Link href="/gioi-thieu">Giới thiệu</Link>
                <Link href="/#vtv-commercials">Năng lực truyền thông</Link>
                <Link href="/su-kien">Chương trình vinh danh</Link>
                <Link href="/tin-tuc">Tin tức & hoạt động</Link>
                <Link href="/doanh-nghiep">Đối tác doanh nghiệp</Link>
              </nav>
            </div>

            {/* Cột 3: DỊCH VỤ */}
            <div className="footer-col-nav">
              <h4 className="footer-col-title">DỊCH VỤ</h4>
              <nav className="footer-links-list" aria-label="Dịch vụ">
                <Link href="/#vtv-commercials">Truyền thông VTV</Link>
                <Link href="/#press-coverage">Báo chí & PR</Link>
                <Link href="/#vtv-commercials">Sản xuất phim quảng cáo</Link>
                <Link href="/su-kien">Vinh danh thương hiệu</Link>
                <Link href="/lien-he">Tư vấn hợp tác</Link>
              </nav>
            </div>

            {/* Cột 4: LIÊN HỆ */}
            <div className="footer-col-contact">
              <h4 className="footer-col-title">LIÊN HỆ</h4>
              <div className="footer-contact-info">
                <a href={`tel:${hotlineHref}`} className="footer-contact-link footer-contact-hotline">
                  Hotline: {hotline}
                </a>
                <a href={`mailto:${email}`} className="footer-contact-link">
                  {email}
                </a>
                <p className="footer-contact-address">
                  {address}
                </p>
                <div className="footer-social-row">
                  <a
                    href={zaloUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn footer-social-zalo"
                    aria-label="Chat Zalo"
                    title="Zalo"
                  >
                    <MessageCircle size={16} />
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn footer-social-fb"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href={`tel:${hotlineHref}`}
                    className="footer-social-btn footer-social-phone"
                    aria-label="Gọi điện thoại"
                    title="Hotline"
                  >
                    <Phone size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Dòng phân cách và chân trang */}
          <div className="footer-bottom-bar">
            <div className="footer-bottom-left">
              <div>© 2026 {brandName}. Bảo lưu mọi quyền.</div>
              <div className="footer-bottom-sub">Chính sách bảo mật • Điều khoản sử dụng</div>
            </div>
            <div className="footer-bottom-right">
              Kết nối giá trị – Nâng tầm thương hiệu
            </div>
          </div>
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
