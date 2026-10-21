"use client";

import React, { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
} from "lucide-react";
import Link from "@/components/link";

interface AdminLoginProps {
  onSuccess?: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status message
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Xử lý đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          usernameOrEmail: usernameOrEmail.trim(),
          password,
          remember,
        }),
      });

      const data = (await res.json()) as any;
      if (data.success) {
        setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");
        if (onSuccess) {
          onSuccess();
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 400);
        }
      } else {
        setErrorMsg(data.error || "Tài khoản hoặc mật khẩu không chính xác.");
      }
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Bước 1 Quên mật khẩu: Yêu cầu mã OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setErrorMsg("Vui lòng nhập tài khoản hoặc email cần khôi phục.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "forgot-password",
          usernameOrEmail: forgotIdentifier.trim(),
        }),
      });

      const data = (await res.json()) as any;
      if (data.success) {
        setOtpCode("");
        setSuccessMsg(data.message || `Mã OTP xác thực đã được gửi đến email ${forgotIdentifier}.`);
        setForgotStep(2);
      } else {
        setErrorMsg(data.error || "Không tìm thấy tài khoản hoặc lỗi gửi email.");
      }
    } catch {
      setErrorMsg("Lỗi gửi yêu cầu khôi phục.");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2 Quên mật khẩu: Xác nhận đổi mật khẩu
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMsg("Vui lòng nhập mã OTP.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Xác nhận mật khẩu mới không trùng khớp.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          usernameOrEmail: forgotIdentifier.trim(),
          otp: otpCode.trim(),
          newPassword,
        }),
      });

      const data = (await res.json()) as any;
      if (data.success) {
        setSuccessMsg(data.message || "Đặt lại mật khẩu thành công!");
        setUsernameOrEmail(forgotIdentifier);
        setPassword(newPassword);
        setTimeout(() => {
          setMode("login");
          setForgotStep(1);
        }, 1500);
      } else {
        setErrorMsg(data.error || "Mã OTP không hợp lệ.");
      }
    } catch {
      setErrorMsg("Lỗi cập nhật mật khẩu.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 20%, #1e293b 0%, #0a0f1d 80%)",
        padding: "24px",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "300px",
          background: "radial-gradient(circle, rgba(212,32,39,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Back to Home Link */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#94a3b8",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            <ArrowLeft size={16} /> Quay lại trang chủ website
          </Link>
        </div>

        {/* Login Main Card */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "24px",
            padding: "36px 32px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.45), 0 0 40px rgba(212,32,39,0.1)",
          }}
        >
          {/* Card Header Brand */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(212,32,39,0.15)",
                border: "1px solid rgba(212,32,39,0.35)",
                color: "#ff6b70",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.08em",
                marginBottom: "14px",
              }}
            >
              <ShieldCheck size={14} /> HỆ THỐNG CMS QUẢN TRỊ
            </div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 900,
                color: "#ffffff",
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              {mode === "login" ? "Đăng Nhập Quản Trị Viên" : "Khôi Phục Mật Khẩu"}
            </h1>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
              {mode === "login"
                ? "Hệ thống quản lý nội dung & truyền thông bảo mật CMS"
                : "Nhận mã OTP xác thực và tạo mật khẩu đăng nhập mới"}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(220, 38, 38, 0.15)",
                border: "1px solid rgba(220, 38, 38, 0.4)",
                color: "#fca5a5",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
                animation: "fadeIn 0.2s ease-out",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(22, 163, 74, 0.15)",
                border: "1px solid rgba(22, 163, 74, 0.4)",
                color: "#86efac",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
                animation: "fadeIn 0.2s ease-out",
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================
              MODE 1: FORM ĐĂNG NHẬP
              ======================================================== */}
          {mode === "login" && (
            <form onSubmit={handleLogin} style={{ display: "grid", gap: "18px" }}>
              {/* Username / Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#cbd5e1",
                    marginBottom: "8px",
                  }}
                >
                  Tài khoản hoặc Email
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    transition: "border-color 0.2s",
                  }}
                >
                  <User size={18} color="#94a3b8" />
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="admin hoặc email..."
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "#fff",
                      fontSize: "14px",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#cbd5e1",
                    }}
                  >
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      if (usernameOrEmail) setForgotIdentifier(usernameOrEmail);
                    }}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#ff6b70",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}
                >
                  <Lock size={18} color="#94a3b8" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "#fff",
                      fontSize: "14px",
                      width: "100%",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontSize: "13px",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{
                    accentColor: "#d42027",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
                Ghi nhớ đăng nhập trên thiết bị này (30 ngày)
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "6px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #d42027 0%, #b91c1c 100%)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 900,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 8px 24px rgba(212,32,39,0.35)",
                  transition: "all 0.2s ease",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Đang kiểm tra...
                  </>
                ) : (
                  <>
                    Đăng Nhập CMS <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>
          )}

          {/* ========================================================
              MODE 2: FORM QUÊN MẬT KHẨU
              ======================================================== */}
          {mode === "forgot" && (
            <div>
              {forgotStep === 1 ? (
                <form onSubmit={handleRequestOtp} style={{ display: "grid", gap: "18px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "#cbd5e1",
                        marginBottom: "8px",
                      }}
                    >
                      Nhập Tên đăng nhập hoặc Email đã đăng ký:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                      }}
                    >
                      <User size={18} color="#94a3b8" />
                      <input
                        type="text"
                        required
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="vd: admin hoặc admin@haiduongmedia.com"
                        style={{
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          color: "#fff",
                          fontSize: "14px",
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "14px",
                      borderRadius: "12px",
                      background: "#d42027",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 800,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
                    Tạo Mã Xác Thực OTP Khôi Phục
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#94a3b8",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <ArrowLeft size={15} /> Quay lại trang đăng nhập
                  </button>
                </form>
              ) : (
                /* Bước 2: Nhập OTP và Mật khẩu mới */
                <form onSubmit={handleConfirmReset} style={{ display: "grid", gap: "16px" }}>
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: "rgba(59, 130, 246, 0.12)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      color: "#bfdbfe",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <Mail size={18} color="#60a5fa" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      Mã OTP gồm 6 chữ số đã được gửi tới email <strong>{forgotIdentifier}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc mục Thư rác / Spam) và nhập mã vào ô bên dưới.
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "#cbd5e1",
                        marginBottom: "6px",
                      }}
                    >
                      Mã OTP (6 chữ số):
                    </label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="vd: 123456"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: 800,
                        letterSpacing: "4px",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "#cbd5e1",
                        marginBottom: "6px",
                      }}
                    >
                      Mật khẩu mới (tối thiểu 6 ký tự):
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                      }}
                    >
                      <Lock size={18} color="#94a3b8" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới..."
                        style={{
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          color: "#fff",
                          fontSize: "14px",
                          width: "100%",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          border: "none",
                          background: "none",
                          color: "#94a3b8",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "#cbd5e1",
                        marginBottom: "6px",
                      }}
                    >
                      Nhập lại mật khẩu mới:
                    </label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận lại mật khẩu mới..."
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      marginTop: "6px",
                      padding: "14px",
                      borderRadius: "12px",
                      background: "#16a34a",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 800,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 8px 24px rgba(22,163,74,0.3)",
                    }}
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                    Xác Nhận Đặt Lại Mật Khẩu
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#94a3b8",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    ← Quay lại nhập tài khoản khác
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
