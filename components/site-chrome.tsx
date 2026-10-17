import Link from "next/link";
import { ArrowUpRight, Globe2, MapPin, MessageCircle, Phone } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

const links = [["Trang chủ", "/"], ["Giới thiệu", "/gioi-thieu"], ["Dịch vụ", "/dich-vu"], ["Tin tức", "/tin-tuc"], ["Liên hệ", "/lien-he"]] as const;

export function SiteHeader({ content }: { content: SiteContent }) {
  return <header className="site-header"><div className="site-container header-inner">
    <Link href="/" className="brand" aria-label="Trang chủ"><span className="brand-mark">HD</span><span><strong>{content.brandName}</strong><small>{content.brandKicker}</small></span></Link>
    <nav className="desktop-nav" aria-label="Điều hướng chính">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
    <a className="header-phone" href={`tel:${content.hotlineHref}`}><Phone size={17}/><span>{content.hotline}</span></a>
    <details className="mobile-menu"><summary aria-label="Mở menu">Menu</summary><nav>{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/admin">Quản trị</Link></nav></details>
  </div></header>;
}

export function SiteFooter({ content }: { content: SiteContent }) {
  return <footer className="site-footer"><div className="site-container footer-grid">
    <div><div className="brand footer-brand"><span className="brand-mark">HD</span><span><strong>{content.brandName}</strong><small>{content.brandKicker}</small></span></div><p>{content.footerNote}</p></div>
    <div><h3>Khám phá</h3>{links.slice(1).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
    <div><h3>Liên hệ</h3><a href={`tel:${content.hotlineHref}`}>{content.hotline}</a><a href={`mailto:${content.email}`}>{content.email}</a><span>{content.address}</span></div>
    <div><h3>Quản lý website</h3><Link href="/admin" className="admin-link">Mở trang quản trị <ArrowUpRight size={15}/></Link></div>
  </div><div className="site-container footer-bottom">© 2026 {content.brandName}. Bản website mẫu.</div></footer>;
}

export function FloatingContact({ content }: { content: SiteContent }) {
  return <div className="floating-contact" aria-label="Liên hệ nhanh"><a href={`tel:${content.hotlineHref}`} aria-label="Gọi điện"><Phone size={20}/></a><a href={content.zaloUrl} target="_blank" rel="noreferrer" aria-label="Chat Zalo"><MessageCircle size={20}/></a><a href={content.facebookUrl} target="_blank" rel="noreferrer" aria-label="Mở Fanpage"><Globe2 size={20}/></a><a href={content.mapUrl} target="_blank" rel="noreferrer" aria-label="Xem bản đồ"><MapPin size={20}/></a></div>;
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-hero"><div className="site-container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>;
}
