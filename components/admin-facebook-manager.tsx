"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
  UploadCloud,
  Edit3,
  Eye,
  Plus,
  Check,
  Loader2,
  X,
  ExternalLink,
  Image as ImageIcon,
  Save,
  Trash2,
  AlertCircle,
  FileText,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { EnterpriseContentEditor } from "@/components/enterprise-content-editor";
import { DEFAULT_FACEBOOK_ARTICLES } from "@/lib/default-facebook-articles";

interface FacebookArticle {
  id: string;
  slug: string;
  name?: string;
  title?: string;
  category: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  coverImage?: string;
  date?: string;
  publishedAt?: string;
  author?: string;
  active?: boolean;
  subtitle?: string;
  tags?: string[] | string;
  isHot?: boolean;
}

export function AdminFacebookManager() {
  const [articles, setArticles] = useState<FacebookArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingArticle, setEditingArticle] = useState<FacebookArticle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Client-side image compress fallback (khi upload lỗi hoặc file lớn)
  const compressClientImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const raw = e.target?.result as string;
        if (!raw) return reject(new Error("Không thể đọc file"));
        const img = new Image();
        img.onload = () => {
          const maxW = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(raw);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => resolve(raw);
        img.src = raw;
      };
      reader.onerror = () => reject(new Error("Lỗi đọc file"));
      reader.readAsDataURL(file);
    });
  };

  const handleUploadImage = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("error", "Vui lòng chọn đúng tệp hình ảnh (.jpg, .png, .webp...).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast("error", "Dung lượng ảnh tối đa cho phép là 15MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json().catch(() => null) as any;
        if (data && data.url) {
          if (editingArticle) {
            setEditingArticle({ ...editingArticle, image: data.url });
          }
          showToast("success", "Đã tải ảnh đại diện lên thành công!");
          return;
        }
      }

      // Fallback nén ảnh client-side sang Data URL
      const dataUrl = await compressClientImage(file);
      if (editingArticle) {
        setEditingArticle({ ...editingArticle, image: dataUrl });
      }
      showToast("success", "Đã nén và chọn ảnh đại diện từ thiết bị thành công!");
    } catch (err: any) {
      showToast("error", err?.message || "Không thể tải ảnh lên. Hãy thử lại!");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Fetch Facebook articles
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawl-doanh-nghiep?action=list-saved");
      if (!res.ok) throw new Error("Không thể tải danh sách bài viết");
      const data: any = await res.json();
      const all: FacebookArticle[] = Array.isArray(data) ? data : data.articles || [];
      let fbList = all.filter(
        (a) =>
          a.category === "Dịch vụ Facebook" ||
          (Array.isArray((a as any).type) && (a as any).type.includes("dich-vu-facebook"))
      );
      if (fbList.length === 0) {
        fbList = DEFAULT_FACEBOOK_ARTICLES as any[];
      }
      setArticles(fbList);
    } catch (err: any) {
      setError(err?.message || "Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleEdit = (art: FacebookArticle) => {
    setEditingArticle({
      ...art,
      title: art.title || art.name || "",
      summary: art.summary || art.excerpt || "",
      content: art.content || "",
      image: art.image || art.coverImage || "",
      category: "Dịch vụ Facebook",
      subtitle: art.subtitle || "",
      tags: Array.isArray(art.tags) ? art.tags.join(", ") : (art.tags || ""),
      isHot: Boolean(art.isHot),
    });
  };

  const handleCreateNew = () => {
    const newId = `fb-${Date.now()}`;
    setEditingArticle({
      id: newId,
      slug: `dich-vu-fb-moi-${Date.now().toString().slice(-4)}`,
      title: "",
      name: "",
      category: "Dịch vụ Facebook",
      summary: "",
      content: "<p>Nội dung chi tiết dịch vụ...</p>",
      image: "/uploads/facebook/lay-lai-facebook.jpg",
      date: new Date().toISOString().split("T")[0],
      author: "Hải Dương Media",
      active: true,
      subtitle: "Hỗ trợ 24/7 - Làm trước trả tiền sau",
      tags: "Facebook, Bảo mật, Không cọc",
      isHot: false,
    });
  };

  const handleDelete = async (art: FacebookArticle) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${art.title || art.name}" không?`)) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", slug: art.slug }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Đã xóa dịch vụ Facebook thành công!");
        await fetchArticles();
      } else {
        showToast("error", data.error || "Lỗi khi xóa bài viết.");
      }
    } catch (err: any) {
      showToast("error", err?.message || "Lỗi kết nối khi xóa.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncDefaultArticles = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          articles: DEFAULT_FACEBOOK_ARTICLES,
          mode: "merge",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể đồng bộ dữ liệu");
      }
      showToast("success", "Đã lưu 10 bài dịch vụ Facebook vào Database online thành công!");
      await fetchArticles();
    } catch (err: any) {
      showToast("error", err.message || "Lỗi khi đồng bộ dữ liệu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title?.trim()) {
      showToast("error", "Vui lòng nhập tiêu đề dịch vụ.");
      return;
    }

    if (!editingArticle.slug?.trim()) {
      showToast("error", "Vui lòng nhập đường dẫn (Slug).");
      return;
    }

    setIsSaving(true);
    try {
      const cleanSlug = editingArticle.slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");

      const tagsArray =
        typeof editingArticle.tags === "string"
          ? editingArticle.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : Array.isArray(editingArticle.tags)
          ? editingArticle.tags
          : ["Facebook", "Bảo mật"];

      const payload = {
        ...editingArticle,
        slug: cleanSlug,
        name: editingArticle.title,
        excerpt: editingArticle.summary,
        category: "Dịch vụ Facebook",
        type: ["dich-vu-facebook", "san-pham"],
        subtitle: editingArticle.subtitle?.trim() || "Dịch vụ Facebook chuyên nghiệp",
        tags: tagsArray,
        isHot: Boolean(editingArticle.isHot),
      };

      const res = await fetch("/api/crawl-doanh-nghiep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-single",
          article: payload,
        }),
      });

      const data: any = await res.json();
      if (data.success) {
        showToast("success", "Đã lưu nội dung dịch vụ Facebook thành công!");
        setEditingArticle(null);
        fetchArticles();
      } else {
        showToast("error", data.error || "Lỗi khi lưu dữ liệu.");
      }
    } catch (err: any) {
      showToast("error", err?.message || "Lỗi kết nối khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed var(--line)" }}>
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 999999,
            padding: "12px 20px",
            borderRadius: "10px",
            background: toastMsg.type === "success" ? "#15803d" : "#b91c1c",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {toastMsg.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          {toastMsg.text}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Share2 size={18} style={{ color: "#1877f2" }} />
            Danh Sách & Soạn Thảo ({articles.length}) Dịch Vụ Facebook
          </h4>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
            Bấm "Thêm dịch vụ mới" để tạo bài viết mới hoặc "Chỉnh sửa bài viết" để cập nhật nội dung, hình ảnh, bảng biểu.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleSyncDefaultArticles}
          disabled={isSaving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            background: "#059669",
            color: "#fff",
            border: "none",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(5,150,105,0.25)",
          }}
        >
          <Sparkles size={15} /> Đồng bộ 10 bài mẫu vào DB
        </button>

        <button
          type="button"
          onClick={handleCreateNew}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "8px",
            background: "#1877f2",
            color: "#fff",
            border: "none",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(24,119,242,0.3)",
          }}
        >
          <Plus size={15} /> Thêm dịch vụ mới
        </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)", fontSize: "14px" }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
          Đang tải danh sách 10 dịch vụ Facebook...
        </div>
      ) : error ? (
        <div style={{ padding: "16px", background: "#fef2f2", color: "#b91c1c", borderRadius: "10px", fontSize: "13px" }}>
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)", background: "var(--surface)", borderRadius: "10px" }}>
          Hệ thống chưa nạp dữ liệu vào DB. Bấm "Đồng bộ 10 bài mẫu vào DB" ở trên để lưu vào hệ thống!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {articles.map((art, index) => {
            const title = art.title || art.name || "Dịch vụ Facebook";
            const img = art.image || art.coverImage || "/uploads/facebook/lay-lai-facebook.jpg";
            return (
              <div
                key={art.id || art.slug || index}
                className="fb-article-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", width: "22px" }}>
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>

                  <img
                    src={img}
                    alt={title}
                    style={{
                      width: "56px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/uploads/facebook/lay-lai-facebook.jpg";
                    }}
                  />

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {title}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>/{art.slug}</span>
                      <span style={{ color: "#cbd5e1" }}>•</span>
                      <span>{art.date || "Cập nhật gần đây"}</span>
                    </div>
                  </div>
                </div>

                <div className="fb-article-actions" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <a
                    href={`/dich-vu-facebook/${art.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      color: "#475569",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <Eye size={13} /> Xem bài
                  </a>

                  <button
                    type="button"
                    onClick={() => handleEdit(art)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#1877f2",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(24,119,242,0.25)",
                    }}
                  >
                    <Edit3 size={13} /> Sửa
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(art)}
                    disabled={isSaving}
                    title="Xóa dịch vụ này"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      border: "1px solid #fee2e2",
                      background: "#fff",
                      color: "#dc2626",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL SOẠN THẢO BÀI VIẾT DỊCH VỤ FACEBOOK */}
      {editingArticle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSaving) setEditingArticle(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              width: "100%",
              maxWidth: "1100px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Edit3 size={18} style={{ color: "#1877f2" }} />
                  {editingArticle.title ? `Soạn thảo: ${editingArticle.title}` : "Thêm dịch vụ Facebook mới"}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Trình soạn thảo chuyên nghiệp cho Dịch vụ Facebook • Hỗ trợ Bảng biểu, Hình ảnh, Font chữ
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <a
                  href={`/dich-vu-facebook/${editingArticle.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#1877f2",
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ExternalLink size={14} /> Mở trang thực tế
                </a>

                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  disabled={isSaving}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    color: "#64748b",
                    padding: "6px",
                    borderRadius: "8px",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Row 1: Title & Slug */}
              <div className="fb-modal-row-title" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Tiêu đề dịch vụ Facebook *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    placeholder="vd: Dịch Vụ Lấy Lại Facebook Uy Tín – Làm Xong Mới Thanh Toán"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      fontWeight: 600,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Đường dẫn tĩnh (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.slug || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    placeholder="vd: lay-lai-facebook"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      fontFamily: "monospace",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Row 1b: Subtitle, Tags & HOT badge */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr auto", gap: "16px", alignItems: "flex-end" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Lời khuyên phụ / Dòng chú thích (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.subtitle || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                    placeholder="vd: Hỗ trợ 24/7 - Xử lý cấp tốc trong 5-10 phút"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Thẻ phân loại / Tags (cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.tags || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, tags: e.target.value })}
                    placeholder="vd: Lấy lại nick, Bảo mật, Không cọc, Fanpage"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ paddingBottom: "10px" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#dc2626" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(editingArticle.isHot)}
                      onChange={(e) => setEditingArticle({ ...editingArticle, isHot: e.target.checked })}
                      style={{ width: "16px", height: "16px", accentColor: "#dc2626" }}
                    />
                    🔥 Dịch vụ HOT
                  </label>
                </div>
              </div>

              {/* Row 2: Image & Excerpt */}
              <div className="fb-modal-row-image" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "16px" }}>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                      <ImageIcon size={16} color="#1877f2" /> Ảnh đại diện bài viết
                    </label>
                    {uploadingImage && (
                      <span style={{ fontSize: "12px", color: "#1877f2", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                        <Loader2 size={13} className="animate-spin" /> Đang tải lên...
                      </span>
                    )}
                  </div>

                  {/* Nút bấm tải từ máy tính + dán link */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUploadImage(f);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        background: "#1877f2",
                        color: "#fff",
                        border: "none",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <UploadCloud size={15} /> Tải ảnh từ máy tính
                    </button>

                    {editingArticle.image && (
                      <button
                        type="button"
                        onClick={() => setEditingArticle({ ...editingArticle, image: "" })}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "1px solid #fecaca",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} /> Gỡ ảnh
                      </button>
                    )}
                  </div>

                  {/* Input nhập URL thủ công */}
                  <input
                    type="text"
                    value={editingArticle.image || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                    placeholder="Hoặc dán URL ảnh: /uploads/facebook/... hoặc https://..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12.5px",
                      background: "#fff",
                      marginBottom: "10px",
                    }}
                  />

                  {/* Khung Preview Ảnh */}
                  {editingArticle.image ? (
                    <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #cbd5e1", maxHeight: "150px", background: "#e2e8f0" }}>
                      <img
                        src={editingArticle.image}
                        alt="Preview"
                        style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/uploads/facebook/lay-lai-facebook.jpg";
                        }}
                      />
                      <div style={{ position: "absolute", bottom: "6px", left: "8px", background: "rgba(15,23,42,0.8)", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "4px" }}>
                        ✓ Ảnh đang chọn
                      </div>
                    </div>
                  ) : (
                    <div style={{ height: "64px", borderRadius: "8px", border: "1px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "12px" }}>
                      Chưa có ảnh đại diện (bấm nút trên để tải ảnh)
                    </div>
                  )}

                  {/* Gợi ý ảnh Facebook có sẵn trong hệ thống */}
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "6px" }}>
                      Chọn nhanh ảnh Facebook chuẩn có sẵn:
                    </div>
                    <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                      {[
                        { label: "Lấy lại nick", src: "/uploads/facebook/lay-lai-facebook.jpg" },
                        { label: "Bị Hack", src: "/uploads/facebook/lay-lai-facebook-bi-hack.jpg" },
                        { label: "Két sắt 956", src: "/uploads/facebook/facebook-khoa-956.jpg" },
                        { label: "Treo 282", src: "/uploads/facebook/vo-hieu-hoa-282.jpg" },
                        { label: "Lỗi 2FA", src: "/uploads/facebook/ma-dang-nhap-2fa.jpg" },
                        { label: "Tích xanh", src: "/uploads/facebook/dich-vu-len-tich-xanh.png" },
                        { label: "Bảo mật", src: "/uploads/facebook/bao-mat-facebook.jpg" },
                        { label: "Bản quyền", src: "/uploads/facebook/bao-ve-ban-quyen.jpg" },
                        { label: "Khủng hoảng", src: "/uploads/facebook/xu-ly-khung-hoang.jpg" },
                      ].map((item) => (
                        <button
                          key={item.src}
                          type="button"
                          onClick={() => setEditingArticle({ ...editingArticle, image: item.src })}
                          style={{
                            flexShrink: 0,
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: editingArticle.image === item.src ? "2px solid #1877f2" : "1px solid #cbd5e1",
                            background: editingArticle.image === item.src ? "#eff6ff" : "#fff",
                            color: editingArticle.image === item.src ? "#1877f2" : "#475569",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Đoạn mô tả ngắn / Tóm tắt (Excerpt)
                  </label>
                  <textarea
                    rows={4}
                    value={editingArticle.summary || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                    placeholder="Mô tả ngắn gọn về dịch vụ, giải pháp và cam kết làm trước trả tiền sau..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Full Rich Text Editor (có hỗ trợ chèn BẢNG!) */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                  Nội dung chi tiết bài viết (Trình soạn thảo chuẩn - Hỗ trợ Bảng biểu, Hình ảnh)
                </label>
                <EnterpriseContentEditor
                  value={editingArticle.content || ""}
                  onChange={(val) => setEditingArticle({ ...editingArticle, content: val })}
                  minHeight="480px"
                />
              </div>

              {/* Modal Footer Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  disabled={isSaving}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#1877f2",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: isSaving ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 8px rgba(24,119,242,0.3)",
                  }}
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
