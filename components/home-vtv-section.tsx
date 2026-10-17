"use client";

import { useState } from "react";
import { CheckCircle2, Clapperboard, Play, Sparkles, Tv, Volume2, X } from "lucide-react";
import type { VtvCommercial } from "@/lib/site-content";

export function HomeVtvSection({ commercials }: { commercials: VtvCommercial[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const visibleCommercials = (commercials || []).filter((item) => item.active !== false);

  return (
    <section className="section vtv-section" id="vtv-commercials">
      <div className="site-container">
        <div className="vtv-header-box">
          <div className="vtv-eyebrow-badge">
            <Tv size={16} /> TRUYỀN HÌNH QUỐC GIA & ĐÀI LỚN
          </div>
          <h2>Sản Xuất Phim Quảng Cáo Trên VTV</h2>
          <p className="vtv-header-desc">
            Hải Dương Media tự hào là đối tác chiến lược sản xuất TVC, phim tự giới thiệu doanh nghiệp và booking
            phát sóng các khung giờ vàng trên các kênh VTV1, VTV3, VTV6, HTV9, HTV7, HN1 và THVL.
          </p>
        </div>

        {/* Highlight Broadcast Badges */}
        <div className="vtv-specs-grid">
          <div className="vtv-spec-card">
            <span className="vtv-spec-icon"><Clapperboard size={22} /></span>
            <div>
              <strong>Chuẩn điện ảnh 4K / UHD</strong>
              <small>Hệ thống máy quay RED, ARRI cinema camera sắc nét từng khung hình.</small>
            </div>
          </div>
          <div className="vtv-spec-card">
            <span className="vtv-spec-icon"><Volume2 size={22} /></span>
            <div>
              <strong>Âm thanh EBU R128</strong>
              <small>Đạt tiêu chuẩn kỹ thuật âm lượng phát thanh truyền hình nghiêm ngặt.</small>
            </div>
          </div>
          <div className="vtv-spec-card">
            <span className="vtv-spec-icon"><CheckCircle2 size={22} /></span>
            <div>
              <strong>100% Giấy phép & Duyệt đài</strong>
              <small>Hỗ trợ xin giấy phép quảng cáo, hồ sơ pháp lý và thẩm duyệt của VTV.</small>
            </div>
          </div>
          <div className="vtv-spec-card">
            <span className="vtv-spec-icon"><Sparkles size={22} /></span>
            <div>
              <strong>Khung giờ vàng uy tín</strong>
              <small>Phủ sóng trước Thời sự 19h VTV1, Chuyển động 24h, Thông tin 260 VTV3.</small>
            </div>
          </div>
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
