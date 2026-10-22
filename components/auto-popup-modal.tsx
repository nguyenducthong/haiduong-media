"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/link";
import { X, ExternalLink } from "lucide-react";

interface PopupArticle {
  id: string;
  slug: string;
  title: string;
  image: string;
  excerpt?: string;
  category?: string;
  url: string;
}

export function AutoPopupModal() {
  const pathname = usePathname();
  const [article, setArticle] = useState<PopupArticle | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch the single active popup article
  useEffect(() => {
    let active = true;
    async function fetchPopupArticle() {
      try {
        const res = await fetch("/api/popup-article");
        if (!res.ok) return;
        const data = (await res.json()) as any;
        if (active && data?.success && data?.article) {
          setArticle(data.article);
        }
      } catch (err) {
        console.warn("Lỗi tải popup article:", err);
      }
    }
    fetchPopupArticle();
    return () => {
      active = false;
    };
  }, []);

  // 2. Handle route transition & 30-second timer
  useEffect(() => {
    // Clear any previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Reset visibility for new route
    setIsOpen(false);
    setIsDismissed(false);

    // Suppress on admin, login, or API routes
    if (
      !pathname ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/api")
    ) {
      return;
    }

    // If no article configured yet, wait
    if (!article) return;

    // RULE: "nếu đang vào đúng bài viết đó thì không cần hiện popup đó"
    const isCurrentArticlePage =
      (article.slug && pathname.includes(article.slug)) ||
      pathname === article.url ||
      (article.slug && pathname.endsWith(article.slug));

    if (isCurrentArticlePage) {
      return;
    }

    // RULE: "Khi vào 1 trang nào đó sẽ hiển thị lên sau 10s"
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 10000); // 10 seconds

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pathname, article]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setIsDismissed(true); // "khi tắt thì sẽ không hiển thị nữa (trên trang này)"
  };

  if (!isOpen || isDismissed || !article) {
    return null;
  }

  // Safety check: double-check current route
  const isCurrentArticlePage =
    (article.slug && pathname.includes(article.slug)) ||
    pathname === article.url ||
    (article.slug && pathname.endsWith(article.slug));

  if (isCurrentArticlePage) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "popupFadeIn 0.25s ease-out forwards",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
    >
      <div
        style={{
          position: "relative",
          background: "#ffffff",
          border: "4px solid #ffffff",
          borderRadius: "14px",
          boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.6)",
          maxWidth: "680px",
          width: "92vw",
          overflow: "visible",
          animation: "popupZoomIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Nút đóng tròn đỏ nổi bật góc trên bên phải (khớp ảnh đính kèm) */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng popup"
          title="Đóng (Esc)"
          style={{
            position: "absolute",
            top: "-15px",
            right: "-15px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#dc2626",
            color: "#ffffff",
            border: "2px solid #ffffff",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 100,
            transition: "transform 0.15s ease, background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.12)";
            e.currentTarget.style.background = "#b91c1c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#dc2626";
          }}
        >
          <X size={20} strokeWidth={2.8} />
        </button>

        {/* Khối Banner bấm vào chuyển sang bài viết */}
        <Link
          href={article.url}
          onClick={handleClose}
          style={{
            display: "block",
            textDecoration: "none",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
            background: "#0f172a",
          }}
        >
          <img
            src={article.image || "/images/news-placeholder.jpg"}
            alt={article.title}
            style={{
              width: "100%",
              maxHeight: "75vh",
              objectFit: "contain",
              display: "block",
              background: "#1e293b",
            }}
          />

          {/* Thanh tiêu đề chân popup */}
          <div
            style={{
              padding: "12px 18px",
              background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#f8fafc",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {article.title}
              </div>
              {article.category && (
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                  {article.category}
                </div>
              )}
            </div>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                fontWeight: 800,
                background: "#d42027",
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "8px",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(212, 32, 39, 0.4)",
              }}
            >
              Xem ngay <ExternalLink size={13} />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
