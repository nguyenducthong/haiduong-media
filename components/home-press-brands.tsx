import Link from "@/components/link";
import { ArrowUpRight, Award, ExternalLink, Handshake, HeartHandshake, Quote, Star, Users } from "lucide-react";
import type { BrandItem, PressItem, TestimonialItem } from "@/lib/site-content";

export function HomePressBrands({
  press,
  brands,
  partners,
  clients,
  testimonials,
}: {
  press: PressItem[];
  brands: BrandItem[];
  partners: string[];
  clients: string[];
  testimonials: TestimonialItem[];
}) {
  const visiblePress = (press || []).filter((item) => item.active !== false);
  const visibleBrands = (brands || []).filter((item) => item.active !== false);
  const visibleTestimonials = (testimonials || []).filter((item) => item.active !== false);

  return (
    <>
      {/* 1. BÁO CHÍ NÓI VỀ CHÚNG TÔI */}
      <section className="section press-section" id="press-coverage">
        <div className="site-container">
          <div className="section-heading centered">
            <span className="eyebrow" style={{ color: "#d42027" }}>TRUYỀN THÔNG ĐƯA TIN</span>
            <h2>Báo Chí Nói Về Chúng Tôi</h2>
            <p className="section-subtitle">
              Sự ghi nhận từ các cơ quan thông tấn và báo chí uy tín hàng đầu Việt Nam về hành trình hơn một thập kỷ
              đồng hành cùng doanh nghiệp Việt.
            </p>
          </div>

          <div className="press-grid">
            {visiblePress.map((item, index) => (
              <article className="press-card" key={item.id || index}>
                <div className="press-header">
                  <div className="press-outlet-badge">
                    <span>{item.newspaper}</span>
                  </div>
                  <span className="press-date">{item.date}</span>
                </div>

                <h3 className="press-title">{item.title}</h3>

                <blockquote className="press-quote">
                  <Quote size={20} className="press-quote-icon" />
                  <p>"{item.quote}"</p>
                </blockquote>

                <div className="press-card-footer">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press-link"
                  >
                    Xem bài viết trên {item.newspaper} <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THƯƠNG HIỆU CỦA CHÚNG TÔI */}
      <section className="section brands-ecosystem-section" id="our-brands">
        <div className="site-container">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow" style={{ color: "#d42027" }}>HỆ SINH THÁI ĐA KÊNH</span>
              <h2>Thương Hiệu Của Chúng Tôi</h2>
            </div>
            <p>
              Các ấn phẩm tạp chí doanh nhân, trang tin chuyên ngành và nền tảng truyền thông uy tín với sức lan tỏa rộng khắp.
            </p>
          </div>

          <div className="brands-grid">
            {visibleBrands.map((brand, index) => (
              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-card"
                key={brand.id || index}
              >
                <div className="brand-card-top">
                  <div className="brand-icon-box">
                    <span>{brand.name.charAt(0)}</span>
                  </div>
                  <span className="brand-category-pill">{brand.category}</span>
                </div>
                <h3>{brand.name}</h3>
                <p>{brand.description}</p>
                <div className="brand-link-row">
                  <span>Khám phá ấn phẩm</span>
                  <ArrowUpRight size={16} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ĐỐI TÁC CỦA CHÚNG TÔI */}
      <section className="section partners-strip-section" id="our-partners">
        <div className="site-container">
          <div className="section-heading centered">
            <span className="eyebrow" style={{ color: "#d42027" }}>MẠNG LƯỚI TRUYỀN THÔNG</span>
            <h2>Đối Tác Của Chúng Tôi</h2>
            <p className="section-subtitle">
              Hợp tác chiến lược cùng các đài truyền hình, đài phát thanh và hơn 200 cơ quan báo chí điện tử lớn nhất cả nước.
            </p>
          </div>

          <div className="partners-grid-showcase">
            {partners.map((partner, index) => (
              <div className="partner-logo-item" key={index}>
                <Handshake size={20} className="partner-icon" />
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KHÁCH HÀNG CỦA CHÚNG TÔI & LỜI CHỨNG THỰC */}
      <section className="section clients-section" id="our-clients">
        <div className="site-container">
          <div className="section-heading centered">
            <span className="eyebrow" style={{ color: "#d42027" }}>KHÁCH HÀNG & ĐỐI TÁC ĐỒNG HÀNH</span>
            <h2>Khách Hàng Nói Về Chúng Tôi</h2>
            <p className="section-subtitle">
              Niềm tin của hàng ngàn thương hiệu hàng đầu Việt Nam chính là thước đo giá trị cao quý nhất cho sự tận tâm và chuyên nghiệp của chúng tôi.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="testimonials-grid">
            {visibleTestimonials.map((testi, index) => (
              <article className="testimonial-card" key={testi.id || index}>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#ffb400" color="#ffb400" />
                  ))}
                </div>
                <blockquote className="testimonial-body">
                  <p>"{testi.quote}"</p>
                </blockquote>
                <div className="testimonial-author">
                  <div className="author-avatar">{testi.avatarText}</div>
                  <div className="author-details">
                    <strong>{testi.name}</strong>
                    <small>{testi.title}</small>
                    <span className="author-company">{testi.company}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Client Logos / Names */}
          <div className="client-names-wrap">
            <span className="client-names-title">CÁC DOANH NGHIỆP TIÊU BIỂU:</span>
            <div className="client-tags-list">
              {clients.map((client, index) => (
                <span className="client-tag" key={index}>
                  ✓ {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
