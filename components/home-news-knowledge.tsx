"use client";

import { useState } from "react";
import Link from "@/components/link";
import { ArrowRight, BookOpen, CalendarDays, Clock, Newspaper, Sparkles } from "lucide-react";
import type { KnowledgeItem, NewsItem } from "@/lib/site-content";

export function HomeNewsKnowledge({
  news,
  knowledge,
}: {
  news: NewsItem[];
  knowledge: KnowledgeItem[];
}) {
  const [activeTab, setActiveTab] = useState<"all" | "news" | "knowledge">("all");
  const visibleNews = (news || []).filter((item) => item.active !== false);
  const visibleKnowledge = (knowledge || []).filter((item) => item.active !== false);

  return (
    <section className="section news-knowledge-section" id="news-and-knowledge">
      <div className="site-container">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow" style={{ color: "#d42027" }}>CẬP NHẬT CHUYÊN MÔN</span>
            <h2>Tin Mới & Kiến Thức Truyền Thông</h2>
          </div>
          <div className="tab-buttons-group">
            <button
              type="button"
              className={`tab-filter-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`tab-filter-btn ${activeTab === "news" ? "active" : ""}`}
              onClick={() => setActiveTab("news")}
            >
              <Newspaper size={15} /> Tin mới ({visibleNews.length})
            </button>
            <button
              type="button"
              className={`tab-filter-btn ${activeTab === "knowledge" ? "active" : ""}`}
              onClick={() => setActiveTab("knowledge")}
            >
              <BookOpen size={15} /> Kiến thức ({visibleKnowledge.length})
            </button>
          </div>
        </div>

        <div className="dual-content-grid">
          {/* Cột Tin Mới */}
          {(activeTab === "all" || activeTab === "news") && (
            <div className={`content-column ${activeTab === "news" ? "full-width" : ""}`}>
              <div className="column-title-bar">
                <Newspaper size={20} className="column-icon" />
                <h3>TIN MỚI & HOẠT ĐỘNG</h3>
                <Link href="/tin-tuc" className="view-more-link">
                  Xem thêm <ArrowRight size={14} />
                </Link>
              </div>

              <div className="news-stack">
                {visibleNews.map((item, index) => {
                  const articleUrl = item.slug ? `/tin-tuc/${item.slug}` : (item.link || "/tin-tuc");
                  return (
                    <article className="news-feed-card has-thumb" key={item.id || index}>
                      {item.image ? (
                        <Link href={articleUrl} className="news-feed-thumb-link">
                          <img src={item.image} alt={item.title} className="news-feed-img" loading="lazy" />
                          <span className="news-feed-badge-overlay">{item.category}</span>
                        </Link>
                      ) : (
                        <div className={`news-feed-badge feed-badge-${index % 3}`}>
                          <span>{item.category}</span>
                        </div>
                      )}
                      <div className="news-feed-info">
                        <div className="news-feed-date">
                          <CalendarDays size={14} /> {item.date || "17.10.2026"}
                        </div>
                        <h4>
                          <Link href={articleUrl}>{item.title}</Link>
                        </h4>
                        <p>{item.excerpt}</p>
                        <Link href={articleUrl} className="read-more-text">
                          Đọc tiếp →
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cột Kiến Thức */}
          {(activeTab === "all" || activeTab === "knowledge") && (
            <div className={`content-column ${activeTab === "knowledge" ? "full-width" : ""}`}>
              <div className="column-title-bar">
                <BookOpen size={20} className="column-icon" />
                <h3>KIẾN THỨC & CẨM NANG</h3>
                <Link href="/tin-tuc" className="view-more-link">
                  Xem thêm <ArrowRight size={14} />
                </Link>
              </div>

              <div className="knowledge-stack">
                {visibleKnowledge.map((item, index) => (
                  <article className="knowledge-card" key={item.id || index}>
                    <div className="knowledge-card-top">
                      <span className="knowledge-category">{item.category}</span>
                      <span className="knowledge-read-time">
                        <Clock size={13} /> {item.readTime}
                      </span>
                    </div>
                    <h4>
                      <Link href={item.link || "/tin-tuc"}>{item.title}</Link>
                    </h4>
                    <p>{item.excerpt}</p>
                    <div className="knowledge-card-bottom">
                      <span className="knowledge-date">
                        <CalendarDays size={13} /> {item.date}
                      </span>
                      <Link href={item.link || "/tin-tuc"} className="read-more-text">
                        Xem chi tiết →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
