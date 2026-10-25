"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Building2,
  Users,
  Package,
  Newspaper,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Globe,
  Hash,
  Clock,
  BookOpen,
  Image as ImageIcon,
  Check,
  X,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Tag,
  Upload,
  FolderOpen,
  MapPin,
  Handshake,
  Megaphone,
  Flame,
} from "lucide-react";
import type { EnterpriseArticle } from "@/lib/enterprises-types";
import { getArticleTypes, getArticleViewUrl } from "@/lib/enterprises-types";
import { AdminCrawler } from "@/components/admin-crawler";
import { EnterpriseContentEditor } from "@/components/enterprise-content-editor";

export const ARTICLE_TYPES = [
  { id: "doanh-nghiep", label: "Doanh nghiệp", icon: Building2, color: "#d42027", bg: "rgba(212,32,39,0.08)", border: "rgba(212,32,39,0.2)" },
  { id: "doanh-nhan", label: "Doanh nhân", icon: Users, color: "#0284c7", bg: "rgba(2,132,199,0.08)", border: "rgba(2,132,199,0.2)" },
  { id: "san-pham", label: "Sản phẩm", icon: Package, color: "#16a34a", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.2)" },
  { id: "tin-tuc", label: "Tin tức", icon: Newspaper, color: "#9333ea", bg: "rgba(147,51,234,0.08)", border: "rgba(147,51,234,0.2)" },
  { id: "su-kien", label: "Sự kiện", icon: Calendar, color: "#ea580c", bg: "rgba(234,88,12,0.08)", border: "rgba(234,88,12,0.2)" },
  { id: "popup", label: "Popup Nổi Bật (Duy nhất 1 bài)", icon: Megaphone, color: "#e11d48", bg: "rgba(225,29,72,0.08)", border: "rgba(225,29,72,0.2)" },
];

const CATEGORIES = [
  "Thương hiệu Quốc gia",
  "Y tế & Chăm sóc sức khỏe",
  "Công nghệ & Sản xuất",
  "Thông báo & Tiếp nhận hồ sơ",
  "Du lịch & Khách sạn",
  "Doanh nghiệp tiêu biểu",
  "Lãnh đạo & Doanh nhân",
  "Sản phẩm & Dịch vụ",
  "Sự kiện & Diễn đàn",
  "Tin hoạt động",
  "Đối tác chiến lược",
];

interface AdminArticlesProps {
  defaultType?: "all" | "doanh-nghiep" | "doanh-nhan" | "san-pham" | "tin-tuc" | "su-kien" | "popup";
  title?: string;
  subtitle?: string;
}

export { getArticleViewUrl };


