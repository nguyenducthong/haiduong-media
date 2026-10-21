"use client";

import { useState } from "react";
import { Play, Tv, X } from "lucide-react";
import type { VtvCommercial } from "@/lib/site-content";

export function HomeVtvSection({
  commercials,
  badge,
  title,
  description,
}: {
  commercials: VtvCommercial[];
  badge?: string;
  title?: string;
  description?: string;
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const visibleCommercials = (commercials || []).filter((item) => item.active !== false);

  const displayBadge = badge ?? "TRUYỀN HÌNH QUỐC GIA & ĐÀI LỚN";
  const displayTitle = title ?? "Sản Xuất Phim Quảng Cáo Trên VTV";
  const displayDesc =
    description ??
    "Đơn vị đối tác chiến lược sản xuất TVC, phim tự giới thiệu doanh nghiệp và booking phát sóng các khung giờ vàng trên các kênh VTV1, VTV3, VTV6, HTV9, HTV7, HN1 và THVL.";

  return (
    <section className="section vtv-section" id="vtv-commercials">
      <div className="site-container">
        <div className="vtv-header-box">
          {displayBadge ? (
            <div className="vtv-eyebrow-badge">
              <Tv size={16} /> {displayBadge}
            </div>
          ) : null}
          {displayTitle ? <h2>{displayTitle}</h2> : null}
          {displayDesc ? <p className="vtv-header-desc">{displayDesc}</p> : null}
        </div>

        {/* Video Grid */}
        <div className="vtv-video-grid">
          {visibleCommercials.map((item, index) => (
            <article className="vtv-card" key={index}>
              <div className="vtv-thumb-wrapper">
                <iframe
                  className="vtv-iframe"
                  src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="vtv-card-content">
                <div className="vtv-card-meta">
                  <span className="vtv-channel-tag">{item.channel}</span>
                  <span className="vtv-program-tag">{item.program}</span>
                  <span className="vtv-slot-text">{item.timeSlot}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="vtv-card-footer">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(item.youtubeId)}
                    className="vtv-play-btn"
                  >
                    <Play size={14} fill="currentColor" /> Xem phóng to
                  </button>
                  <a href="/lien-he" className="vtv-quote-link">
                    Báo giá phát sóng →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeVideo && (
          <div className="video-lightbox" onClick={() => setActiveVideo(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lightbox-close"
                onClick={() => setActiveVideo(null)}
                aria-label="Đóng video"
              >
                <X size={24} />
              </button>
              <div className="lightbox-video-frame">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                  title="Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
