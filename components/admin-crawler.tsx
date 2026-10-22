"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Globe,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Save,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Layers,
  ArrowRight,
  BookOpen,
  Image as ImageIcon,
  Clock,
  Filter,
  Check,
  ChevronRight,
  FileText,
  Hash,
  CopyCheck,
  ShieldCheck,
} from "lucide-react";
import type { EnterpriseArticle } from "@/lib/enterprises-types";

interface RawArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  views: string;
  sourceUrl: string;
  author?: string;
  urlHash?: string;
  titleHash?: string;
  hash?: string;
  isDuplicate?: boolean;
  active?: boolean;
}

interface EnrichedArticleItem extends RawArticleItem {
  content?: string;
  contentHash?: string;
  wordCount?: number;
  readTime?: string;
  imageCount?: number;
}

interface SaveResultStats {
  added: number;
  updated: number;
  skipped: number;
  totalCount: number;
}

export function AdminCrawler() {
  const [activeTab, setActiveTab] = useState<"crawler" | "manage">("crawler");
  const [url, setUrl] = useState(
    "https://kinhtechaua.vn/thong-tin-doanh-nghiep/doanh-nghiep.htm"
  );
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 & 2 states
  const [scanningList, setScanningList] = useState(false);
  const [scannedList, setScannedList] = useState<RawArticleItem[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [listFilter, setListFilter] = useState<"all" | "new" | "duplicate">("all");

  // Step 3 states
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [enrichedArticles, setEnrichedArticles] = useState<EnrichedArticleItem[]>([]);
  const [previewArticle, setPreviewArticle] = useState<EnrichedArticleItem | null>(null);

  // Step 4 states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMode, setSaveMode] = useState<"merge" | "overwrite">("merge");
  const [saveStats, setSaveStats] = useState<SaveResultStats | null>(null);
  const [assignedTypes, setAssignedTypes] = useState<string[]>(["doanh-nghiep"]);

  const toggleAssignedType = (typeId: string) => {
    setAssignedTypes((prev) => {
      const next = prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId];
      const finalTypes = next.length === 0 ? [typeId] : next;
      setEnrichedArticles((list) =>
        list.map((art) => ({ ...art, type: finalTypes }))
      );
      return finalTypes;
    });
  };

  // Manage existing state
  const [savedArticles, setSavedArticles] = useState<EnterpriseArticle[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [manageSearch, setManageSearch] = useState("");

  // Notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Load existing articles
  const fetchSavedArticles = async () => {
    setLoadingSaved(true);
    try {
      const res = await fetch("/api/crawl-doanh-nghiep?action=list-saved");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setSavedArticles(data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  // Quick preset URLs
  const presetUrls = [
    { label: "Doanh nghiệp", url: "https://kinhtechaua.vn/thong-tin-doanh-nghiep/doanh-nghiep.htm" },
    { label: "Doanh nhân", url: "https://kinhtechaua.vn/thong-tin-doanh-nghiep/doanh-nhan.htm" },
    { label: "Sản phẩm & Dịch vụ", url: "https://kinhtechaua.vn/thong-tin-doanh-nghiep/san-pham-dich-vu.htm" },
  ];

  // BƯỚC 1: Quét danh sách bài viết + cơ chế Hash & chống trùng lặp
  const handleScanList = async () => {
    if (!url.trim()) {
      showToast("error", "Vui lòng nhập URL cần quét.");
      return;
    }
    setScanningList(true);
    setScannedList([]);
    setSelectedSlugs(new Set());
    setSaveStats(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scan-list", url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể quét danh sách bài viết.");
      }
      const articles: RawArticleItem[] = data.articles || [];
      setScannedList(articles);

      // Tự động nhận diện loại menu từ URL nguồn
      const lowerUrl = url.trim().toLowerCase();
      let detectedTypes = ["doanh-nghiep"];
      if (lowerUrl.includes("doanh-nhan")) detectedTypes = ["doanh-nhan"];
      else if (lowerUrl.includes("tin-tuc")) detectedTypes = ["tin-tuc"];
      else if (lowerUrl.includes("san-pham")) detectedTypes = ["san-pham"];
      else if (lowerUrl.includes("su-kien")) detectedTypes = ["su-kien"];
      setAssignedTypes(detectedTypes);

      // TỰ ĐỘNG CHỐNG TRÙNG LẶP:
      // Ưu tiên chọn những bài MỚI (chưa có trong hệ thống)
      const newOnly = articles.filter((a) => !a.isDuplicate);
      if (newOnly.length > 0) {
        setSelectedSlugs(new Set(newOnly.map((a) => a.slug)));
        showToast(
          "success",
          `Tìm thấy ${articles.length} bài (${newOnly.length} bài mới, ${
            articles.length - newOnly.length
          } bài đã có). Đã chọn sẵn các bài mới!`
        );
      } else {
        // Nếu tất cả bài đều đã có, chọn tất cả để người dùng có thể cập nhật
        setSelectedSlugs(new Set(articles.map((a) => a.slug)));
        showToast("success", `Tất cả ${articles.length} bài viết đều đã có trong hệ thống.`);
      }

      setStep(2);
    } catch (err: any) {
      showToast("error", err.message || "Đã xảy ra lỗi khi quét.");
    } finally {
      setScanningList(false);
    }
  };

  // Lọc bài viết hiển thị ở Bước 2
  const filteredScannedList = useMemo(() => {
    if (listFilter === "new") return scannedList.filter((a) => !a.isDuplicate);
    if (listFilter === "duplicate") return scannedList.filter((a) => a.isDuplicate);
    return scannedList;
  }, [scannedList, listFilter]);

  const newCount = useMemo(() => scannedList.filter((a) => !a.isDuplicate).length, [scannedList]);
  const duplicateCount = useMemo(() => scannedList.filter((a) => a.isDuplicate).length, [scannedList]);

  // Chọn chỉ bài mới
  const selectOnlyNew = () => {
    const next = new Set<string>();
    scannedList.forEach((a) => {
      if (!a.isDuplicate) next.add(a.slug);
    });
    setSelectedSlugs(next);
  };

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedSlugs.size === scannedList.length) {
      setSelectedSlugs(new Set());
    } else {
      setSelectedSlugs(new Set(scannedList.map((a) => a.slug)));
    }
  };

  const toggleSelectOne = (slug: string) => {
    const next = new Set(selectedSlugs);
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    setSelectedSlugs(next);
  };

  // BƯỚC 2 -> 3: Quét chi tiết & làm giàu dữ liệu cho các bài đã chọn
  const handleScanDetails = async () => {
    const selectedArticles = scannedList.filter((a) => selectedSlugs.has(a.slug));
    if (selectedArticles.length === 0) {
      showToast("error", "Vui lòng chọn ít nhất một bài viết.");
      return;
    }

    setFetchingDetails(true);
    setStep(3);
    setProgress({ current: 0, total: selectedArticles.length });
    const enrichedResults: EnrichedArticleItem[] = [];

    for (let i = 0; i < selectedArticles.length; i++) {
      const target = selectedArticles[i];
      setProgress({ current: i + 1, total: selectedArticles.length });
      try {
        const res = await fetch("/api/crawl-doanh-nghiep", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "scan-detail", article: target }),
        });
        const data = await res.json();
        if (data.success && data.article) {
          const type = assignedTypes && assignedTypes.length > 0 ? assignedTypes : (data.article.type || ["doanh-nghiep"]);
          enrichedResults.push({ ...data.article, type });
        } else {
          enrichedResults.push({
            ...target,
            type: assignedTypes && assignedTypes.length > 0 ? assignedTypes : ["doanh-nghiep"],
            wordCount: 0,
            readTime: "1 phút đọc",
            imageCount: 0,
          });
        }
      } catch (err) {
        enrichedResults.push({
          ...target,
          type: assignedTypes && assignedTypes.length > 0 ? assignedTypes : ["doanh-nghiep"],
          wordCount: 0,
          readTime: "1 phút đọc",
          imageCount: 0,
        });
      }
    }

    setEnrichedArticles(enrichedResults);
    setFetchingDetails(false);
    showToast(
      "success",
      `Đã bóc tách chi tiết & tạo mã băm Hash cho ${enrichedResults.length} bài viết!`
    );
  };

  // BƯỚC 4: Chỉnh sửa trường dữ liệu được làm giàu
  const updateEnrichedArticle = (index: number, key: keyof EnrichedArticleItem, value: any) => {
    setEnrichedArticles((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  // BƯỚC 5: Lưu vào hệ thống với thống kê chi tiết
  const handleSaveToSystem = async () => {
    if (enrichedArticles.length === 0) return;
    setSaving(true);
    try {
      const articlesToSave = enrichedArticles.map((a) => ({
        ...a,
        type: a.type && Array.isArray(a.type) && a.type.length > 0 ? a.type : assignedTypes,
      }));
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          articles: articlesToSave,
          mode: saveMode,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể lưu dữ liệu.");
      }
      setSaveStats({
        added: data.added ?? 0,
        updated: data.updated ?? 0,
        skipped: data.skipped ?? 0,
        totalCount: data.totalCount ?? 0,
      });
      setSaveSuccess(true);
      showToast("success", data.message || "Đã lưu vào hệ thống thành công!");
      fetchSavedArticles();
    } catch (err: any) {
      showToast("error", err.message || "Lỗi khi lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };

  // Xóa bài viết đã lưu
  const handleDeleteSaved = async (slug: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", slug }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Đã xóa bài viết thành công!");
        fetchSavedArticles();
      }
    } catch (err: any) {
      showToast("error", err.message || "Không thể xóa bài viết.");
    }
  };

  const categoryOptions = [
    "Thương hiệu Quốc gia",
    "Y tế & Chăm sóc sức khỏe",
    "Công nghệ & Sản xuất",
    "Thông báo & Tiếp nhận hồ sơ",
    "Du lịch & Khách sạn",
    "Doanh nghiệp tiêu biểu",
    "Đối tác chiến lược",
  ];

  return (
    <section id="crawler-doanh-nghiep" className="admin-card" style={{ marginBottom: "40px" }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            background: toast.type === "success" ? "#0f766e" : "#b91c1c",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: 700,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Main Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "20px",
          marginBottom: "24px",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(212,32,39,0.08)",
              color: "#d42027",
              fontSize: "11px",
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: "999px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            <ShieldCheck size={13} /> CÔNG CỤ CÀO DỮ LIỆU & CHỐNG TRÙNG LẶP HASH SHA-256
          </span>
          <h2 style={{ margin: "4px 0 0", fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>
            Quét & Làm Giàu Dữ Liệu Bài Viết Doanh Nghiệp
          </h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
            Cơ chế tạo mã băm Hash URL & Content, tự động đối chiếu và loại trừ bài viết trùng lặp, làm giàu dữ liệu chuẩn SEO.
          </p>
        </div>

        {/* Tab switchers */}
        <div
          style={{
            display: "flex",
            background: "#f1f5f9",
            borderRadius: "12px",
            padding: "4px",
            gap: "4px",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("crawler")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              background: activeTab === "crawler" ? "#fff" : "transparent",
              color: activeTab === "crawler" ? "#0f172a" : "#64748b",
              boxShadow: activeTab === "crawler" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            }}
          >
            Quét bài viết mới
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("manage");
              fetchSavedArticles();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              background: activeTab === "manage" ? "#fff" : "transparent",
              color: activeTab === "manage" ? "#0f172a" : "#64748b",
              boxShadow: activeTab === "manage" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            }}
          >
            Bài viết đã lưu ({savedArticles.length})
          </button>
        </div>
      </div>

      {/* ============================================================
          TAB 1: CRAWLER WORKFLOW
          ============================================================ */}
      {activeTab === "crawler" && (
        <div>
          {/* Stepper Wizard Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            {[
              { num: 1, title: "1. Nhập Link nguồn" },
              { num: 2, title: `2. Chọn bài (${selectedSlugs.size}/${scannedList.length})` },
              { num: 3, title: `3. Bóc tách & Hash` },
              { num: 4, title: "4. Lưu & Chống trùng" },
            ].map((s) => {
              const isCurrent = step === s.num;
              const isPassed = step > s.num;
              return (
                <div
                  key={s.num}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: isCurrent ? "#0f172a" : isPassed ? "#f0fdf4" : "#f8fafc",
                    border: isCurrent
                      ? "1px solid #0f172a"
                      : isPassed
                      ? "1px solid #bbf7d0"
                      : "1px solid var(--line)",
                    color: isCurrent ? "#fff" : isPassed ? "#166534" : "#64748b",
                    fontSize: "13px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 900,
                      background: isCurrent ? "#d42027" : isPassed ? "#22c55e" : "#e2e8f0",
                      color: isCurrent || isPassed ? "#fff" : "#475569",
                    }}
                  >
                    {isPassed ? <Check size={12} /> : s.num}
                  </span>
                  {s.title}
                </div>
              );
            })}
          </div>

          {/* BƯỚC 1: NHẬP LINK NGUỒN */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              Nhập đường dẫn trang web cần quét danh sách bài viết:
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div
                style={{
                  flex: 1,
                  minWidth: "280px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#f8fafc",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "10px 16px",
                }}
              >
                <Globe size={18} color="#94a3b8" />
                <input
                  type="url"
                  placeholder="https://kinhtechaua.vn/thong-tin-doanh-nghiep/doanh-nghiep.htm"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    width: "100%",
                    color: "#0f172a",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleScanList}
                disabled={scanningList}
                style={{
                  background: "#d42027",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontWeight: 800,
                  fontSize: "14px",
                  cursor: scanningList ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(212,32,39,0.25)",
                }}
              >
                {scanningList ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Đang quét...
                  </>
                ) : (
                  <>
                    <Search size={16} /> Quét danh sách bài viết
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>
                Link mẫu nhanh:
              </span>
              {presetUrls.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrl(p.url)}
                  style={{
                    background: url === p.url ? "rgba(212,32,39,0.08)" : "#f1f5f9",
                    color: url === p.url ? "#d42027" : "#475569",
                    border: url === p.url ? "1px solid #d42027" : "1px solid var(--line)",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* BƯỚC 2: CHỌN BÀI VIẾT + BỘ LỌC CHỐNG TRÙNG LẶP */}
          {scannedList.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "14px",
                  marginBottom: "18px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 4px" }}>
                    Danh sách bài viết tìm thấy ({scannedList.length} bài)
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>
                      ● {newCount} bài mới
                    </span>
                    <span style={{ color: "#d97706", fontWeight: 700 }}>
                      ● {duplicateCount} bài đã tồn tại
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                  {/* Select New Only Button */}
                  {newCount > 0 && (
                    <button
                      type="button"
                      onClick={selectOnlyNew}
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #86efac",
                        color: "#15803d",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <ShieldCheck size={15} /> Chỉ chọn bài MỚI ({newCount})
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {selectedSlugs.size === scannedList.length ? (
                      <>
                        <CheckSquare size={16} color="#d42027" /> Bỏ chọn tất cả
                      </>
                    ) : (
                      <>
                        <Square size={16} /> Chọn tất cả ({scannedList.length})
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleScanDetails}
                    disabled={selectedSlugs.size === 0 || fetchingDetails}
                    style={{
                      background: "#0f172a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: selectedSlugs.size === 0 || fetchingDetails ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {fetchingDetails ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Đang quét chi tiết (
                        {progress.current}/{progress.total})...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} color="#f87171" /> Quét chi tiết & Làm giàu (
                        {selectedSlugs.size} bài) <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter tabs: Tất cả / Bài mới / Trùng lặp */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>
                  Lọc xem:
                </span>
                <button
                  type="button"
                  onClick={() => setListFilter("all")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: listFilter === "all" ? "1px solid #0f172a" : "1px solid var(--line)",
                    background: listFilter === "all" ? "#0f172a" : "#fff",
                    color: listFilter === "all" ? "#fff" : "#475569",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Tất cả ({scannedList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setListFilter("new")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: listFilter === "new" ? "1px solid #16a34a" : "1px solid var(--line)",
                    background: listFilter === "new" ? "#16a34a" : "#fff",
                    color: listFilter === "new" ? "#fff" : "#15803d",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Bài viết mới ({newCount})
                </button>
                <button
                  type="button"
                  onClick={() => setListFilter("duplicate")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: listFilter === "duplicate" ? "1px solid #d97706" : "1px solid var(--line)",
                    background: listFilter === "duplicate" ? "#d97706" : "#fff",
                    color: listFilter === "duplicate" ? "#fff" : "#b45309",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Đã tồn tại trong hệ thống ({duplicateCount})
                </button>
              </div>

              {/* List of Scanned Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredScannedList.map((item, idx) => {
                  const isChecked = selectedSlugs.has(item.slug);
                  return (
                    <div
                      key={item.slug || idx}
                      onClick={() => toggleSelectOne(item.slug)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "12px 18px",
                        borderRadius: "12px",
                        border: isChecked ? "1px solid #d42027" : "1px solid var(--line)",
                        background: isChecked ? "rgba(212,32,39,0.02)" : "#fff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#d42027",
                          cursor: "pointer",
                        }}
                      />

                      {/* Thumbnail */}
                      <div
                        style={{
                          width: "80px",
                          height: "56px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#f1f5f9",
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "grid",
                              placeItems: "center",
                              color: "#cbd5e1",
                            }}
                          >
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* Deduplication Status Badge */}
                          {item.isDuplicate ? (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                background: "#fef3c7",
                                color: "#b45309",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <CopyCheck size={11} /> Đã có trong hệ thống
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                background: "#dcfce7",
                                color: "#15803d",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <Sparkles size={11} /> Bài mới
                            </span>
                          )}

                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 800,
                              color: "#d42027",
                              background: "rgba(212,32,39,0.08)",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {item.category}
                          </span>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>{item.date}</span>

                          {/* Hash tag */}
                          {item.hash && (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#94a3b8",
                                fontFamily: "monospace",
                                background: "#f1f5f9",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                              title={`Mã Hash bài viết: ${item.hash}`}
                            >
                              #{item.hash.slice(0, 8)}
                            </span>
                          )}
                        </div>

                        <h4
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#0f172a",
                            lineHeight: 1.4,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </h4>
                      </div>

                      {/* Source Link */}
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          color: "#64748b",
                          padding: "6px",
                          borderRadius: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                        title="Xem trang gốc"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BƯỚC 3: DỮ LIỆU ĐÃ BÓC TÁCH & MÃ HASH */}
          {enrichedArticles.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  marginBottom: "24px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 4px" }}>
                    Dữ liệu đã bóc tách & tạo mã băm Hash ({enrichedArticles.length} bài)
                  </h3>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>
                    Cơ chế Content-Hash tự động phát hiện bài viết trùng hoặc có nội dung thay đổi.
                  </span>
                </div>

                {/* Assign to Menu Types Checkboxes */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "12px",
                    background: "#f8fafc",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>
                    Gán vào Menu:
                  </span>
                  {[
                    { id: "doanh-nghiep", label: "Doanh nghiệp", color: "#d42027" },
                    { id: "doanh-nhan", label: "Doanh nhân", color: "#0284c7" },
                    { id: "san-pham", label: "Sản phẩm", color: "#16a34a" },
                    { id: "tin-tuc", label: "Tin tức", color: "#9333ea" },
                    { id: "su-kien", label: "Sự kiện", color: "#ea580c" },
                    { id: "popup", label: "Popup Nổi Bật", color: "#e11d48" },
                  ].map((t) => {
                    const isChecked = assignedTypes.includes(t.id);
                    return (
                      <label
                        key={t.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          color: isChecked ? t.color : "#64748b",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAssignedType(t.id)}
                          style={{ accentColor: t.color }}
                        />
                        {t.label}
                      </label>
                    );
                  })}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <select
                    value={saveMode}
                    onChange={(e: any) => setSaveMode(e.target.value)}
                    style={{
                      padding: "9px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--line)",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: "#f8fafc",
                    }}
                  >
                    <option value="merge">Hợp nhất: Cập nhật nếu có đổi & Thêm mới (Khuyến nghị)</option>
                    <option value="overwrite">Ghi đè: Ép buộc thay thế các bài viết trùng & Thêm mới</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleSaveToSystem}
                    disabled={saving}
                    style={{
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 22px",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Lưu vào website ngay
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Cards of Enriched Articles */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {enrichedArticles.map((art, idx) => (
                  <div
                    key={art.slug || idx}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "14px",
                      padding: "20px",
                      background: "#fafafa",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      {/* Image Preview */}
                      <div
                        style={{
                          width: "120px",
                          height: "85px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#e2e8f0",
                        }}
                      >
                        {art.image && (
                          <img
                            src={art.image}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                      </div>

                      {/* Title & Slug inputs */}
                      <div style={{ flex: 1, minWidth: "260px" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 800,
                              color: "#64748b",
                              textTransform: "uppercase",
                            }}
                          >
                            Tiêu đề bài viết
                          </label>
                          <input
                            type="text"
                            value={art.title}
                            onChange={(e) => updateEnrichedArticle(idx, "title", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              border: "1px solid var(--line)",
                              fontWeight: 700,
                              fontSize: "14px",
                              color: "#0f172a",
                            }}
                          />
                        </div>

                        {/* Enriched badges */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              background: "#e0f2fe",
                              color: "#0369a1",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FileText size={12} /> {art.wordCount || 0} từ
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              background: "#fef3c7",
                              color: "#b45309",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Clock size={12} /> {art.readTime || "1 phút đọc"}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              background: "#f3e8ff",
                              color: "#7e22ce",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <ImageIcon size={12} /> {art.imageCount || 0} ảnh
                          </span>

                          {/* Content hash badge */}
                          {art.contentHash && (
                            <span
                              style={{
                                fontSize: "11px",
                                background: "#f1f5f9",
                                color: "#475569",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontWeight: 700,
                                fontFamily: "monospace",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                              title={`Mã Hash nội dung: ${art.contentHash}`}
                            >
                              <Hash size={12} /> {art.contentHash.slice(0, 10)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "#64748b",
                          textTransform: "uppercase",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Đoạn tóm tắt (Excerpt)
                      </label>
                      <textarea
                        rows={2}
                        value={art.excerpt}
                        onChange={(e) => updateEnrichedArticle(idx, "excerpt", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid var(--line)",
                          fontSize: "13px",
                          color: "#334155",
                          lineHeight: 1.5,
                        }}
                      />
                    </div>

                    {/* Category & Author Row */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            color: "#64748b",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          Chuyên mục
                        </label>
                        <select
                          value={art.category}
                          onChange={(e) => updateEnrichedArticle(idx, "category", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid var(--line)",
                            fontSize: "13px",
                            fontWeight: 600,
                            background: "#fff",
                          }}
                        >
                          {categoryOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            color: "#64748b",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          Tác giả / Nguồn
                        </label>
                        <input
                          type="text"
                          value={art.author || ""}
                          onChange={(e) => updateEnrichedArticle(idx, "author", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid var(--line)",
                            fontSize: "13px",
                            fontWeight: 600,
                            background: "#fff",
                          }}
                        />
                      </div>
                    </div>

                    {/* Menu Type Selector for this Card */}
                    <div style={{ marginTop: "4px" }}>
                      <label
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "#64748b",
                          textTransform: "uppercase",
                          display: "block",
                          marginBottom: "6px",
                        }}
                      >
                        Gán vào Menu hiển thị:
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {[
                          { id: "doanh-nghiep", label: "Doanh nghiệp", color: "#d42027" },
                          { id: "doanh-nhan", label: "Doanh nhân", color: "#0284c7" },
                          { id: "san-pham", label: "Sản phẩm", color: "#16a34a" },
                          { id: "tin-tuc", label: "Tin tức", color: "#9333ea" },
                          { id: "su-kien", label: "Sự kiện", color: "#ea580c" },
                          { id: "popup", label: "Popup Nổi Bật", color: "#e11d48" },
                        ].map((t) => {
                          const artTypes = Array.isArray(art.type) && art.type.length > 0 ? art.type : assignedTypes;
                          const isChecked = artTypes.includes(t.id);
                          return (
                            <label
                              key={t.id}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                                fontWeight: 700,
                                cursor: "pointer",
                                padding: "5px 12px",
                                borderRadius: "7px",
                                border: isChecked ? `1.5px solid ${t.color}` : "1px solid var(--line)",
                                background: isChecked ? "#fff" : "#f8fafc",
                                color: isChecked ? t.color : "#64748b",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  const next = isChecked
                                    ? artTypes.filter((x: string) => x !== t.id)
                                    : [...artTypes, t.id];
                                  updateEnrichedArticle(idx, "type", next.length === 0 ? [t.id] : next);
                                }}
                                style={{ accentColor: t.color }}
                              />
                              {t.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preview Button */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => setPreviewArticle(art)}
                        style={{
                          background: "#fff",
                          border: "1px solid var(--line)",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#0f172a",
                        }}
                      >
                        <Eye size={14} /> Xem trước bài viết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Báo cáo kết quả Lưu & Chống trùng lặp */}
          {saveSuccess && saveStats && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <CheckCircle2 size={32} color="#16a34a" />
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#166534" }}>
                    Lưu & Chống Trùng Lặp Thành Công!
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "6px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ color: "#15803d" }}>✓ Thêm mới: {saveStats.added} bài</span>
                    <span style={{ color: "#0369a1" }}>↻ Cập nhật: {saveStats.updated} bài</span>
                    <span style={{ color: "#b45309" }}>⊘ Bỏ qua trùng lặp: {saveStats.skipped} bài</span>
                    <span style={{ color: "#475569" }}>Tổng kho: {saveStats.totalCount} bài</span>
                  </div>
                </div>
              </div>

              <a
                href="/doanh-nghiep"
                target="_blank"
                style={{
                  background: "#16a34a",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Xem trang Doanh Nghiệp <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 2: QUẢN LÝ BÀI VIẾT HIỆN CÓ
          ============================================================ */}
      {activeTab === "manage" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề..."
                value={manageSearch}
                onChange={(e) => setManageSearch(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  fontSize: "13px",
                  width: "280px",
                }}
              />
            </div>

            <button
              type="button"
              onClick={fetchSavedArticles}
              style={{
                background: "#f8fafc",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw size={14} /> Tải lại danh sách
            </button>
          </div>

          {loadingSaved ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
              Đang tải danh sách bài viết...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {savedArticles
                .filter(
                  (a) =>
                    !manageSearch.trim() ||
                    a.title.toLowerCase().includes(manageSearch.toLowerCase())
                )
                .map((art, idx) => (
                  <div
                    key={art.slug || idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      background: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
                      <div
                        style={{
                          width: "60px",
                          height: "42px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#f1f5f9",
                        }}
                      >
                        {art.image && (
                          <img
                            src={art.image}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#d42027",
                            }}
                          >
                            {art.category}
                          </span>
                          <span style={{ fontSize: "11px", color: "#94a3b8" }}>{art.date}</span>
                        </div>
                        <h4
                          style={{
                            margin: "2px 0 0",
                            fontSize: "14px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {art.title}
                        </h4>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <a
                        href={`/doanh-nghiep/${art.slug}`}
                        target="_blank"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "#f8fafc",
                          border: "1px solid var(--line)",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#0f172a",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <ExternalLink size={13} /> Xem bài
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteSaved(art.slug, art.title)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Trash2 size={13} /> Xóa
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          MODAL PREVIEW BÀI VIẾT
          ============================================================ */}
      {previewArticle && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setPreviewArticle(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "30px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--line)",
                paddingBottom: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    background: "rgba(212,32,39,0.08)",
                    color: "#d42027",
                    fontSize: "12px",
                    fontWeight: 800,
                    padding: "4px 12px",
                    borderRadius: "999px",
                  }}
                >
                  {previewArticle.category}
                </span>

                {previewArticle.contentHash && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      fontFamily: "monospace",
                      background: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    Hash: {previewArticle.contentHash.slice(0, 12)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>
              {previewArticle.title}
            </h2>

            <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>
              {previewArticle.date} • {previewArticle.author || "Hải Dương Media"} •{" "}
              {previewArticle.readTime || "1 phút đọc"}
            </div>

            {previewArticle.excerpt && (
              <div
                style={{
                  background: "#f8fafc",
                  borderLeft: "4px solid #d42027",
                  padding: "14px 18px",
                  borderRadius: "0 8px 8px 0",
                  fontSize: "14px",
                  fontStyle: "italic",
                  marginBottom: "20px",
                  color: "#334155",
                }}
              >
                {previewArticle.excerpt}
              </div>
            )}

            {previewArticle.content ? (
              <div
                className="enterprise-content"
                style={{ fontSize: "15px", lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: previewArticle.content }}
              />
            ) : (
              <p>{previewArticle.excerpt}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