export function AdminEnterprises({
  defaultType = "doanh-nghiep",
  title,
  subtitle,
}: AdminArticlesProps) {
  const [articles, setArticles] = useState<EnterpriseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTypeTab, setActiveTypeTab] = useState<string>(defaultType);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState<"all" | "crawled" | "custom">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [showCrawler, setShowCrawler] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [deletingBatch, setDeletingBatch] = useState(false);

  // Sync activeTypeTab if defaultType changes
  useEffect(() => {
    setActiveTypeTab(defaultType);
  }, [defaultType]);

  // Modals
  const [previewArticle, setPreviewArticle] = useState<EnterpriseArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<EnterpriseArticle> | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [showHashDetails, setShowHashDetails] = useState<EnterpriseArticle | null>(null);

  // Avatar image picker states
  const [showAvatarPickerModal, setShowAvatarPickerModal] = useState(false);
  const [avatarLibraryImages, setAvatarLibraryImages] = useState<{ url: string; name: string }[]>([]);
  const [loadingAvatarLibrary, setLoadingAvatarLibrary] = useState(false);
  const [searchAvatarLibrary, setSearchAvatarLibrary] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);

  // Modal for editing Homepage Event Section Heading
  const [showEventHeadingModal, setShowEventHeadingModal] = useState(false);
  const [eventHeadingData, setEventHeadingData] = useState({
    eventsEyebrow: "LỊCH TRÌNH SỰ KIỆN 2026 – 2027",
    eventsTitle: "Sự Kiện Sắp Diễn Ra",
    eventsDescription:
      "Các diễn đàn kinh tế, chương trình tôn vinh thương hiệu uy tín và sự kiện xúc tiến thương mại quốc tế được phối hợp và đồng hành tổ chức tại Việt Nam và các nước Châu Á.",
    eventsViewAllText: "Xem tất cả sự kiện",
  });
  const [loadingEventHeading, setLoadingEventHeading] = useState(false);
  const [savingEventHeading, setSavingEventHeading] = useState(false);
  const [eventHeadingMsg, setEventHeadingMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const openEventHeadingModal = async () => {
    setShowEventHeadingModal(true);
    setLoadingEventHeading(true);
    setEventHeadingMsg(null);
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setEventHeadingData({
          eventsEyebrow: data.eventsEyebrow || "LỊCH TRÌNH SỰ KIỆN 2026 – 2027",
          eventsTitle: data.eventsTitle || "Sự Kiện Sắp Diễn Ra",
          eventsDescription:
            data.eventsDescription ||
            "Các diễn đàn kinh tế, chương trình tôn vinh thương hiệu uy tín và sự kiện xúc tiến thương mại quốc tế được phối hợp và đồng hành tổ chức tại Việt Nam và các nước Châu Á.",
          eventsViewAllText: data.eventsViewAllText || "Xem tất cả sự kiện",
        });
      }
    } catch {
      // fallback
    } finally {
      setLoadingEventHeading(false);
    }
  };

  const saveEventHeading = async () => {
    setSavingEventHeading(true);
    setEventHeadingMsg(null);
    try {
      const res = await fetch("/api/content");
      const current = res.ok ? await res.json() : {};
      const updated = {
        ...current,
        eventsEyebrow: eventHeadingData.eventsEyebrow,
        eventsTitle: eventHeadingData.eventsTitle,
        eventsDescription: eventHeadingData.eventsDescription,
        eventsViewAllText: eventHeadingData.eventsViewAllText,
      };
      const putRes = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!putRes.ok) throw new Error("Không thể lưu cấu hình mục sự kiện.");
      setEventHeadingMsg({ type: "success", text: "Đã cập nhật tiêu đề & giới thiệu Sự Kiện ngoài Trang Chủ thành công!" });
      setTimeout(() => {
        setShowEventHeadingModal(false);
        setEventHeadingMsg(null);
      }, 1500);
    } catch (err: any) {
      setEventHeadingMsg({ type: "error", text: err?.message || "Có lỗi khi lưu." });
    } finally {
      setSavingEventHeading(false);
    }
  };

  const openAvatarLibrary = async () => {
    setShowAvatarPickerModal(true);
    setLoadingAvatarLibrary(true);
    try {
      const res = await fetch("/api/upload");
      if (res.ok) {
        const data = (await res.json()) as any;
        setAvatarLibraryImages(data.images || []);
      }
    } catch (e) {
      console.error("Failed to load images", e);
    } finally {
      setLoadingAvatarLibrary(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    if (!file) return;

    // Client-side size check (max 10MB for avatar)
    const MAX_AVATAR_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_AVATAR_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      showToast(
        "error",
        `⚠️ Ảnh đại diện quá lớn (${sizeMb} MB). Vui lòng chọn ảnh dưới 10MB (khuyên dùng dưới 2MB) để trang tải nhanh.`
      );
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(
            `Dung lượng ảnh (${(file.size / (1024 * 1024)).toFixed(1)} MB) vượt quá giới hạn máy chủ cho phép. Vui lòng chọn ảnh nhỏ hơn.`
          );
        }
        throw new Error(data?.error || "Tải ảnh thất bại.");
      }
      setEditingArticle((prev) => (prev ? { ...prev, image: data.url } : prev));
      showToast("success", "Đã tải lên và chọn ảnh đại diện thành công!");
    } catch (err: any) {
      showToast("error", err?.message || "Lỗi khi tải ảnh đại diện.");
    } finally {
      setUploadingAvatar(false);
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";
    }
  };

  // Notification
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crawl-doanh-nghiep?action=list-saved");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setArticles(data.articles);
      }
    } catch (err: any) {
      showToast("error", "Không thể tải danh sách bài viết từ database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter logic
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Type Filter
      if (activeTypeTab !== "all") {
        const artTypes = getArticleTypes(art);
        if (!artTypes.includes(activeTypeTab)) return false;
      }

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = (art.title || "").toLowerCase().includes(q);
        const matchExcerpt = (art.excerpt || "").toLowerCase().includes(q);
        const matchSlug = (art.slug || "").toLowerCase().includes(q);
        const matchAuthor = (art.author || "").toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt && !matchSlug && !matchAuthor) return false;
      }

      // Category
      if (selectedCategory !== "all" && art.category !== selectedCategory) {
        return false;
      }

      // Source
      if (selectedSource === "crawled" && !art.sourceUrl) return false;
      if (selectedSource === "custom" && !!art.sourceUrl) return false;

      // Status
      if (selectedStatus === "active" && art.active === false) return false;
      if (selectedStatus === "inactive" && art.active !== false) return false;

      return true;
    });
  }, [articles, search, activeTypeTab, selectedCategory, selectedSource, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = articles.length;
    const dnCount = articles.filter((a) => getArticleTypes(a).includes("doanh-nghiep")).length;
    const dnhanCount = articles.filter((a) => getArticleTypes(a).includes("doanh-nhan")).length;
    const spCount = articles.filter((a) => getArticleTypes(a).includes("san-pham")).length;
    const ttCount = articles.filter((a) => getArticleTypes(a).includes("tin-tuc")).length;
    const skCount = articles.filter((a) => getArticleTypes(a).includes("su-kien")).length;
    const popupCount = articles.filter((a) => getArticleTypes(a).includes("popup")).length;
    const crawled = articles.filter((a) => !!a.sourceUrl).length;
    const active = articles.filter((a) => a.active !== false).length;
    return { total, dnCount, dnhanCount, spCount, ttCount, skCount, popupCount, crawled, active };
  }, [articles]);

  // Quick Toggle Popup (Duy nhất 1 bài trong toàn hệ thống)
  const handleQuickTogglePopup = async (slug: string) => {
    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-popup", slug }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message);
        fetchArticles();
      } else {
        showToast("error", data.error || "Lỗi thao tác.");
      }
    } catch {
      showToast("error", "Lỗi kết nối máy chủ.");
    }
  };


  // Toggle quick active status
  const handleToggleActive = async (slug: string) => {
    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-active", slug }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) =>
          prev.map((a) => (a.slug === slug ? { ...a, active: data.active } : a))
        );
        showToast("success", data.message);
      } else {
        showToast("error", data.error || "Lỗi thao tác.");
      }
    } catch (err: any) {
      showToast("error", "Lỗi kết nối máy chủ.");
    }
  };

  // Delete article
  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn bài viết: "${title}" khỏi database?`)) return;
    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", slug }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.slug !== slug));
        setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
        showToast("success", "Đã xóa bài viết thành công!");
      } else {
        showToast("error", data.error || "Không thể xóa bài viết.");
      }
    } catch (err: any) {
      showToast("error", "Lỗi xóa bài viết.");
    }
  };

  // Bulk delete articles
  const handleBulkDelete = async () => {
    if (selectedSlugs.length === 0) return;
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedSlugs.length} bài viết đã chọn khỏi database?\n\nThao tác này sẽ xóa hoàn toàn và không thể hoàn tác!`
      )
    )
      return;

    setDeletingBatch(true);
    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-multiple", slugs: selectedSlugs }),
      });
      const data = await res.json();
      if (data.success) {
        const slugSet = new Set(selectedSlugs);
        setArticles((prev) => prev.filter((a) => !slugSet.has(a.slug) && !slugSet.has(a.id)));
        setSelectedSlugs([]);
        showToast("success", data.message || `Đã xóa ${data.deletedCount} bài viết thành công.`);
      } else {
        showToast("error", data.error || "Không thể xóa danh sách bài viết.");
      }
    } catch (err: any) {
      showToast("error", "Lỗi xóa danh sách bài viết.");
    } finally {
      setDeletingBatch(false);
    }
  };

  // Toggle selection for single article
  const toggleSelectArticle = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Check if all filtered articles are selected
  const isAllSelected =
    filteredArticles.length > 0 &&
    filteredArticles.every((a) => selectedSlugs.includes(a.slug));

  // Toggle select all filtered
  const toggleSelectAll = () => {
    if (isAllSelected) {
      const currentFilteredSlugs = new Set(filteredArticles.map((a) => a.slug));
      setSelectedSlugs((prev) => prev.filter((s) => !currentFilteredSlugs.has(s)));
    } else {
      const merged = new Set([...selectedSlugs, ...filteredArticles.map((a) => a.slug)]);
      setSelectedSlugs(Array.from(merged));
    }
  };

  // Save edit or new
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title?.trim()) {
      showToast("error", "Vui lòng nhập tiêu đề bài viết.");
      return;
    }

    const finalTypes = getArticleTypes(editingArticle);
    if (finalTypes.length === 0) {
      showToast("error", "Vui lòng chọn ít nhất 1 loại menu hiển thị (Type).");
      return;
    }

    const agendaList = Array.isArray(editingArticle.agenda)
      ? editingArticle.agenda.map((s) => String(s).trim()).filter(Boolean)
      : typeof editingArticle.agenda === "string"
      ? (editingArticle.agenda as string).split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    const benefitsList = Array.isArray(editingArticle.benefits)
      ? editingArticle.benefits.map((s) => String(s).trim()).filter(Boolean)
      : typeof editingArticle.benefits === "string"
      ? (editingArticle.benefits as string).split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    setSavingEdit(true);
    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-single",
          article: {
            ...editingArticle,
            type: finalTypes,
            agenda: agendaList,
            benefits: benefitsList,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message);
        setEditingArticle(null);
        fetchArticles();
      } else {
        showToast("error", data.error || "Lỗi lưu bài viết.");
      }
    } catch (err: any) {
      showToast("error", "Lỗi gửi dữ liệu lên máy chủ.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Toggle multi-select type in edit modal
  const handleToggleType = (typeId: string) => {
    if (!editingArticle) return;
    const currentTypes = getArticleTypes(editingArticle);
    let nextTypes: string[];

    if (typeId === "popup") {
      if (currentTypes.includes("popup")) {
        nextTypes = currentTypes.filter((t) => t !== "popup");
      } else {
        nextTypes = [...currentTypes, "popup"];
        const existingPopup = articles.find(
          (a) => a.slug !== editingArticle.slug && getArticleTypes(a).includes("popup")
        );
        if (existingPopup) {
          showToast(
            "info",
            `⭐ Bài viết này sẽ trở thành Popup duy nhất trên web. Bài "${existingPopup.title.slice(0, 35)}..." sẽ tự động nhường vị trí khi lưu.`
          );
        }
      }
    } else {
      nextTypes = currentTypes.includes(typeId)
        ? currentTypes.filter((t) => t !== typeId)
        : [...currentTypes, typeId];
    }

    setEditingArticle({ ...editingArticle, type: nextTypes });
  };

  // Get current active type label
  const activeTypeInfo = ARTICLE_TYPES.find((t) => t.id === activeTypeTab);
  const displayTitle =
    title ||
    (activeTypeTab === "all"
      ? "Kho Lưu Trữ Toàn Bộ Bài Viết"
      : `Quản Lý Bài Viết ${activeTypeInfo?.label || "Doanh Nghiệp"}`);

  const displaySubtitle =
    subtitle ||
    "Tất cả bài viết được lưu trữ trong 1 file duy nhất (data/enterprises.json). Bạn có thể gán nhiều loại (Type) để bài viết hiển thị đồng thời ở nhiều menu ngang.";

  return (
    <div className="admin-enterprises-container" style={{ display: "grid", gap: "24px" }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 99999,
            background: toast.type === "success" ? "#0f766e" : toast.type === "info" ? "#0284c7" : "#b91c1c",
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
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : toast.type === "info" ? (
            <Sparkles size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {toast.message}
        </div>
      )}

      {/* Header Banner */}
      <div
        className="admin-card"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
          padding: "32px",
          borderRadius: "20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          boxShadow: "0 20px 40px rgba(15,23,42,0.15)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span
              style={{
                background: "rgba(212,32,39,0.25)",
                color: "#ff8085",
                fontSize: "11px",
                fontWeight: 900,
                padding: "4px 10px",
                borderRadius: "999px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: "1px solid rgba(212,32,39,0.3)",
              }}
            >
              KHO BÀI VIẾT TẬP TRUNG (1 FILE DUY NHẤT)
            </span>
            <span style={{ color: "#94a3b8", fontSize: "13px" }}>• data/enterprises.json</span>
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: 900, letterSpacing: "-0.03em" }}>
            {displayTitle}
          </h2>
          <p style={{ margin: 0, color: "#cbd5e1", fontSize: "14px", maxWidth: "660px", lineHeight: 1.6 }}>
            {displaySubtitle}
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <button
            type="button"
            onClick={() => setShowCrawler(!showCrawler)}
            style={{
              background: showCrawler ? "#d42027" : "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            <Sparkles size={16} />
            {showCrawler ? "Đóng công cụ Cào dữ liệu" : "Quét & Cào bài mới (Crawler)"}
          </button>

          <button
            type="button"
            onClick={() =>
              setEditingArticle({
                title: "",
                type: activeTypeTab !== "all" ? [activeTypeTab] : ["doanh-nghiep"],
                category: "Doanh nghiệp tiêu biểu",
                excerpt: "",
                content: "",
                image: "/images/news-placeholder.jpg",
                author: "Ban biên tập Hải Dương Media",
                views: "1",
                active: true,
                organizer: "Hải Dương Media & Đối tác",
                partner: "Hải Dương Media & Đối tác",
              })
            }
            style={{
              background: "#d42027",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 10px 20px rgba(212,32,39,0.35)",
            }}
          >
            <Plus size={16} />
            Thêm bài viết mới
          </button>

          <a
            href={
              activeTypeTab === "doanh-nhan"
                ? "/doanh-nhan"
                : activeTypeTab === "san-pham"
                ? "/san-pham"
                : activeTypeTab === "tin-tuc"
                ? "/tin-tuc"
                : activeTypeTab === "su-kien"
                ? "/su-kien"
                : "/doanh-nghiep"
            }
            target="_blank"
            style={{
              background: "#ffffff",
              color: "#0f172a",
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Xem website <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Type Quick Selector & Counter Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "14px",
        }}
      >
        {/* Doanh nghiệp */}
        <div
          onClick={() => setActiveTypeTab("doanh-nghiep")}
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "16px",
            border: activeTypeTab === "doanh-nghiep" ? "2px solid #d42027" : "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: activeTypeTab === "doanh-nghiep" ? "0 8px 20px rgba(212,32,39,0.12)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(212,32,39,0.1)",
                color: "#d42027",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 700 }}>Menu Doanh nghiệp</div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#0f172a" }}>Doanh nghiệp</div>
            </div>
          </div>
          <span
            style={{
              background: activeTypeTab === "doanh-nghiep" ? "#d42027" : "#f1f5f9",
              color: activeTypeTab === "doanh-nghiep" ? "#fff" : "#475569",
              fontSize: "14px",
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            {stats.dnCount}
          </span>
        </div>

        {/* Doanh nhân */}
        <div
          onClick={() => setActiveTypeTab("doanh-nhan")}
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "16px",
            border: activeTypeTab === "doanh-nhan" ? "2px solid #0284c7" : "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: activeTypeTab === "doanh-nhan" ? "0 8px 20px rgba(2,132,199,0.12)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(2,132,199,0.1)",
                color: "#0284c7",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 700 }}>Menu Doanh nhân</div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#0f172a" }}>Doanh nhân</div>
            </div>
          </div>
          <span
            style={{
              background: activeTypeTab === "doanh-nhan" ? "#0284c7" : "#f1f5f9",
              color: activeTypeTab === "doanh-nhan" ? "#fff" : "#475569",
              fontSize: "14px",
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            {stats.dnhanCount}
          </span>
        </div>

        {/* Sản phẩm */}
        <div
          onClick={() => setActiveTypeTab("san-pham")}
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "16px",
            border: activeTypeTab === "san-pham" ? "2px solid #16a34a" : "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: activeTypeTab === "san-pham" ? "0 8px 20px rgba(22,163,74,0.12)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(22,163,74,0.1)",
                color: "#16a34a",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Package size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 700 }}>Menu Sản phẩm</div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#0f172a" }}>Sản phẩm</div>
            </div>
          </div>
          <span
            style={{
              background: activeTypeTab === "san-pham" ? "#16a34a" : "#f1f5f9",
              color: activeTypeTab === "san-pham" ? "#fff" : "#475569",
              fontSize: "14px",
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            {stats.spCount}
          </span>
        </div>

        {/* Tin tức */}
        <div
          onClick={() => setActiveTypeTab("tin-tuc")}
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "16px",
            border: activeTypeTab === "tin-tuc" ? "2px solid #9333ea" : "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: activeTypeTab === "tin-tuc" ? "0 8px 20px rgba(147,51,234,0.12)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(147,51,234,0.1)",
                color: "#9333ea",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Newspaper size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 700 }}>Menu Tin tức</div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#0f172a" }}>Tin tức</div>
            </div>
          </div>
          <span
            style={{
              background: activeTypeTab === "tin-tuc" ? "#9333ea" : "#f1f5f9",
              color: activeTypeTab === "tin-tuc" ? "#fff" : "#475569",
              fontSize: "14px",
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            {stats.ttCount}
          </span>
        </div>

        {/* Sự kiện */}
        <div
          onClick={() => setActiveTypeTab("su-kien")}
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "16px",
            border: activeTypeTab === "su-kien" ? "2px solid #ea580c" : "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: activeTypeTab === "su-kien" ? "0 8px 20px rgba(234,88,12,0.12)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(234,88,12,0.1)",
                color: "#ea580c",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 700 }}>Menu Sự kiện</div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#0f172a" }}>Sự kiện & Diễn đàn</div>
            </div>
          </div>
          <span
            style={{
              background: activeTypeTab === "su-kien" ? "#ea580c" : "#f1f5f9",
              color: activeTypeTab === "su-kien" ? "#fff" : "#475569",
              fontSize: "14px",
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            {stats.skCount}
          </span>
        </div>

        {/* Popup Nổi Bật (Duy nhất 1 bài) */}
        <div
          onClick={() => setActiveTypeTab("popup")}
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "16px",
            border: activeTypeTab === "popup" ? "2px solid #e11d48" : "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: activeTypeTab === "popup" ? "0 8px 20px rgba(225,29,72,0.15)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(225,29,72,0.1)",
                color: "#e11d48",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Megaphone size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#e11d48", fontWeight: 700 }}>Popup Toàn Web (10s)</div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#0f172a" }}>Popup Nổi Bật</div>
            </div>
          </div>
          <span
            style={{
              background: activeTypeTab === "popup" ? "#e11d48" : (stats.popupCount > 0 ? "rgba(225,29,72,0.12)" : "#f1f5f9"),
              color: activeTypeTab === "popup" ? "#fff" : (stats.popupCount > 0 ? "#e11d48" : "#475569"),
              fontSize: "14px",
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            {stats.popupCount}
          </span>
        </div>

        {/* Tất cả bài viết */}
        <div
          onClick={() => setActiveTypeTab("all")}
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "16px",
            border: activeTypeTab === "all" ? "2px solid #0f172a" : "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: activeTypeTab === "all" ? "0 8px 20px rgba(15,23,42,0.12)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(15,23,42,0.08)",
                color: "#0f172a",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 700 }}>Kho tổng hợp</div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#0f172a" }}>Tất cả bài</div>
            </div>
          </div>
          <span
            style={{
              background: activeTypeTab === "all" ? "#0f172a" : "#f1f5f9",
              color: activeTypeTab === "all" ? "#fff" : "#475569",
              fontSize: "14px",
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            {stats.total}
          </span>
        </div>
      </div>

      {/* CRAWLER ACCORDION / TOOL (if toggled) */}
      {showCrawler && (
        <div style={{ animation: "fadeIn 0.25s ease-out" }}>
          <AdminCrawler />
        </div>
      )}

      {/* Banner cấu hình Tiêu đề & Giới thiệu Mục Sự kiện ngoài Trang chủ */}
      {activeTypeTab === "su-kien" && (
        <div
          style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
            border: "1px solid #fed7aa",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            boxShadow: "0 2px 10px rgba(234,88,12,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#ea580c",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <strong style={{ fontSize: "14px", color: "#9a3412", display: "block" }}>
                Tiêu đề & Giới thiệu Mục Sự Kiện ngoài Trang Chủ
              </strong>
              <span style={{ fontSize: "13px", color: "#7c2d12" }}>
                Bạn có thể cập nhật dòng nhãn nhỏ ("LỊCH TRÌNH..."), tiêu đề chính ("Sự Kiện Sắp Diễn Ra") và đoạn văn mô tả ngoài trang chủ tại đây.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={openEventHeadingModal}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "none",
              background: "#ea580c",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(234,88,12,0.25)",
            }}
          >
            <Edit3 size={15} /> Chỉnh sửa Tiêu đề & Giới thiệu Trang Chủ
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="admin-card"
        style={{
          background: "#fff",
          padding: "20px 24px",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#f8fafc",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              padding: "0 14px",
              minWidth: "260px",
              flex: "1 1 260px",
            }}
          >
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, tác giả, tóm tắt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                padding: "10px 0",
                fontSize: "13px",
                color: "#0f172a",
                outline: "none",
                width: "100%",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>
              Chuyên mục:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              <option value="all">Tất cả chuyên mục</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>
              Nguồn:
            </span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value as any)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              <option value="all">Tất cả nguồn</option>
              <option value="crawled">Bài cào từ Web</option>
              <option value="custom">Bài tự biên tập</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>
              Trạng thái:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="inactive">Đã ẩn</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchArticles}
          style={{
            background: "#f8fafc",
            border: "1px solid var(--line)",
            borderRadius: "10px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#475569",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Tải lại
        </button>
      </div>

      {/* Main Articles List Table */}
      <div
        className="admin-card"
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 24px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            background: selectedSlugs.length > 0 ? "rgba(212,32,39,0.04)" : "#fafbfd",
            gap: "12px",
            transition: "background 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            {/* Select All Checkbox */}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1e293b",
                cursor: "pointer",
                userSelect: "none",
                background: isAllSelected ? "#fee2e2" : "#fff",
                border: isAllSelected ? "1px solid #f87171" : "1px solid var(--line)",
                padding: "6px 12px",
                borderRadius: "8px",
                transition: "all 0.15s ease",
              }}
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                disabled={filteredArticles.length === 0}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#d42027",
                  cursor: "pointer",
                }}
              />
              <span>
                {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"} ({filteredArticles.length})
              </span>
            </label>

            <div style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>
              Đang lọc:{" "}
              <span style={{ color: "#d42027", textTransform: "uppercase", fontWeight: 800 }}>
                {activeTypeTab === "all" ? "Tất cả bài viết" : activeTypeTab}
              </span>{" "}
              ({filteredArticles.length} bài hiển thị / tổng {articles.length} bài)
            </div>
          </div>

          {/* Bulk Action Controls */}
          {selectedSlugs.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "#d42027",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: "999px",
                }}
              >
                Đã chọn {selectedSlugs.length} bài
              </span>

              <button
                type="button"
                onClick={() => setSelectedSlugs([])}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  background: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Bỏ chọn
              </button>

              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={deletingBatch}
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: deletingBatch ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(220,38,38,0.25)",
                }}
              >
                {deletingBatch ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {deletingBatch
                  ? "Đang xóa..."
                  : `Xóa ${selectedSlugs.length} bài đã chọn`}
              </button>
            </div>
          ) : (
            (search || selectedCategory !== "all" || selectedSource !== "all" || selectedStatus !== "all" || activeTypeTab !== defaultType) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedSource("all");
                  setSelectedStatus("all");
                  setActiveTypeTab(defaultType);
                }}
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--blue)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Đặt lại bộ lọc
              </button>
            )
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: "var(--blue)" }} />
            <p style={{ margin: 0, fontWeight: 700 }}>Đang nạp danh sách bài viết từ database...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
            <AlertCircle size={36} style={{ margin: "0 auto 12px", color: "#cbd5e1" }} />
            <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "#334155" }}>
              Không có bài viết nào thuộc menu này
            </h4>
            <p style={{ margin: 0, fontSize: "13px" }}>
              Hãy bấm <strong>"Thêm bài viết mới"</strong> hoặc sửa bài viết hiện có và tick chọn loại menu tương ứng.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid" }}>
            {filteredArticles.map((art, index) => {
              const isActive = art.active !== false;
              const hasSource = !!art.sourceUrl;
              const artTypes = getArticleTypes(art);
              const isSelected = selectedSlugs.includes(art.slug);

              return (
                <div
                  key={art.slug || art.id || index}
                  style={{
                    padding: "18px 24px",
                    borderBottom: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    background: isSelected ? "#fef2f2" : isActive ? "#ffffff" : "#fbfcfe",
                    borderLeft: isSelected ? "4px solid #dc2626" : "4px solid transparent",
                    opacity: isActive ? 1 : 0.75,
                    transition: "all 0.15s ease",
                  }}
                >
                  {/* Left: Checkbox & Thumbnail & Info */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", minWidth: 0, flex: 1 }}>
                    {/* Row Checkbox */}
                    <div style={{ paddingTop: "26px" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectArticle(art.slug)}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#d42027",
                          cursor: "pointer",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "110px",
                        height: "74px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#f1f5f9",
                        border: "1px solid var(--line)",
                        position: "relative",
                      }}
                    >
                      {art.image ? (
                        <img
                          src={art.image}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            (e.target as any).src = "/images/news-placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                          <ImageIcon size={24} color="#94a3b8" />
                        </div>
                      )}

                      {hasSource && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "4px",
                            left: "4px",
                            background: "rgba(15,23,42,0.85)",
                            color: "#fff",
                            fontSize: "9px",
                            fontWeight: 800,
                            padding: "2px 5px",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "2px",
                          }}
                        >
                          <Globe size={9} /> Cào web
                        </span>
                      )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      {/* Menu Types Badges (Multi-select) */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "6px",
                        }}
                      >
                        {artTypes.map((tId) => {
                          const tInfo = ARTICLE_TYPES.find((opt) => opt.id === tId);
                          if (!tInfo) return null;
                          const Icon = tInfo.icon;
                          return (
                            <span
                              key={tId}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: tInfo.bg,
                                color: tInfo.color,
                                border: `1px solid ${tInfo.border}`,
                                fontSize: "11px",
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              <Icon size={11} /> {tInfo.label}
                            </span>
                          );
                        })}

                        <span
                          style={{
                            background: "#f1f5f9",
                            color: "#475569",
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "6px",
                          }}
                        >
                          {art.category || "Chung"}
                        </span>

                        <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>
                          {art.date || "Hôm nay"}
                        </span>

                        {art.views && (
                          <span style={{ fontSize: "11px", color: "#64748b", background: "#f8fafc", padding: "2px 6px", borderRadius: "4px" }}>
                            👁 {art.views} lượt xem
                          </span>
                        )}

                        {art.author && (
                          <span style={{ fontSize: "11px", color: "#64748b" }}>• {art.author}</span>
                        )}
                      </div>

                      <h4
                        style={{
                          margin: "0 0 6px",
                          fontSize: "15px",
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1.4,
                        }}
                      >
                        <a
                          href={getArticleViewUrl(art)}
                          target="_blank"
                          style={{ color: "inherit", textDecoration: "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#d42027")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#0f172a")}
                        >
                          {art.title}
                        </a>
                      </h4>

                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: "13px",
                          color: "#64748b",
                          lineHeight: 1.45,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {art.excerpt}
                      </p>

                      {/* Hash & Details badges */}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => setShowHashDetails(art)}
                          style={{
                            border: "none",
                            background: "#f1f5f9",
                            color: "#475569",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title="Bấm để xem chi tiết mã băm SHA-256"
                        >
                          <Hash size={11} /> SHA-256
                        </button>

                        {art.content && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#059669",
                              background: "#ecfdf5",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FileText size={11} /> Có nội dung HTML
                          </span>
                        )}

                        {art.sourceUrl && (
                          <a
                            href={art.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: "11px",
                              color: "#0284c7",
                              background: "#f0f9ff",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontWeight: 700,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <ExternalLink size={11} /> {art.sourceUrl.startsWith("/") ? "Xem trang" : "Bài gốc"}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    {/* Toggle Active Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(art.slug)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 800,
                        border: "1px solid",
                        cursor: "pointer",
                        background: isActive ? "#f0fdf4" : "#fef2f2",
                        borderColor: isActive ? "#bbf7d0" : "#fecaca",
                        color: isActive ? "#15803d" : "#b91c1c",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      title="Bấm để bật hoặc ẩn bài viết"
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: isActive ? "#22c55e" : "#ef4444",
                        }}
                      />
                      {isActive ? "Hiển thị" : "Đã ẩn"}
                    </button>

                    {/* Quick Toggle Popup Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickTogglePopup(art.slug)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 800,
                        border: "1px solid",
                        cursor: "pointer",
                        background: artTypes.includes("popup") ? "#fff1f2" : "#f8fafc",
                        borderColor: artTypes.includes("popup") ? "#fecdd3" : "var(--line)",
                        color: artTypes.includes("popup") ? "#e11d48" : "#64748b",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "all 0.15s ease",
                      }}
                      title={
                        artTypes.includes("popup")
                          ? "Bài này đang là Popup duy nhất trên web (Bấm để hủy)"
                          : "Bấm để đặt bài này làm Popup nổi bật duy nhất trên website (Tự động thay thế bài cũ)"
                      }
                    >
                      <Megaphone size={13} color={artTypes.includes("popup") ? "#e11d48" : "#94a3b8"} />
                      {artTypes.includes("popup") ? "Đang là Popup" : "Đặt làm Popup"}
                    </button>

                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewArticle(art)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "#f8fafc",
                        border: "1px solid var(--line)",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#0f172a",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      title="Xem trước bài viết"
                    >
                      <Eye size={14} /> Xem
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => setEditingArticle(art)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "#f8fafc",
                        border: "1px solid var(--line)",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--blue)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      title="Chỉnh sửa nội dung & phân loại menu"
                    >
                      <Edit3 size={14} /> Sửa
                    </button>

                    {/* Web link */}
                    <a
                      href={getArticleViewUrl(art)}
                      target="_blank"
                      style={{
                        padding: "8px 10px",
                        borderRadius: "8px",
                        background: "#f8fafc",
                        border: "1px solid var(--line)",
                        color: "#64748b",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      title="Mở bài viết trên web"
                    >
                      <ExternalLink size={14} />
                    </a>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(art.slug, art.title)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "8px",
                        background: "#fff",
                        border: "1px solid #fee2e2",
                        color: "#dc2626",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      title="Xóa bài viết"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL: CHI TIẾT MÃ HASH SHA-256
          ========================================================= */}
      {showHashDetails && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(15,23,42,0.75)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
          onClick={() => setShowHashDetails(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              maxWidth: "600px",
              width: "100%",
              padding: "28px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={22} color="#16a34a" />
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 900 }}>Mã Hash SHA-256 Chống Trùng Lặp</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHashDetails(null)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "grid", gap: "12px", background: "#f8fafc", padding: "16px", borderRadius: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                  Tiêu đề bài viết:
                </span>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                  {showHashDetails.title}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                  Loại menu (Type):
                </span>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#d42027", marginTop: "2px" }}>
                  {getArticleTypes(showHashDetails).join(", ")}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                  Mã Hash Tổng Hợp (URL + Tiêu đề):
                </span>
                <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#d42027", fontWeight: 700, marginTop: "2px", wordBreak: "break-all" }}>
                  {(showHashDetails as any).hash || "Chưa tạo hash tổng"}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                  Mã Hash Nội Dung HTML:
                </span>
                <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#0284c7", fontWeight: 700, marginTop: "2px", wordBreak: "break-all" }}>
                  {(showHashDetails as any).contentHash || "Chưa tạo content hash"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowHashDetails(null)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CHỈNH SỬA / TẠO MỚI BÀI VIẾT (VỚI MULTI-SELECT TYPE)
          ========================================================= */}
      {editingArticle && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(15,23,42,0.8)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              maxWidth: "980px",
              width: "100%",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 28px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
                flexShrink: 0,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#0f172a" }}>
                  {editingArticle.slug ? "Chỉnh sửa bài viết" : "Thêm bài viết mới vào hệ thống"}
                </h3>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Lưu vào kho dữ liệu tập trung duy nhất (data/enterprises.json)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form
              onSubmit={handleSaveArticle}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              {/* Scrollable Form Body */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px 28px",
                }}
              >
                <div style={{ display: "grid", gap: "18px" }}>
                {/* MULTI-SELECT TYPE SECTION */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid var(--line)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      color: "#0f172a",
                      marginBottom: "6px",
                    }}
                  >
                    <Tag size={14} color="#d42027" /> Phân loại Menu hiển thị (Trường TYPE - Chọn được nhiều):
                  </label>
                  <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#64748b" }}>
                    Tick chọn để bài viết tự động chuyển sang và hiển thị tại các menu ngang tương ứng:
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                    {ARTICLE_TYPES.map((t) => {
                      const Icon = t.icon;
                      const selectedTypes = getArticleTypes(editingArticle);
                      const isChecked = selectedTypes.includes(t.id);

                      return (
                        <div
                          key={t.id}
                          onClick={() => handleToggleType(t.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: isChecked ? `2px solid ${t.color}` : "1px solid var(--line)",
                            background: isChecked ? t.bg : "#fff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            userSelect: "none",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by div onClick
                            style={{ width: "16px", height: "16px", accentColor: t.color, cursor: "pointer" }}
                          />
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Icon size={16} color={t.color} />
                            <span style={{ fontSize: "13px", fontWeight: 800, color: isChecked ? t.color : "#334155" }}>
                              {t.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                    Tiêu đề bài viết *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  />
                </div>

                {/* Category & Slug Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                      Chuyên mục
                    </label>
                    <select
                      value={editingArticle.category || CATEGORIES[0]}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "13px",
                        fontWeight: 600,
                        background: "#fff",
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                      Slug đường dẫn (Để trống để tự sinh từ tiêu đề)
                    </label>
                    <input
                      type="text"
                      value={editingArticle.slug || ""}
                      onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                      placeholder="vd: tieu-de-bai-viet"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </div>

                {/* Hidden File Input for Avatar */}
                <input
                  type="file"
                  ref={avatarFileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadAvatar(f);
                  }}
                />

                {/* Avatar Image with Live Preview & Picker Buttons */}
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                      <ImageIcon size={14} style={{ color: "#d42027" }} />
                      Ảnh đại diện bài viết (Thumbnail)
                    </label>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid #fecaca",
                          background: "#fee2e2",
                          color: "#d42027",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: uploadingAvatar ? "not-allowed" : "pointer",
                          boxShadow: "0 1px 2px rgba(220,38,38,0.06)",
                        }}
                      >
                        {uploadingAvatar ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                        {uploadingAvatar ? "Đang tải..." : "Tải ảnh từ máy"}
                      </button>

                      <button
                        type="button"
                        onClick={openAvatarLibrary}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid #bae6fd",
                          background: "#e0f2fe",
                          color: "#0284c7",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 1px 2px rgba(2,132,199,0.06)",
                        }}
                      >
                        <FolderOpen size={13} />
                        Chọn từ thư viện ảnh
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    {/* Live Preview Box */}
                    <div
                      style={{
                        width: "120px",
                        height: "80px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "#e2e8f0",
                        flexShrink: 0,
                        border: "1px solid #cbd5e1",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                      }}
                    >
                      {editingArticle.image ? (
                        <img
                          src={editingArticle.image}
                          alt="Xem trước ảnh đại diện"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/news-placeholder.jpg";
                          }}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "11px", padding: "4px" }}>
                          <ImageIcon size={22} style={{ display: "inline-block", marginBottom: "2px", color: "#cbd5e1" }} />
                          <div>Chưa có ảnh</div>
                        </div>
                      )}
                    </div>

                    {/* URL Input */}
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={editingArticle.image || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                        placeholder="Nhập link ảnh hoặc bấm 'Tải ảnh từ máy' / 'Chọn từ thư viện' phía trên..."
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "13px",
                          background: "#fff",
                          outline: "none",
                        }}
                      />
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "5px" }}>
                        💡 Ảnh đại diện sẽ hiển thị ở card trang chủ, chuyên mục và đầu bài viết.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Views Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                      Ngày đăng
                    </label>
                    <input
                      type="text"
                      value={editingArticle.date || ""}
                      onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                      placeholder="18/10/2026"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                      Lượt xem
                    </label>
                    <input
                      type="text"
                      value={editingArticle.views || ""}
                      onChange={(e) => setEditingArticle({ ...editingArticle, views: e.target.value })}
                      placeholder="150"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </div>

                {/* Author & Source URL */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                      Tác giả / Ban biên tập
                    </label>
                    <input
                      type="text"
                      value={editingArticle.author || ""}
                      onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                      Đường dẫn nguồn cào (Nếu có)
                    </label>
                    <input
                      type="text"
                      value={editingArticle.sourceUrl || ""}
                      onChange={(e) => setEditingArticle({ ...editingArticle, sourceUrl: e.target.value })}
                      placeholder="https://kinhtechaua.vn/..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                    Tóm tắt bài viết (Excerpt)
                  </label>
                  <textarea
                    rows={3}
                    value={editingArticle.excerpt || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  />
                </div>

                {/* Event Fields Section */}
                {getArticleTypes(editingArticle).includes("su-kien") ? (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                      border: "2px solid #ea580c",
                      borderRadius: "14px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      boxShadow: "0 4px 14px rgba(234, 88, 12, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px dashed #fdba74",
                        paddingBottom: "12px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Calendar size={18} color="#ea580c" />
                        <span style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase", color: "#9a3412" }}>
                          Thông tin chi tiết Sự kiện & Diễn đàn
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "99px",
                          background: "#ea580c",
                          color: "#fff",
                        }}
                      >
                        ✓ Kích hoạt do gắn loại Sự kiện
                      </span>
                    </div>

                    {/* Time & Contact Person */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                      <div>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#9a3412",
                            marginBottom: "6px",
                          }}
                        >
                          <Clock size={13} /> Thời gian diễn ra
                        </label>
                        <input
                          type="text"
                          value={editingArticle.time || ""}
                          onChange={(e) => setEditingArticle({ ...editingArticle, time: e.target.value })}
                          placeholder="vd: 08:00 - 17:30, Ngày 25/11/2026"
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "1px solid #fdba74",
                            fontSize: "13px",
                            background: "#fff",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#9a3412",
                            marginBottom: "6px",
                          }}
                        >
                          <Users size={13} /> Người phụ trách / Hotline
                        </label>
                        <input
                          type="text"
                          value={editingArticle.contactPerson || ""}
                          onChange={(e) => setEditingArticle({ ...editingArticle, contactPerson: e.target.value })}
                          placeholder="vd: Ban tổ chức - Hotline: 0988.xxx.xxx"
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "1px solid #fdba74",
                            fontSize: "13px",
                            background: "#fff",
                          }}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          color: "#9a3412",
                          marginBottom: "6px",
                        }}
                      >
                        <MapPin size={13} /> Địa điểm tổ chức
                      </label>
                      <input
                        type="text"
                        value={editingArticle.location || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, location: e.target.value })}
                        placeholder="vd: Trung tâm Hội nghị Tỉnh Hải Dương, 109 Phạm Ngũ Lão, TP. Hải Dương"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          border: "1px solid #fdba74",
                          fontSize: "13px",
                          background: "#fff",
                        }}
                      />
                    </div>

                    {/* Organizer & Partner */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                      <div>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#9a3412",
                            marginBottom: "6px",
                          }}
                        >
                          <Building2 size={13} /> Đơn vị tổ chức
                        </label>
                        <input
                          type="text"
                          value={editingArticle.organizer || ""}
                          onChange={(e) => setEditingArticle({ ...editingArticle, organizer: e.target.value })}
                          placeholder="vd: Hải Dương Media & Đối tác"
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "1px solid #fdba74",
                            fontSize: "13px",
                            background: "#fff",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#9a3412",
                            marginBottom: "6px",
                          }}
                        >
                          <Handshake size={13} /> Đơn vị đồng hành
                        </label>
                        <input
                          type="text"
                          value={editingArticle.partner || editingArticle.coOrganizer || ""}
                          onChange={(e) => setEditingArticle({ ...editingArticle, partner: e.target.value, coOrganizer: e.target.value })}
                          placeholder="vd: Hải Dương Media & Đối tác"
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "1px solid #fdba74",
                            fontSize: "13px",
                            background: "#fff",
                          }}
                        />
                      </div>
                    </div>

                    {/* Agenda */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          color: "#9a3412",
                          marginBottom: "6px",
                        }}
                      >
                        Lịch trình chi tiết (Agenda - Mỗi dòng 1 mốc)
                      </label>
                      <textarea
                        rows={4}
                        value={
                          Array.isArray(editingArticle.agenda)
                            ? editingArticle.agenda.join("\n")
                            : (editingArticle.agenda as unknown as string) || ""
                        }
                        onChange={(e) => setEditingArticle({ ...editingArticle, agenda: e.target.value as any })}
                        placeholder={`08:00 - 08:30: Đón tiếp đại biểu và check-in\n08:30 - 09:30: Phát biểu khai mạc và tọa đàm chính\n09:30 - 11:30: Kết nối giao thương B2B & Ký kết hợp tác`}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          border: "1px solid #fdba74",
                          fontSize: "13px",
                          lineHeight: 1.5,
                          background: "#fff",
                        }}
                      />
                    </div>

                    {/* Benefits */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          color: "#9a3412",
                          marginBottom: "6px",
                        }}
                      >
                        Quyền lợi đại biểu & Doanh nghiệp (Benefits - Mỗi dòng 1 quyền lợi)
                      </label>
                      <textarea
                        rows={4}
                        value={
                          Array.isArray(editingArticle.benefits)
                            ? editingArticle.benefits.join("\n")
                            : (editingArticle.benefits as unknown as string) || ""
                        }
                        onChange={(e) => setEditingArticle({ ...editingArticle, benefits: e.target.value as any })}
                        placeholder={`Được tiếp cận mạng lưới hơn 500 doanh nghiệp tiêu biểu\nĐược truyền thông thương hiệu trên cổng thông tin Hải Dương Media\nĐược nhận tài liệu và quà tặng kỷ niệm từ ban tổ chức`}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          border: "1px solid #fdba74",
                          fontSize: "13px",
                          lineHeight: 1.5,
                          background: "#fff",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px dashed #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "13px" }}>
                      <Calendar size={16} color="#94a3b8" />
                      <span>Bài viết này là Sự kiện / Diễn đàn? Thêm thời gian, địa điểm, lịch trình...</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleType("su-kien")}
                      style={{
                        background: "#fff7ed",
                        border: "1px solid #fdba74",
                        color: "#ea580c",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Plus size={14} /> Gán loại Sự kiện & Nhập thông tin
                    </button>
                  </div>
                )}

                {/* Content Visual & HTML Editor */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                    Nội dung chi tiết bài viết
                  </label>
                  <EnterpriseContentEditor
                    value={editingArticle.content || ""}
                    onChange={(val) => setEditingArticle({ ...editingArticle, content: val })}
                    onTitleSuggested={(suggestedTitle) => {
                      if (!editingArticle.title?.trim()) {
                        setEditingArticle((prev) => (prev ? { ...prev, title: suggestedTitle } : prev));
                        showToast("success", `Đã tự động điền tiêu đề từ file Word: "${suggestedTitle}"`);
                      }
                    }}
                  />
                </div>

                {/* Active Checkbox */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    id="art-active-chk"
                    checked={editingArticle.active !== false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, active: e.target.checked })}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <label htmlFor="art-active-chk" style={{ fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                    Xuất bản hiển thị trên website (Active)
                  </label>
                </div>
              </div>

              </div>
              {/* End Scrollable Form Body */}

              {/* Fixed Bottom Footer Bar - ALWAYS VISIBLE */}
              <div
                style={{
                  padding: "14px 28px",
                  borderTop: "1px solid var(--line)",
                  background: "#ffffff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0,
                  boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
                  zIndex: 20,
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#64748b" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: editingArticle.slug ? "#10b981" : "#3b82f6",
                      boxShadow: editingArticle.slug ? "0 0 8px rgba(16,185,129,0.5)" : "0 0 8px rgba(59,130,246,0.5)",
                    }}
                  />
                  <span>
                    {editingArticle.slug ? (
                      <>
                        Đang sửa: <strong style={{ color: "#0f172a" }}>{editingArticle.title ? (editingArticle.title.length > 40 ? editingArticle.title.slice(0, 40) + "..." : editingArticle.title) : "Bài viết"}</strong>
                      </>
                    ) : (
                      <strong style={{ color: "#0f172a" }}>Tạo mới bài viết vào Database</strong>
                    )}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "10px",
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      color: "#475569",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    disabled={savingEdit}
                    style={{
                      padding: "10px 24px",
                      borderRadius: "10px",
                      background: "#d42027",
                      color: "#fff",
                      border: "none",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 2px 10px rgba(212,32,39,0.3)",
                    }}
                  >
                    {savingEdit ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {savingEdit ? "Đang lưu..." : "Lưu vào Database"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: XEM TRƯỚC BÀI VIẾT (FULL PREVIEW)
          ========================================================= */}
      {previewArticle && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(15,23,42,0.85)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
          onClick={() => setPreviewArticle(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              maxWidth: "850px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#d42027",
                    textTransform: "uppercase",
                  }}
                >
                  Xem trước bài: {previewArticle.category}
                </span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  [{getArticleTypes(previewArticle).join(", ")}]
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 900, lineHeight: 1.35, marginBottom: "16px", color: "#0f172a" }}>
                {previewArticle.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  fontSize: "13px",
                  color: "#64748b",
                  borderBottom: "1px solid var(--line)",
                  paddingBottom: "16px",
                  marginBottom: "20px",
                }}
              >
                <span>📅 {previewArticle.date}</span>
                {previewArticle.author && <span>✍ {previewArticle.author}</span>}
                {previewArticle.views && <span>👁 {previewArticle.views} lượt xem</span>}
              </div>

              {previewArticle.excerpt && (
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: 1.6,
                    color: "#334155",
                    background: "#f8fafc",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    borderLeft: "4px solid #d42027",
                    marginBottom: "24px",
                  }}
                >
                  {previewArticle.excerpt}
                </div>
              )}

              {previewArticle.image && !previewArticle.content && (
                <div style={{ marginBottom: "24px", borderRadius: "12px", overflow: "hidden" }}>
                  <img
                    src={previewArticle.image}
                    alt=""
                    style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                  />
                </div>
              )}

              {previewArticle.content ? (
                <div
                  className="article-detail-body"
                  style={{ lineHeight: 1.8, fontSize: "15px", color: "#1e293b" }}
                  dangerouslySetInnerHTML={{ __html: previewArticle.content }}
                />
              ) : (
                <p style={{ fontStyle: "italic", color: "#94a3b8" }}>Chưa có nội dung chi tiết cho bài viết này.</p>
              )}
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
              }}
            >
              <a
                href={getArticleViewUrl(previewArticle)}
                target="_blank"
                style={{
                  color: "var(--blue)",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  textDecoration: "none",
                }}
              >
                Mở link trang web thực tế <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR LIBRARY PICKER MODAL */}
      {showAvatarPickerModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAvatarPickerModal(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid var(--line)",
                background: "#f8fafc",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ImageIcon size={18} style={{ color: "#d42027" }} />
                  Chọn ảnh đại diện từ thư viện
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Bấm vào bất kỳ ảnh nào để áp dụng làm ảnh đại diện cho bài viết này
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAvatarPickerModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: "6px",
                  borderRadius: "8px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Search filter */}
            <div style={{ padding: "12px 20px 0", background: "#fff" }}>
              <div style={{ position: "relative" }}>
                <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm file ảnh theo tên..."
                  value={searchAvatarLibrary}
                  onChange={(e) => setSearchAvatarLibrary(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "8px",
                    border: "1px solid var(--line)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Thumbnails grid */}
            <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1, minHeight: "280px" }}>
              {loadingAvatarLibrary ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  <Loader2 size={24} className="animate-spin" style={{ display: "inline-block", color: "#d42027", marginBottom: "8px" }} />
                  <p style={{ margin: 0, fontSize: "13px" }}>Đang nạp danh sách ảnh trong hệ thống...</p>
                </div>
              ) : (
                (() => {
                  const filtered = avatarLibraryImages.filter((img) =>
                    img.name.toLowerCase().includes(searchAvatarLibrary.toLowerCase())
                  );

                  if (filtered.length === 0) {
                    return (
                      <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                        <ImageIcon size={32} style={{ display: "inline-block", marginBottom: "8px", color: "#cbd5e1" }} />
                        <p style={{ margin: 0, fontSize: "13px" }}>Không tìm thấy ảnh nào phù hợp.</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {filtered.map((img) => {
                        const isCurrent = editingArticle?.image === img.url;
                        return (
                          <div
                            key={img.url}
                            onClick={() => {
                              setEditingArticle((prev) => (prev ? { ...prev, image: img.url } : prev));
                              setShowAvatarPickerModal(false);
                              showToast("success", "Đã chọn ảnh đại diện thành công!");
                            }}
                            style={{
                              position: "relative",
                              borderRadius: "10px",
                              overflow: "hidden",
                              border: isCurrent ? "2px solid #d42027" : "1px solid #e2e8f0",
                              cursor: "pointer",
                              aspectRatio: "1.33",
                              background: "#f1f5f9",
                              boxShadow: isCurrent ? "0 0 0 2px rgba(212,32,39,0.2)" : "none",
                              transition: "all 0.15s ease",
                            }}
                            title={img.name}
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            {isCurrent && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  background: "#d42027",
                                  color: "#fff",
                                  borderRadius: "50%",
                                  width: "20px",
                                  height: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                }}
                              >
                                <Check size={12} />
                              </div>
                            )}
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "rgba(15,23,42,0.75)",
                                color: "#fff",
                                fontSize: "10px",
                                padding: "3px 6px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {img.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                borderTop: "1px solid var(--line)",
                background: "#f8fafc",
              }}
            >
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Tổng số {avatarLibraryImages.length} ảnh trong thư viện
              </span>
              <button
                type="button"
                onClick={() => setShowAvatarPickerModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal chỉnh sửa Tiêu đề & Giới thiệu Mục Sự Kiện ngoài Trang Chủ */}
      {showEventHeadingModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !savingEventHeading) {
              setShowEventHeadingModal(false);
            }
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              width: "min(680px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "#ea580c",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                    Chỉnh sửa Tiêu đề & Giới thiệu Mục Sự Kiện
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Hiển thị trên Trang chủ (khối Sự Kiện Sắp Diễn Ra)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEventHeadingModal(false)}
                disabled={savingEventHeading}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px", display: "grid", gap: "16px" }}>
              {loadingEventHeading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
                  <Loader2 size={24} className="spin" style={{ margin: "0 auto 8px" }} />
                  <span>Đang tải thông tin...</span>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Dòng nhãn nhỏ (Eyebrow Badge)
                    </label>
                    <input
                      type="text"
                      value={eventHeadingData.eventsEyebrow}
                      onChange={(e) =>
                        setEventHeadingData((prev) => ({ ...prev, eventsEyebrow: e.target.value }))
                      }
                      placeholder="vd: LỊCH TRÌNH SỰ KIỆN 2026 – 2027"
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Tiêu đề chính mục Sự Kiện
                    </label>
                    <input
                      type="text"
                      value={eventHeadingData.eventsTitle}
                      onChange={(e) =>
                        setEventHeadingData((prev) => ({ ...prev, eventsTitle: e.target.value }))
                      }
                      placeholder="vd: Sự Kiện Sắp Diễn Ra"
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        fontSize: "14px",
                        fontWeight: 700,
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Đoạn văn mô tả / giới thiệu
                    </label>
                    <textarea
                      rows={4}
                      value={eventHeadingData.eventsDescription}
                      onChange={(e) =>
                        setEventHeadingData((prev) => ({ ...prev, eventsDescription: e.target.value }))
                      }
                      placeholder="Nhập đoạn văn mô tả giới thiệu các sự kiện..."
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Chữ trên nút xem tất cả sự kiện
                    </label>
                    <input
                      type="text"
                      value={eventHeadingData.eventsViewAllText}
                      onChange={(e) =>
                        setEventHeadingData((prev) => ({ ...prev, eventsViewAllText: e.target.value }))
                      }
                      placeholder="vd: Xem tất cả sự kiện"
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  {eventHeadingMsg && (
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 700,
                        background: eventHeadingMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                        color: eventHeadingMsg.type === "success" ? "#166534" : "#991b1b",
                        border: `1px solid ${eventHeadingMsg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                      }}
                    >
                      {eventHeadingMsg.text}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--line)",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowEventHeadingModal(false)}
                disabled={savingEventHeading}
                style={{
                  padding: "9px 18px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={saveEventHeading}
                disabled={savingEventHeading || loadingEventHeading}
                style={{
                  padding: "9px 22px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ea580c",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: savingEventHeading ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(234,88,12,0.3)",
                }}
              >
                {savingEventHeading ? (
                  <>
                    <Loader2 size={15} className="spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Check size={15} /> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
