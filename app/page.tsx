import Link from "@/components/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChartNoAxesCombined,
  Clapperboard,
  Megaphone,
  Palette,
  PenTool,
  Sparkles,
  Tv,
} from "lucide-react";
import { FloatingContact, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { HeroBannerSlider } from "@/components/home-banner-slider";
import { HomeVtvSection } from "@/components/home-vtv-section";
import { HomeEventsSection } from "@/components/home-events-section";
import { HomeNewsKnowledge } from "@/components/home-news-knowledge";
import { HomePressBrands } from "@/components/home-press-brands";
import { loadSiteContent } from "@/lib/site-content";
import { getAllEvents } from "@/lib/enterprises";

export const dynamic = "force-dynamic";

const serviceIcons = [Tv, Clapperboard, Megaphone, Sparkles, ChartNoAxesCombined, Palette];

export default async function Home() {
  const [content, allEvents] = await Promise.all([
    loadSiteContent(),
    getAllEvents(),
  ]);

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    banner: () => <HeroBannerSlider key="banner" slides={content.bannerSlides} />,
    trust: () => (
      <section key="trust" className="trust-strip">
        <div className="site-container trust-grid">
          <strong>11+ Năm Kinh Nghiệm</strong>
          <span>•</span>
          <strong>3.000+ Thương Hiệu Đồng Hành</strong>
          <span>•</span>
          <strong>150+ TVC Phát Sóng VTV/HTV</strong>
          <span>•</span>
          <strong>200+ Đầu Báo Mạng Hàng Đầu</strong>
        </div>
      </section>
    ),
    vtv: () => <HomeVtvSection key="vtv" commercials={content.vtvCommercials} />,
    events: () => <HomeEventsSection key="events" events={allEvents} />,
    services: () => (
      <section key="services" className="section services-section" id="dich-vu-chinh">
        <div className="site-container">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow" style={{ color: "#d42027" }}>GIẢI PHÁP ĐỒNG BỘ</span>
              <h2>Dịch Vụ Của Chúng Tôi</h2>
            </div>
            <p>
              Từ chiến lược thương hiệu, sản xuất phim quảng cáo TVC, booking báo chí đài truyền hình đến tổ chức sự kiện
              và bảo trợ truyền thông toàn diện.
            </p>
          </div>
          <div className="service-grid">
            {content.services.map((service, index) => {
              const Icon = serviceIcons[index] ?? Sparkles;
              return (
                <article className="service-card" key={`${service.title}-${index}`}>
                  <span className="service-number">0{index + 1}</span>
                  <div className="service-icon">
                    <Icon size={26} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link href="/lien-he" aria-label={`Tìm hiểu ${service.title}`}>
                    Nhận tư vấn chi tiết <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    ),
    news: () => <HomeNewsKnowledge key="news" news={content.news} knowledge={content.knowledge} />,
    about: () => (
      <section key="about" className="section story-section" id="gioi-thieu">
        <div className="site-container story-grid">
          <div className="story-visual">
            <span>CHIẾN LƯỢC</span>
            <strong>→</strong>
            <span>HIỆU QUẢ</span>
          </div>
          <div className="story-copy">
            <span className="eyebrow light">VỀ CHÚNG TÔI</span>
            <h2>{content.aboutTitle}</h2>
            <p>{content.aboutBody}</p>
            <div className="story-stat">
              <strong>11+</strong>
              <span>Năm tâm huyết xây dựng và nâng tầm thương hiệu Việt vươn ra thị trường khu vực.</span>
            </div>
            <Link href="/gioi-thieu" className="text-link">
              Tìm hiểu thêm về Hải Dương Media <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    ),
    press: () => (
      <HomePressBrands
        key="press"
        press={content.press}
        brands={content.brands}
        partners={content.partners}
        clients={content.clients}
        testimonials={content.testimonials}
      />
    ),
    process: () => (
      <section key="process" className="section process-section">
        <div className="site-container">
          <div className="section-heading centered">
            <span className="eyebrow" style={{ color: "#d42027" }}>
              {content.processEyebrow || "QUY TRÌNH CHUẨN MỰC"}
            </span>
            <h2>{content.processTitle || "Đơn Giản, Minh Bạch & Đúng Tiến Độ Phát Sóng"}</h2>
          </div>
          <div className="process-grid">
            {(content.processSteps || []).map((step, index) => (
              <div className="process-step" key={step.title || index}>
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    cta: () => (
      <section key="cta" className="cta-section">
        <div className="site-container cta-inner">
          <div>
            <span className="eyebrow light">
              {content.ctaEyebrow || "BẮT ĐẦU CHIẾN DỊCH TRUYỀN THÔNG MỚI"}
            </span>
            <h2>
              {content.ctaTitle ||
                "Đưa thương hiệu của bạn tỏa sáng trên sóng truyền hình quốc gia và báo chí hàng đầu."}
            </h2>
          </div>
          <Link href={content.ctaButtonHref || "/lien-he"} className="button button-light">
            {content.ctaButtonText || "Liên hệ tư vấn ngay"} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    ),
  };

  const activeSections = content.homepageSections || [
    { id: "banner", name: "Banner Slider nổi bật", enabled: true },
    { id: "trust", name: "Chỉ số niềm tin & Thành tựu", enabled: true },
    { id: "vtv", name: "Sản xuất phim quảng cáo trên VTV", enabled: true },
    { id: "events", name: "Danh mục sự kiện sắp diễn ra", enabled: true },
    { id: "services", name: "Dịch vụ & Sản phẩm chủ lực", enabled: true },
    { id: "news", name: "Tin mới & Kiến thức", enabled: true },
    { id: "about", name: "Về chúng tôi (Giới thiệu Hải Dương Media)", enabled: true },
    { id: "press", name: "Báo chí, Thương hiệu & Đối tác", enabled: true },
    { id: "process", name: "Quy trình triển khai 4 bước", enabled: true },
    { id: "cta", name: "Khối kêu gọi hợp tác (CTA)", enabled: true },
  ];

  return (
    <>
      <SiteHeader content={content} />
      <main>
        {activeSections.map((sec) => {
          if (!sec.enabled) return null;
          const render = sectionRenderers[sec.id];
          return render ? render() : null;
        })}
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
