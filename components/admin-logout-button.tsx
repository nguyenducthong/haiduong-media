"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

export function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?")) {
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      window.location.href = "/admin";
    } catch {
      window.location.reload();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title="Đăng xuất khỏi tài khoản"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 700,
        border: "1px solid #fee2e2",
        background: "#fff1f2",
        color: "#dc2626",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = "#fee2e2";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "#fff1f2";
      }}
    >
      {loading ? <Loader2 size={13} className="spin" /> : <LogOut size={13} />}
      <span>Đăng xuất</span>
    </button>
  );
}
