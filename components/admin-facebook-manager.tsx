"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
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
} from "lucide-react";
import { EnterpriseContentEditor } from "@/components/enterprise-content-editor";

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
}

export function AdminFacebookManager() {
  const [articles, setArticles] = useState<FacebookArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingArticle, setEditingArticle] = useState<FacebookArticle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch Facebook articles
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawl-doanh-nghiep?action=list-saved");
      if (!res.ok) throw new Error("Không thể tải danh sách bài viết");
      const data: any = await res.json();
      const all: FacebookArticle[] = Array.isArray(data) ? data : data.articles || [];
      const fbList = all.filter(
        (a) =>
          a.category === "Dịch vụ Facebook" ||
          (Array.isArray((a as any).type) && (a as any).type.includes("dich-vu-facebook"))
      );
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
    });
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

      const payload = {
        ...editingArticle,
        slug: cleanSlug,
        name: editingArticle.title,
        excerpt: editingArticle.summary,
        category: "Dịch vụ Facebook",
        type: ["dich-vu-facebook"],
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Share2 size={18} style={{ color: "#1877f2" }} />
            Danh Sách & Soạn Thảo Nội Dung 10 Dịch Vụ Facebook Con
          </h4>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
            Bấm "Chỉnh sửa bài viết" để mở trình soạn thảo chuyên nghiệp (định dạng chữ, ảnh, BẢNG BIỂU).
          </p>
        </div>

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
          Chưa tìm thấy dịch vụ Facebook nào trong hệ thống.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {articles.map((art, index) => {
            const title = art.title || art.name || "Dịch vụ Facebook";
            const img = art.image || art.coverImage || "/uploads/facebook/lay-lai-facebook.jpg";
            return (
              <div
                key={art.id || art.slug || index}
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

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
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
                    <Edit3 size={13} /> Chỉnh sửa bài viết
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
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
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

              {/* Row 2: Image & Excerpt */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Đường dẫn ảnh đại diện (Image URL)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.image || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                    placeholder="/uploads/facebook/..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                      marginBottom: "8px",
                    }}
                  />
                  {editingArticle.image && (
                    <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", maxHeight: "90px" }}>
                      <img
                        src={editingArticle.image}
                        alt="Preview"
                        style={{ width: "100%", height: "90px", objectFit: "cover" }}
                      />
                    </div>
                  )}
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
