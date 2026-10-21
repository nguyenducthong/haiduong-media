"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Tv } from "lucide-react";
import type { BannerSlide } from "@/lib/site-content";

export function HeroBannerSlider({ slides }: { slides: BannerSlide[] }) {
  const activeSlides = (slides || []).filter((s) => s.active !== false);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = activeSlides.length;

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused]);

  if (total === 0) return null;

  const currentIdx = current % total;

  const goToSlide = (idx: number) => {
    setCurrent(((idx % total) + total) % total);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  return (
    <section
      className="banner-slider-section"
      aria-label="Hero Banner Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="banner-slide-wrapper">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIdx;
          const hasTextContent = Boolean(slide.title || slide.description || slide.highlight);

          return (
            <div
              key={slide.id || idx}
              className={`banner-slide-item ${isActive ? "active" : ""}`}
              aria-hidden={!isActive}
            >
              {/* Background layer with subtle cinematic zoom */}
              <div
                className="banner-bg-layer"
                style={{
                  backgroundImage: slide.bgImage ? `url(${slide.bgImage})` : undefined,
                }}
              >
                {hasTextContent && (
                  <>
                    <div className="banner-overlay-dark" />
                    <div className="banner-overlay-gradient" />
                  </>
                )}
              </div>

              {/* Content layer with smooth entrance animation */}
              {hasTextContent ? (
                <div className="site-container banner-content-container">
                  {(slide.tag || slide.badge) && (
                    <div className="banner-badge-row anim-item anim-1">
                      {slide.tag && (
                        <span className="banner-tag">
                          <Sparkles size={13} className="banner-icon-spin" /> {slide.tag}
                        </span>
                      )}
                      {slide.badge && (
                        <span className="banner-sub-badge">
                          <ShieldCheck size={13} /> {slide.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {slide.title && (
                    <h1 className="banner-title anim-item anim-2">{slide.title}</h1>
                  )}

                  {(slide.highlight || slide.description) && (
                    <div className="banner-text-block anim-item anim-3">
                      {slide.highlight && (
                        <p className="banner-highlight">{slide.highlight}</p>
                      )}
                      {slide.description && (
                        <p className="banner-desc">{slide.description}</p>
                      )}
                    </div>
                  )}

                  <div className="banner-cta-group anim-item anim-4">
                    {slide.ctaHref && (
                      <a href={slide.ctaHref} className="banner-btn banner-btn-primary">
                        {slide.ctaText || "Khám phá ngay"} <ArrowRight size={17} />
                      </a>
                    )}
                    {slide.secondaryCtaText !== "" && (
                      <a href={slide.secondaryCtaHref || "#vtv-commercials"} className="banner-btn banner-btn-glass">
                        <Tv size={16} /> {slide.secondaryCtaText || "Xem mẫu phim VTV"}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <a
                  href={slide.ctaHref || "#"}
                  className="banner-image-link"
                  aria-label={slide.title || "Banner"}
                />
              )}
            </div>
          );
        })}

        {/* Navigation Controls: Animated dot progress bars & arrows */}
        {total > 1 && (
          <div className="banner-controls-container site-container">
            <div className="banner-indicators">
              <div className="banner-dots">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`banner-dot-bar ${idx === currentIdx ? "active" : ""}`}
                    aria-label={`Slide ${idx + 1}`}
                  >
                    <span className="dot-progress-fill" />
                  </button>
                ))}
              </div>

              <div className="banner-nav-arrows">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="banner-arrow-btn"
                  aria-label="Slide trước"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="banner-arrow-btn"
                  aria-label="Slide tiếp theo"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
