import Link from "next/link";
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
} from "lucide-react";
import { FloatingContact, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const serviceIcons = [Megaphone, Clapperboard, Sparkles, ChartNoAxesCombined, Palette, PenTool];

export default async function Home() {
  const content = await loadSiteContent();

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="hero-section">
          <div className="site-container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">{content.heroEyebrow}</span>
              <h1>{content.heroTitle}</h1>
              <p>{content.heroDescription}</p>
              <div className="hero-actions">
                <Link href="/lien-he" className="button button-primary">
                  {content.primaryCta} <ArrowRight size={18} />
                </Link>
                <Link href="/dich-vu" className="button button-ghost">
                  {content.secondaryCta}
                </Link>
              </div>
            </div>
            <div className="hero-visual" aria-label="Minh họa chiến dịch truyền thông">
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
              <div className="hero-card hero-card-main">
                <span className="visual-label">BRAND GROWTH</span>
                <strong>+128%</strong>
                <small>Mức độ nhận diện</small>
                <div className="chart-bars">
                  {[36, 51, 45, 70, 64, 88].map((height) => (
                    <i key={height} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="hero-card hero-card-note">
                <BadgeCheck size={22} />
                <span><b>Chiến lược rõ ràng</b><small>Nội dung đúng điểm chạm</small></span>
              </div>
              <div className="hero-badge">MEDIA<br />STUDIO</div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="site-container trust-grid">
            <strong>Chiến lược</strong><span>•</span><strong>Sáng tạo</strong><span>•</span>
            <strong>Đa nền tảng</strong><span>•</span><strong>Đo lường</strong>
          </div>
        </section>

        <section className="section services-section">
          <div className="site-container">
            <div className="section-heading split-heading">
              <div><span className="eyebrow">Dịch vụ nổi bật</span><h2>Giải pháp truyền thông toàn diện</h2></div>
              <p>Từ ý tưởng đến triển khai, mọi hạng mục được kết nối thành một trải nghiệm nhất quán cho khách hàng của bạn.</p>
            </div>
            <div className="service-grid">
              {content.services.map((service, index) => {
                const Icon = serviceIcons[index] ?? Sparkles;
                return <article className="service-card" key={`${service.title}-${index}`}>
                  <span className="service-number">0{index + 1}</span>
                  <div className="service-icon"><Icon size={26} /></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link href="/lien-he" aria-label={`Tìm hiểu ${service.title}`}>Tìm hiểu thêm <ArrowRight size={16} /></Link>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="section story-section">
          <div className="site-container story-grid">
            <div className="story-visual"><span>IDEA</span><strong>→</strong><span>IMPACT</span></div>
            <div className="story-copy">
              <span className="eyebrow light">Về chúng tôi</span>
              <h2>{content.aboutTitle}</h2>
              <p>{content.aboutBody}</p>
              <div className="story-stat"><strong>01</strong><span>Đầu mối đồng hành xuyên suốt từ chiến lược đến thực thi.</span></div>
              <Link href="/gioi-thieu" className="text-link">Tìm hiểu đội ngũ <ArrowRight size={17} /></Link>
            </div>
          </div>
        </section>

        <section className="section process-section">
          <div className="site-container">
            <div className="section-heading centered"><span className="eyebrow">Quy trình triển khai</span><h2>Đơn giản, minh bạch và dễ theo dõi</h2></div>
            <div className="process-grid">
              {["Hiểu mục tiêu", "Xây chiến lược", "Sáng tạo & triển khai", "Đo lường & tối ưu"].map((step, index) => (
                <div className="process-step" key={step}><span>{index + 1}</span><h3>{step}</h3><p>{["Lắng nghe bài toán, khách hàng và nguồn lực hiện có.", "Chọn thông điệp, kênh truyền thông và kế hoạch phù hợp.", "Sản xuất nội dung, thiết kế và vận hành chiến dịch.", "Theo dõi chỉ số, báo cáo và cải thiện hiệu quả."][index]}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section news-section">
          <div className="site-container">
            <div className="section-heading split-heading"><div><span className="eyebrow">Góc chia sẻ</span><h2>Tin tức & kiến thức</h2></div><Link href="/tin-tuc" className="text-link dark">Xem tất cả <ArrowRight size={17} /></Link></div>
            <div className="news-grid">
              {content.news.map((item, index) => <article className="news-card" key={`${item.title}-${index}`}>
                <div className={`news-cover cover-${index + 1}`}><span>{item.category}</span></div>
                <div className="news-body"><small><CalendarDays size={14} /> 17.10.2026</small><h3>{item.title}</h3><p>{item.excerpt}</p><Link href="/tin-tuc">Đọc bài viết <ArrowRight size={15} /></Link></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="cta-section"><div className="site-container cta-inner"><div><span className="eyebrow light">Bắt đầu một dự án mới</span><h2>Để thương hiệu của bạn tạo nên khác biệt.</h2></div><Link href="/lien-he" className="button button-light">Trao đổi ngay <ArrowRight size={18} /></Link></div></section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
