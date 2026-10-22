"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  KeyRound,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  X,
  Clock,
  Mail,
  User,
  Sparkles,
  Server,
  ChevronDown,
  ChevronUp,
  Send,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import type { AdminRole, SafeAdminUser } from "@/lib/admin-auth";

interface AdminAccountsManagerProps {
  currentUser?: SafeAdminUser | null;
}

export function AdminAccountsManager({ currentUser }: AdminAccountsManagerProps) {
  const [accounts, setAccounts] = useState<SafeAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Toggle ẩn/hiện mật khẩu
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  // Modal thêm tài khoản mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("editor");
  const [newPassword, setNewPassword] = useState("");
  const [adding, setAdding] = useState(false);

  // Modal đổi mật khẩu
  const [passwordModalAccount, setPasswordModalAccount] = useState<SafeAdminUser | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Modal chỉnh sửa thông tin tài khoản
  const [editModalAccount, setEditModalAccount] = useState<SafeAdminUser | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<AdminRole>("editor");
  const [updatingUser, setUpdatingUser] = useState(false);

  // Cấu hình Email SMTP (Dùng để gửi mã OTP khi quên mật khẩu)
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("");
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [showSmtpBox, setShowSmtpBox] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list-users" }),
      });
      const data = (await res.json()) as any;
      if (data.success && Array.isArray(data.users)) {
        setAccounts(data.users);
      }
    } catch {
      showToast("error", "Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSmtp = async () => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-smtp" }),
      });
      const data = (await res.json()) as any;
      if (data.success && data.config) {
        setSmtpHost(data.config.host || "smtp.gmail.com");
        setSmtpPort(String(data.config.port || 587));
        setSmtpUser(data.config.user || "");
        setSmtpPass(data.config.pass || "");
        setSmtpFrom(data.config.from || "");
        setSmtpConfigured(Boolean(data.config.user && data.config.pass));
      }
    } catch { }
  };

  useEffect(() => {
    fetchAccounts();
    fetchSmtp();
  }, []);

  // Thêm tài khoản mới
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim() || !newPassword.trim()) {
      showToast("error", "Vui lòng nhập đủ thông tin tài khoản và mật khẩu.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("error", "Mật khẩu phải có từ 6 ký tự trở lên.");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-user",
          username: newUsername.trim(),
          email: newEmail.trim(),
          fullName: newFullName.trim() || newUsername.trim(),
          role: newRole,
          password: newPassword,
        }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        showToast("success", data.message || "Tạo tài khoản mới thành công!");
        setShowAddModal(false);
        setNewUsername("");
        setNewEmail("");
        setNewFullName("");
        setNewPassword("");
        setNewRole("editor");
        if (data.users) setAccounts(data.users);
      } else {
        showToast("error", data.error || "Lỗi tạo tài khoản.");
      }
    } catch {
      showToast("error", "Lỗi gửi yêu cầu lên máy chủ.");
    } finally {
      setAdding(false);
    }
  };

  // Cập nhật đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalAccount) return;
    if (resetPasswordVal.length < 6) {
      showToast("error", "Mật khẩu mới phải từ 6 ký tự trở lên.");
      return;
    }
    if (resetPasswordVal !== confirmPasswordVal) {
      showToast("error", "Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-user",
          id: passwordModalAccount.id,
          newPassword: resetPasswordVal,
        }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        showToast("success", "Đã cập nhật mật khẩu mới thành công!");
        setPasswordModalAccount(null);
        setResetPasswordVal("");
        setConfirmPasswordVal("");
        if (data.users) setAccounts(data.users);
      } else {
        showToast("error", data.error || "Lỗi cập nhật mật khẩu.");
      }
    } catch {
      showToast("error", "Lỗi cập nhật mật khẩu.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Mở modal sửa tài khoản
  const openEditModal = (acc: SafeAdminUser) => {
    setEditModalAccount(acc);
    setEditUsername(acc.username);
    setEditFullName(acc.fullName);
    setEditEmail(acc.email);
    setEditRole(acc.role);
  };

  // Cập nhật thông tin tài khoản
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalAccount) return;
    if (!editUsername.trim() || !editFullName.trim() || !editEmail.trim()) {
      showToast("error", "Vui lòng nhập đầy đủ tên đăng nhập, họ tên và email.");
      return;
    }

    setUpdatingUser(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-user",
          id: editModalAccount.id,
          username: editUsername.trim(),
          fullName: editFullName.trim(),
          email: editEmail.trim(),
          role: editRole,
        }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        showToast("success", "Cập nhật thông tin tài khoản thành công!");
        setEditModalAccount(null);
        if (data.users) setAccounts(data.users);
      } else {
        showToast("error", data.error || "Lỗi cập nhật tài khoản.");
      }
    } catch {
      showToast("error", "Lỗi gửi yêu cầu đến máy chủ.");
    } finally {
      setUpdatingUser(false);
    }
  };

  // Lưu cấu hình Email SMTP
  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpHost.trim() || !smtpUser.trim() || !smtpPass.trim()) {
      showToast("error", "Vui lòng nhập đầy đủ Host, Email gửi và Mật khẩu ứng dụng.");
      return;
    }
    setSavingSmtp(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-smtp",
          host: smtpHost.trim(),
          port: Number(smtpPort) || 587,
          user: smtpUser.trim(),
          pass: smtpPass.replace(/\s+/g, ""),
          from: smtpFrom.trim(),
        }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        showToast("success", data.message || "Đã lưu và kết nối thành công Email SMTP!");
        setSmtpConfigured(true);
      } else {
        showToast("error", data.error || "Kiểm tra kết nối SMTP thất bại.");
      }
    } catch {
      showToast("error", "Lỗi gửi yêu cầu đến máy chủ.");
    } finally {
      setSavingSmtp(false);
    }
  };

  // Khóa / Mở khóa tài khoản
  const handleToggleStatus = async (account: SafeAdminUser) => {
    if (currentUser?.id === account.id) {
      showToast("error", "Bạn không thể tự khóa tài khoản của chính mình.");
      return;
    }

    const nextStatus = account.status === "active" ? "locked" : "active";
    const confirmMsg =
      nextStatus === "locked"
        ? `Bạn có chắc muốn KHÓA tài khoản "${account.username}"? Tài khoản này sẽ không thể đăng nhập vào CMS nữa.`
        : `MỞ KHÓA tài khoản "${account.username}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-user",
          id: account.id,
          status: nextStatus,
        }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        showToast("success", `Đã ${nextStatus === "locked" ? "khóa" : "mở khóa"} tài khoản thành công!`);
        if (data.users) setAccounts(data.users);
      } else {
        showToast("error", data.error || "Lỗi cập nhật trạng thái.");
      }
    } catch {
      showToast("error", "Lỗi gửi yêu cầu.");
    }
  };

  // Xóa tài khoản
  const handleDeleteAccount = async (account: SafeAdminUser) => {
    if (currentUser?.id === account.id) {
      showToast("error", "Không thể tự xóa tài khoản đang đăng nhập.");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn XÓA vĩnh viễn tài khoản "${account.username}" (${account.fullName}) khỏi hệ thống?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-user",
          id: account.id,
        }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        showToast("success", "Đã xóa tài khoản thành công!");
        if (data.users) setAccounts(data.users);
      } else {
        showToast("error", data.error || "Lỗi xóa tài khoản.");
      }
    } catch {
      showToast("error", "Lỗi xóa tài khoản.");
    }
  };

  // Filtered accounts list
  const filteredAccounts = accounts.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      a.username.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.fullName.toLowerCase().includes(q)
    );
  });

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case "super_admin":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "99px",
              fontSize: "11px",
              fontWeight: 800,
              background: "rgba(212,32,39,0.12)",
              color: "#d42027",
              border: "1px solid rgba(212,32,39,0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShieldCheck size={13} /> Quản Trị Cấp Cao (Super Admin)
          </span>
        );
      case "admin":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "99px",
              fontSize: "11px",
              fontWeight: 800,
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Shield size={13} /> Quản Trị Viên (Admin)
          </span>
        );
      case "editor":
      default:
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "99px",
              fontSize: "11px",
              fontWeight: 800,
              background: "#f1f5f9",
              color: "#475569",
              border: "1px solid #cbd5e1",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <User size={13} /> Biên Tập Viên (Editor)
          </span>
        );
    }
  };

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 99999,
            background: toast.type === "success" ? "#0f766e" : "#b91c1c",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
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

      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
          padding: "28px 32px",
          borderRadius: "20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
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
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <ShieldCheck size={12} /> BẢO MẬT & PHÂN QUYỀN CMS
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Tổng số: <strong>{accounts.length}</strong> tài khoản
            </span>
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 6px", color: "#fff" }}>
            Danh Sách Tài Khoản Truy Cập CMS
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
            Quản lý các tài khoản có quyền đăng nhập vào hệ thống quản trị CMS website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
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
            boxShadow: "0 8px 20px rgba(212,32,39,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          <UserPlus size={16} /> Thêm Tài Khoản Mới
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f8fafc",
            border: "1px solid var(--line)",
            borderRadius: "10px",
            padding: "8px 14px",
            width: "320px",
            maxWidth: "100%",
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Tìm theo tên đăng nhập, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "13px",
              width: "100%",
              color: "#0f172a",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "#64748b" }}>
          <span>
            Đang hoạt động:{" "}
            <strong style={{ color: "#166534" }}>
              {accounts.filter((a) => a.status === "active").length}
            </strong>
          </span>
          <span>•</span>
          <span>
            Bị khóa:{" "}
            <strong style={{ color: "#dc2626" }}>
              {accounts.filter((a) => a.status === "locked").length}
            </strong>
          </span>
        </div>
      </div>

      {/* Accounts Table Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        }}
      >
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: "#d42027" }} />
            <div>Đang tải danh sách tài khoản...</div>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
            <Users size={40} style={{ margin: "0 auto 12px", color: "#cbd5e1" }} />
            <h4 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px", color: "#0f172a" }}>
              Không tìm thấy tài khoản phù hợp
            </h4>
            <p style={{ margin: 0, fontSize: "13px" }}>Thử tìm kiếm với từ khóa khác.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--line)", color: "#475569" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>TÀI KHOẢN / HỌ TÊN</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>EMAIL LIÊN HỆ</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>VAI TRÒ / QUYỀN HẠN</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>TRẠNG THÁI</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>LẦN ĐĂNG NHẬP CUỐI</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800, textAlign: "right" }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc) => {
                  const isCurrent = currentUser?.id === acc.id;
                  return (
                    <tr
                      key={acc.id}
                      style={{
                        borderBottom: "1px solid var(--line)",
                        background: acc.status === "locked" ? "#f8fafc" : "#fff",
                      }}
                    >
                      {/* Username & FullName */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: isCurrent ? "#d42027" : "#0f172a",
                              color: "#fff",
                              display: "grid",
                              placeItems: "center",
                              fontWeight: 900,
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            {acc.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <strong style={{ fontSize: "14px", color: "#0f172a" }}>{acc.username}</strong>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    background: "#fee2e2",
                                    color: "#d42027",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  Bạn
                                </span>
                              )}
                            </div>
                            <small style={{ color: "var(--muted)", fontSize: "12px", display: "block" }}>
                              {acc.fullName}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: "14px 18px", color: "#334155" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Mail size={14} color="#94a3b8" />
                          <span>{acc.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: "14px 18px" }}>{getRoleBadge(acc.role)}</td>

                      {/* Status */}
                      <td style={{ padding: "14px 18px" }}>
                        {acc.status === "active" ? (
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "99px",
                              background: "#edfff4",
                              color: "#166534",
                              fontWeight: 700,
                              fontSize: "11px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a" }} />
                            Hoạt động
                          </span>
                        ) : (
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "99px",
                              background: "#fee2e2",
                              color: "#991b1b",
                              fontWeight: 700,
                              fontSize: "11px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626" }} />
                            Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td style={{ padding: "14px 18px", color: "var(--muted)", fontSize: "12px" }}>
                        {acc.lastLogin ? (
                          <span title={acc.lastLogin}>
                            {new Date(acc.lastLogin).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        ) : (
                          "Chưa đăng nhập"
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          {/* Chỉnh sửa thông tin */}
                          <button
                            type="button"
                            onClick={() => openEditModal(acc)}
                            title="Chỉnh sửa thông tin tài khoản"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid var(--line)",
                              background: "#fff",
                              color: "#0f172a",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Pencil size={13} color="#2563eb" /> Sửa
                          </button>

                          {/* Đổi mật khẩu */}
                          <button
                            type="button"
                            onClick={() => {
                              setPasswordModalAccount(acc);
                              setResetPasswordVal("");
                              setConfirmPasswordVal("");
                            }}
                            title="Đổi mật khẩu tài khoản"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid var(--line)",
                              background: "#fff",
                              color: "#0f172a",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <KeyRound size={13} color="#d42027" /> Đổi MK
                          </button>

                          {/* Khóa / Mở khóa */}
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(acc)}
                              title={acc.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "8px",
                                border: "1px solid var(--line)",
                                background: acc.status === "active" ? "#fff" : "#fee2e2",
                                color: acc.status === "active" ? "#64748b" : "#dc2626",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {acc.status === "active" ? <Lock size={14} /> : <Unlock size={14} />}
                            </button>
                          )}

                          {/* Xóa tài khoản */}
                          {!isCurrent && currentUser?.role === "super_admin" && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAccount(acc)}
                              title="Xóa tài khoản"
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "8px",
                                border: "1px solid #fee2e2",
                                background: "#fff",
                                color: "#dc2626",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          CẤU HÌNH EMAIL SMTP GỬI MÃ OTP
          ======================================================== */}
      <div
        style={{
          marginTop: "24px",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        <div
          onClick={() => setShowSmtpBox(!showSmtpBox)}
          style={{
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            background: showSmtpBox ? "#f8fafc" : "#ffffff",
            borderBottom: showSmtpBox ? "1px solid var(--line)" : "none",
            transition: "background 0.2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: smtpConfigured ? "#edfff4" : "#fef2f2",
                color: smtpConfigured ? "#166534" : "#dc2626",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Server size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                  Cấu hình Email SMTP (Dùng để gửi mã OTP khi Quên mật khẩu)
                </strong>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: smtpConfigured ? "#edfff4" : "#fff1f2",
                    color: smtpConfigured ? "#166534" : "#e11d48",
                    border: `1px solid ${smtpConfigured ? "#bbf7d0" : "#fecdd3"}`,
                  }}
                >
                  {smtpConfigured ? "✓ Đã kết nối gửi mail" : "Chưa cấu hình gửi mail"}
                </span>
              </div>
              <span style={{ fontSize: "13px", color: "var(--muted)", display: "block", marginTop: "2px" }}>
                Hệ thống sử dụng tài khoản email này để tự động gửi mã OTP xác nhận về hòm thư người dùng khi quên mật khẩu.
              </span>
            </div>
          </div>

          <div style={{ color: "#64748b" }}>
            {showSmtpBox ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        {showSmtpBox && (
          <form onSubmit={handleSaveSmtp} style={{ padding: "24px" }}>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                fontSize: "13px",
                lineHeight: 1.6,
                marginBottom: "20px",
              }}
            >
              <strong>💡 Hướng dẫn gửi bằng Gmail:</strong>
              <ol style={{ margin: "6px 0 0", paddingLeft: "20px" }}>
                <li>Bật <strong>Xác minh 2 bước</strong> trong tài khoản Google (myaccount.google.com/security).</li>
                <li>Truy cập mục <strong>Mật khẩu ứng dụng (App Passwords)</strong>: myaccount.google.com/apppasswords</li>
                <li>Tạo mật khẩu ứng dụng mới (16 chữ số) và dán vào ô <strong>Mật khẩu ứng dụng</strong> bên dưới.</li>
              </ol>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Máy chủ SMTP (Host):
                </label>
                <input
                  type="text"
                  required
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Cổng (Port):
                </label>
                <input
                  type="number"
                  required
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  placeholder="587"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Tài khoản Email gửi (User):
                </label>
                <input
                  type="email"
                  required
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="example@gmail.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Mật khẩu ứng dụng (App Password):
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showSmtpPass ? "text" : "password"}
                    required
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="Mật khẩu ứng dụng 16 ký tự..."
                    style={{
                      width: "100%",
                      padding: "10px 42px 10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--line)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                    title={showSmtpPass ? "Ẩn mật khẩu ứng dụng" : "Hiện mật khẩu ứng dụng"}
                  >
                    {showSmtpPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                Tên hiển thị người gửi (From Name):
              </label>
              <input
                type="text"
                value={smtpFrom}
                onChange={(e) => setSmtpFrom(e.target.value)}
                placeholder='vd: "Ban Quản Trị Website" <email@domain.com>'
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="submit"
                disabled={savingSmtp}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: savingSmtp ? "not-allowed" : "pointer",
                }}
              >
                {savingSmtp ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {savingSmtp ? "Đang kiểm tra kết nối..." : "Lưu & Kiểm tra kết nối SMTP"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================
          MODAL 1: THÊM TÀI KHOẢN MỚI
          ======================================================== */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fafbfd",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(212,32,39,0.1)",
                    color: "#d42027",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                    Thêm Tài Khoản Truy Cập Mới
                  </h3>
                  <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                    Tạo tài khoản đăng nhập vào CMS cho nhân viên
                  </small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} style={{ padding: "24px", display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Tên đăng nhập (Username) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="vd: quang.media hoặc bientap1"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Họ và tên người sử dụng
                </label>
                <input
                  type="text"
                  placeholder="vd: Nguyễn Văn A"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Email liên hệ *
                </label>
                <input
                  type="email"
                  required
                  placeholder="vd: user@haiduongmedia.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Mật khẩu khởi tạo * (tối thiểu 6 ký tự)
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu ban đầu..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 42px 10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                    title={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Phân quyền vai trò
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "13px",
                    fontWeight: 700,
                    background: "#fff",
                  }}
                >
                  <option value="editor">Biên Tập Viên (Đăng bài, chỉnh sửa bài viết & sự kiện)</option>
                  <option value="admin">Quản Trị Viên (Quản lý toàn bộ nội dung website & bài viết)</option>
                  {currentUser?.role === "super_admin" && (
                    <option value="super_admin">Quản Trị Cấp Cao (Toàn quyền quản trị & tạo tài khoản)</option>
                  )}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#d42027",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: adding ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {adding ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ĐỔI MẬT KHẨU
          ======================================================== */}
      {passwordModalAccount && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setPasswordModalAccount(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fafbfd",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "#fee2e2",
                    color: "#d42027",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                    Đổi Mật Khẩu
                  </h3>
                  <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                    Tài khoản: <strong>{passwordModalAccount.username}</strong> ({passwordModalAccount.fullName})
                  </small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalAccount(null)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} style={{ padding: "24px", display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Mật khẩu mới (tối thiểu 6 ký tự) *
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showResetPassword ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu mới..."
                    value={resetPasswordVal}
                    onChange={(e) => setResetPasswordVal(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 42px 10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                    title={showResetPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Nhập lại mật khẩu mới *
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Xác nhận lại mật khẩu mới..."
                    value={confirmPasswordVal}
                    onChange={(e) => setConfirmPasswordVal(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 42px 10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                    title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setPasswordModalAccount(null)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#16a34a",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: updatingPassword ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {updatingPassword ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Lưu Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CHỈNH SỬA THÔNG TIN TÀI KHOẢN
          ======================================================== */}
      {editModalAccount && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
          onClick={() => setEditModalAccount(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fafbfd",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(37, 99, 235, 0.1)",
                    color: "#2563eb",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                    Chỉnh Sửa Thông Tin Tài Khoản
                  </h3>
                  <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                    Cập nhật thông tin cho tài khoản: <strong>{editModalAccount.username}</strong>
                  </small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalAccount(null)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} style={{ padding: "24px", display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Tên đăng nhập (Username) *
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  disabled={currentUser?.role !== "super_admin"}
                  onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                    background: currentUser?.role !== "super_admin" ? "#f1f5f9" : "#fff",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Họ và tên người sử dụng *
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="vd: Nguyễn Văn A"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Email liên hệ *
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="vd: user@domain.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                  Vai trò & Phân quyền CMS *
                </label>
                <select
                  value={editRole}
                  disabled={currentUser?.role !== "super_admin"}
                  onChange={(e) => setEditRole(e.target.value as AdminRole)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "14px",
                    background: currentUser?.role !== "super_admin" ? "#f1f5f9" : "#fff",
                  }}
                >
                  <option value="editor">Biên Tập Viên (Editor) - Quản lý bài viết & nội dung</option>
                  <option value="admin">Quản Trị Viên (Admin) - Toàn quyền nội dung & sự kiện</option>
                  <option value="super_admin">Quản Trị Cấp Cao (Super Admin) - Toàn quyền hệ thống</option>
                </select>
                {currentUser?.role !== "super_admin" && (
                  <small style={{ color: "#94a3b8", fontSize: "11px", display: "block", marginTop: "4px" }}>
                    * Chỉ Quản trị viên cấp cao nhất mới có thể đổi vai trò hoặc tên đăng nhập.
                  </small>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditModalAccount(null)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updatingUser}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: updatingUser ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {updatingUser ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
