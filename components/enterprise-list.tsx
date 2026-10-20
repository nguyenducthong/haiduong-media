"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "@/components/link";
import {
  CalendarDays,
  Eye,
  Search,
  Building2,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import type { EnterpriseArticle } from "@/lib/enterprises-types";

interface EnterpriseListProps {
  initialArticles: EnterpriseArticle[];
  basePath?: string;
  searchPlaceholder?: string;
  title?: string;
  pageSize?: number;
}

export function EnterpriseList({
  initialArticles,
  basePath = "/doanh-nghiep",
  searchPlaceholder = "Tìm kiếm bài viết...",
  title = "Danh sách bài viết",
  pageSize = 9,
}: EnterpriseListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setSearchTerm(q);
      }
    }
  }, []);

  // Extract unique categories (only non-empty ones)
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialArticles.forEach((a) => {
      if (a.category && a.category.trim()) {
        set.add(a.category.trim());
      }
    });
    return Array.from(set);
  }, [initialArticles]);

  // Filtered list
  const filtered = useMemo(() => {
    return initialArticles.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [initialArticles, searchTerm, selectedCategory]);

  // Reset page to 1 when search or category changes
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedArticles = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (containerRef.current) {
      const top = containerRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Generate pagination items
  const paginationRange = useMemo(() => {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= safePage - delta && i <= safePage + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  }, [totalPages, safePage]);

  const getArticleUrl = (item: EnterpriseArticle) => {
    if (item.slug) {
      return `${basePath}/${item.slug}`;
    }
    return item.link || item.sourceUrl || "#";
  };

  return (
    <div className="enterprise-container" ref={containerRef}>
      {/* Search and Filters Bar */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#f8fafc",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            padding: "10px 16px",
          }}
        >
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "15px",
              width: "100%",
              color: "#0f172a",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
              style={{
                border: "none",
                background: "transparent",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Xóa
            </button>
          )}
        </div>

        {/* Category Pills (only if multiple categories exist) */}
        {categories.length > 1 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginRight: "4px",
              }}
            >
              <Filter size={14} /> Chuyên mục:
            </span>

            <button
              onClick={() => handleCategorySelect("all")}
              style={{
                padding: "7px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                border:
                  selectedCategory === "all"
                    ? "1px solid #d42027"
                    : "1px solid var(--line)",
                background: selectedCategory === "all" ? "#d42027" : "#fff",
                color: selectedCategory === "all" ? "#fff" : "#334155",
              }}
            >
              Tất cả ({initialArticles.length})
            </button>

            {categories.map((cat) => {
              const count = initialArticles.filter((a) => a.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: isSelected
                      ? "1px solid #d42027"
                      : "1px solid var(--line)",
                    background: isSelected ? "#d42027" : "#fff",
                    color: isSelected ? "#fff" : "#334155",
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Header Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#0f172a",
            margin: 0,
          }}
        >
          {title}{" "}
          <span style={{ color: "#d42027", fontSize: "16px" }}>
            ({filtered.length})
          </span>
        </h3>

        {filtered.length > 0 && (
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>
            Hiển thị{" "}
            <strong>
              {(safePage - 1) * pageSize + 1} -{" "}
              {Math.min(safePage * pageSize, filtered.length)}
            </strong>{" "}
            trong tổng số <strong>{filtered.length}</strong> bài viết
          </span>
        )}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "60px 20px",
            textAlign: "center",
            border: "1px solid var(--line)",
          }}
        >
          <Building2 size={48} color="#cbd5e1" style={{ margin: "0 auto 16px" }} />
          <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
            Không tìm thấy bài viết phù hợp
          </h4>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Thử tìm kiếm với từ khóa khác hoặc chuyển chuyên mục.
          </p>
        </div>
      )}

      {/* Grid of Articles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "28px",
        }}
      >
        {paginatedArticles.map((item, idx) => {
          const url = getArticleUrl(item);
          return (
            <article
              key={item.id || `${item.slug}-${idx}`}
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {/* Thumbnail */}
              <Link
                href={url}
                style={{
                  position: "relative",
                  display: "block",
                  width: "100%",
                  height: "220px",
                  overflow: "hidden",
                  background: "#f1f5f9",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.3s ease",
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/news-placeholder.jpg";
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3b8",
                    }}
                  >
                    <Building2 size={40} />
                  </div>
                )}

                {/* Category Badge */}
                {item.category && (
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      zIndex: 2,
                      padding: "4px 12px",
                      borderRadius: "999px",
                      color: "#fff",
                      background: "rgba(15, 23, 42, 0.82)",
                      fontSize: "11px",
                      fontWeight: 800,
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    {item.category}
                  </span>
                )}
              </Link>

              {/* Content info */}
              <div
                style={{
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                {/* Meta row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#64748b",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <CalendarDays size={13} color="#d42027" /> {item.date}
                  </span>

                  {item.author && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <User size={13} /> {item.author}
                    </span>
                  )}

                  {item.views && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={13} /> {item.views} lượt xem
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4
                  style={{
                    margin: "0 0 10px",
                    fontSize: "17px",
                    fontWeight: 800,
                    lineHeight: 1.45,
                  }}
                >
                  <Link
                    href={url}
                    style={{
                      color: "#0f172a",
                      textDecoration: "none",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.title}
                  </Link>
                </h4>

                {/* Excerpt */}
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    marginBottom: "18px",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.excerpt}
                </p>

                {/* Action Button */}
                <div
                  style={{
                    paddingTop: "14px",
                    borderTop: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Link
                    href={url}
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
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "48px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => handlePageChange(safePage - 1)}
            disabled={safePage <= 1}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid var(--line)",
              background: safePage <= 1 ? "#f1f5f9" : "#fff",
              color: safePage <= 1 ? "#94a3b8" : "#0f172a",
              cursor: safePage <= 1 ? "not-allowed" : "pointer",
              fontSize: "13.5px",
              fontWeight: 700,
              transition: "all 0.2s ease",
            }}
          >
            <ChevronLeft size={16} /> Trang trước
          </button>

          {paginationRange.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{
                    padding: "0 8px",
                    color: "#94a3b8",
                    fontWeight: 700,
                    userSelect: "none",
                  }}
                >
                  ...
                </span>
              );
            }
            const pageNum = p as number;
            const isActive = pageNum === safePage;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                style={{
                  minWidth: "40px",
                  height: "40px",
                  padding: "0 12px",
                  borderRadius: "10px",
                  border: isActive ? "1px solid #d42027" : "1px solid var(--line)",
                  background: isActive ? "#d42027" : "#fff",
                  color: isActive ? "#fff" : "#0f172a",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 800,
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "0 4px 14px rgba(212,32,39,0.25)" : "none",
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid var(--line)",
              background: safePage >= totalPages ? "#f1f5f9" : "#fff",
              color: safePage >= totalPages ? "#94a3b8" : "#0f172a",
              cursor: safePage >= totalPages ? "not-allowed" : "pointer",
              fontSize: "13.5px",
              fontWeight: 700,
              transition: "all 0.2s ease",
            }}
          >
            Trang sau <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
