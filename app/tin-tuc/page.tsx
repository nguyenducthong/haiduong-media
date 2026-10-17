import Link from "next/link";
import { ArrowRight, CalendarDays, User, Tag } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const content = await loadSiteContent();
  const visibleNews = (content.news || []).filter((item) => item.active !== false);

  // Extract distinct categories
  const categories = Array.from(new Set(visibleNews.map((n) => n.category).filter(Boolean)));

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow="TIN TỨC & CHUYÊN MÔN"
          title="Góc Nhìn Thực Tế Về Truyền Thông & Thương Hiệu"
          description="Nội dung chuyên sâu, cập nhật hoạt động mới nhất cùng kiến thức thực chiến dành cho doanh nghiệp trong kỷ nguyên số."
        />

        <section className="section" style={{ paddingTop: "40px", paddingBottom: "90px" }}>
          <div className="site-container">
            {/* Category pills */}
            {categories.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "36px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginRight: "6px",
                  }}
                >
                  Chuyên mục:
                </span>
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: "#0f172a",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Tất cả ({visibleNews.length})
                </span>
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      background: "#f1f5f9",
                      color: "#334155",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "1px solid var(--line)",
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Article list */}
            <div className="article-list">
              {visibleNews.map((item, index) => {
                const url = item.slug ? `/tin-tuc/${item.slug}` : (item.link || "#");
                return (
                  <article key={item.id || `${item.title}-${index}`}>
                    {/* Thumbnail container - strictly constrained */}
                    <Link
                      href={url}
                      className={`article-thumb cover-${(index % 3) + 1}`}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        display: "block",
                        width: "100%",
                        height: "230px",
                        minHeight: "230px",
                        maxHeight: "230px",
                        borderRadius: "16px",
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            inset: 0,
                            display: "block",
                          }}
                        />
                      ) : null}
                      <span
                        style={{
                          position: "absolute",
                          top: "14px",
                          left: "14px",
                          zIndex: 2,
                          padding: "5px 12px",
                          borderRadius: "999px",
                          color: "#fff",
                          background: "rgba(15, 23, 42, 0.8)",
                          fontSize: "11px",
                          fontWeight: 800,
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {item.category}
                      </span>
                    </Link>

                    {/* Article Details */}
                    <div>
                      <small style={{ display: "flex", alignItems: "center", gap: "14px", color: "var(--muted)", fontSize: "13px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                          <CalendarDays size={14} color="#d42027" /> {item.date || "17.10.2026"}
                        </span>
                        <span>•</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                          <User size={14} /> {item.author || "Ban Biên Tập"}
                        </span>
                      </small>

                      <h2 style={{ margin: "12px 0 10px", fontSize: "22px", lineHeight: 1.35, fontWeight: 800 }}>
                        <Link href={url} style={{ color: "#0f172a", textDecoration: "none" }}>
                          {item.title}
                        </Link>
                      </h2>

                      <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "14px", marginBottom: "16px" }}>
                        {item.excerpt}
                      </p>

                      <Link
                        href={url}
                        className="article-tag"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#d42027",
                          fontWeight: 800,
                          fontSize: "13px",
                          textDecoration: "none",
                        }}
                      >
                        Đọc toàn bộ bài viết <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}

