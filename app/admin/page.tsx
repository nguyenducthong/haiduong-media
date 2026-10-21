import Link from "@/components/link";
import { ArrowLeft, ExternalLink, Shield } from "lucide-react";
import { getLoggedInAdminUser } from "@/lib/admin-auth";
import { loadSiteContent } from "@/lib/site-content";
import AdminEditor from "./admin-editor";
import { AdminLogin } from "@/components/admin-login";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getLoggedInAdminUser();
  if (!user) {
    return <AdminLogin />;
  }

  const content = await loadSiteContent();

  const roleLabels: Record<string, string> = {
    super_admin: "Quản trị tối cao",
    admin: "Quản trị viên",
    editor: "Biên tập viên",
  };

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <Link href="/">
            <ArrowLeft size={17} /> Về website
          </Link>
          <span>Hệ thống quản trị nội dung</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
            <small style={{ color: "var(--muted)", fontSize: "11px" }}>Đang đăng nhập</small>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <strong style={{ fontSize: "14px", color: "var(--navy)" }}>{user.fullName || user.username}</strong>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "999px",
                  background: user.role === "super_admin" ? "#fef2f2" : "#f1f5f9",
                  color: user.role === "super_admin" ? "#dc2626" : "#475569",
                  border: `1px solid ${user.role === "super_admin" ? "#fecaca" : "#cbd5e1"}`,
                }}
              >
                <Shield size={11} /> {roleLabels[user.role] || user.role}
              </span>
            </div>
          </div>
          <Link href="/" target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            Xem trang <ExternalLink size={15} />
          </Link>
          <AdminLogoutButton />
        </div>
      </header>
      <section className="admin-intro">
        <div>
          <span className="eyebrow">{content?.brandName ? `CMS Quản trị • ${content.brandName}` : "Hệ thống CMS Quản trị"}</span>
          <h1>Quản lý nội dung website</h1>
          <p>
            Chỉnh sửa nội dung hiển thị trên các trang, quản lý bài viết và danh sách tài khoản truy cập hệ thống.
          </p>
        </div>
        <div className="admin-status">
          <i /> Website đang hoạt động
        </div>
      </section>
      <AdminEditor initialContent={content} currentUser={user} />
    </main>
  );
}

