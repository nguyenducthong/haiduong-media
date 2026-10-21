import { NextResponse } from "next/server";
import {
  authenticateAdmin,
  confirmPasswordReset,
  createSessionToken,
  getLoggedInAdminUser,
  hashPassword,
  loadAdminAccounts,
  requestPasswordReset,
  saveAdminAccounts,
  type AdminAccount,
  type AdminRole,
} from "@/lib/admin-auth";
import { getSmtpConfig, saveSmtpConfig, testSmtpConnection } from "@/lib/email-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    const { action } = body || {};

    // 1. ĐĂNG NHẬP
    if (action === "login") {
      const { usernameOrEmail, password, remember } = body;
      if (!usernameOrEmail || !password) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập tài khoản và mật khẩu." },
          { status: 400 }
        );
      }

      const authRes = await authenticateAdmin(usernameOrEmail, password);
      if (!authRes.success || !authRes.user) {
        return NextResponse.json(
          { success: false, error: authRes.error || "Đăng nhập thất bại." },
          { status: 401 }
        );
      }

      const token = createSessionToken(authRes.user, Boolean(remember));
      const response = NextResponse.json({
        success: true,
        message: "Đăng nhập thành công!",
        user: authRes.user,
      });

      // Lưu cookie session (30 ngày nếu tick nhớ, hoặc 1 ngày)
      const maxAge = remember ? 30 * 24 * 3600 : 24 * 3600;
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/",
      });

      return response;
    }

    // 2. ĐĂNG XUẤT
    if (action === "logout") {
      const response = NextResponse.json({
        success: true,
        message: "Đã đăng xuất khỏi hệ thống CMS.",
      });
      response.cookies.delete("admin_session");
      return response;
    }

    // 3. LẤY THÔNG TIN TÀI KHOẢN ĐANG ĐĂNG NHẬP
    if (action === "me") {
      const user = await getLoggedInAdminUser();
      return NextResponse.json({ success: Boolean(user), user });
    }

    // 4. QUÊN MẬT KHẨU (YÊU CẦU MÃ OTP)
    if (action === "forgot-password") {
      const { usernameOrEmail } = body;
      if (!usernameOrEmail) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập tài khoản hoặc email." },
          { status: 400 }
        );
      }

      const res = await requestPasswordReset(usernameOrEmail);
      return NextResponse.json(res, { status: res.success ? 200 : 400 });
    }

    // 5. ĐẶT LẠI MẬT KHẨU BẰNG MÃ OTP
    if (action === "reset-password") {
      const { usernameOrEmail, otp, newPassword } = body;
      if (!usernameOrEmail || !otp || !newPassword) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập đủ thông tin và mật khẩu mới." },
          { status: 400 }
        );
      }

      const res = await confirmPasswordReset(usernameOrEmail, otp, newPassword);
      return NextResponse.json(res, { status: res.success ? 200 : 400 });
    }

    // ==========================================
    // CÁC HÀNH ĐỘNG CẦN QUYỀN ĐĂNG NHẬP ADMIN
    // ==========================================
    const currentUser = await getLoggedInAdminUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Phiên đăng nhập hết hạn hoặc chưa đăng nhập." },
        { status: 401 }
      );
    }

    // 6. DANH SÁCH TÀI KHOẢN TRUY CẬP
    if (action === "list-users") {
      const accounts = await loadAdminAccounts();
      const safeAccounts = accounts.map(({ passwordHash: _, resetOtp: __, ...acc }) => acc);
      return NextResponse.json({ success: true, users: safeAccounts });
    }

    // 7. THÊM TÀI KHOẢN MỚI
    if (action === "create-user") {
      if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Chỉ Quản trị viên cấp cao mới có quyền thêm tài khoản." },
          { status: 403 }
        );
      }

      const { username, email, fullName, role, password } = body;
      if (!username || !email || !password || password.length < 6) {
        return NextResponse.json(
          { success: false, error: "Vui lòng điền đủ thông tin và mật khẩu từ 6 ký tự." },
          { status: 400 }
        );
      }

      const accounts = await loadAdminAccounts();
      const normalizedUser = username.trim().toLowerCase();
      const normalizedEmail = email.trim().toLowerCase();

      if (accounts.some((a) => a.username.toLowerCase() === normalizedUser)) {
        return NextResponse.json(
          { success: false, error: "Tên đăng nhập này đã tồn tại." },
          { status: 400 }
        );
      }

      if (accounts.some((a) => a.email.toLowerCase() === normalizedEmail)) {
        return NextResponse.json(
          { success: false, error: "Email này đã được sử dụng." },
          { status: 400 }
        );
      }

      const newAccount: AdminAccount = {
        id: `admin-${Date.now()}`,
        username: normalizedUser,
        email: normalizedEmail,
        fullName: (fullName || username).trim(),
        role: (role as AdminRole) || "editor",
        passwordHash: hashPassword(password),
        status: "active",
        createdAt: new Date().toISOString(),
      };

      accounts.push(newAccount);
      await saveAdminAccounts(accounts);

      const safeAccounts = accounts.map(({ passwordHash: _, resetOtp: __, ...acc }) => acc);
      return NextResponse.json({
        success: true,
        message: "Tạo tài khoản mới thành công!",
        users: safeAccounts,
      });
    }

    // 8. CẬP NHẬT TÀI KHOẢN / ĐỔI MẬT KHẨU
    if (action === "update-user") {
      const { id, username, fullName, email, role, status, newPassword } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: "Thiếu ID tài khoản." }, { status: 400 });
      }

      const accounts = await loadAdminAccounts();
      const targetIndex = accounts.findIndex((a) => a.id === id);
      if (targetIndex === -1) {
        return NextResponse.json({ success: false, error: "Tài khoản không tồn tại." }, { status: 404 });
      }

      // Check permissions: Chỉ super_admin/admin hoặc chính user đó mới được sửa
      if (currentUser.role !== "super_admin" && currentUser.id !== id) {
        return NextResponse.json(
          { success: false, error: "Bạn không có quyền chỉnh sửa tài khoản này." },
          { status: 403 }
        );
      }

      const target = accounts[targetIndex];

      // Cập nhật Họ và tên
      if (fullName !== undefined) {
        if (!fullName.trim()) {
          return NextResponse.json({ success: false, error: "Họ và tên không được để trống." }, { status: 400 });
        }
        target.fullName = fullName.trim();
      }

      // Cập nhật Email (kiểm tra trùng lặp)
      if (email !== undefined) {
        const normEmail = email.trim().toLowerCase();
        if (!normEmail) {
          return NextResponse.json({ success: false, error: "Email không được để trống." }, { status: 400 });
        }
        if (normEmail !== target.email.toLowerCase()) {
          const emailExists = accounts.some((a) => a.id !== id && a.email.toLowerCase() === normEmail);
          if (emailExists) {
            return NextResponse.json({ success: false, error: "Email này đã được sử dụng bởi tài khoản khác." }, { status: 400 });
          }
          target.email = normEmail;
        }
      }

      // Cập nhật Username (chỉ super_admin)
      if (username !== undefined && currentUser.role === "super_admin") {
        const normUser = username.trim().toLowerCase();
        if (!normUser) {
          return NextResponse.json({ success: false, error: "Tên đăng nhập không được để trống." }, { status: 400 });
        }
        if (normUser !== target.username.toLowerCase()) {
          const userExists = accounts.some((a) => a.id !== id && a.username.toLowerCase() === normUser);
          if (userExists) {
            return NextResponse.json({ success: false, error: "Tên đăng nhập này đã tồn tại." }, { status: 400 });
          }
          target.username = normUser;
        }
      }

      // Cập nhật Vai trò (chỉ super_admin)
      if (role && currentUser.role === "super_admin") {
        target.role = role as AdminRole;
      }

      // Cập nhật Trạng thái (chỉ super_admin và không tự khóa chính mình)
      if (status && currentUser.role === "super_admin" && target.id !== currentUser.id) {
        target.status = status;
      }

      // Đổi mật khẩu
      if (newPassword && newPassword.length >= 6) {
        target.passwordHash = hashPassword(newPassword);
      }

      await saveAdminAccounts(accounts);
      const safeAccounts = accounts.map(({ passwordHash: _, resetOtp: __, ...acc }) => acc);
      return NextResponse.json({
        success: true,
        message: "Cập nhật tài khoản thành công!",
        users: safeAccounts,
      });
    }

    // 9. XÓA TÀI KHOẢN
    if (action === "delete-user") {
      if (currentUser.role !== "super_admin") {
        return NextResponse.json(
          { success: false, error: "Chỉ Quản trị viên cấp cao nhất mới có quyền xóa tài khoản." },
          { status: 403 }
        );
      }

      const { id } = body;
      if (id === currentUser.id) {
        return NextResponse.json(
          { success: false, error: "Không thể tự xóa tài khoản của chính bạn đang đăng nhập." },
          { status: 400 }
        );
      }

      let accounts = await loadAdminAccounts();
      accounts = accounts.filter((a) => a.id !== id);
      await saveAdminAccounts(accounts);

      const safeAccounts = accounts.map(({ passwordHash: _, resetOtp: __, ...acc }) => acc);
      return NextResponse.json({
        success: true,
        message: "Đã xóa tài khoản thành công!",
        users: safeAccounts,
      });
    }

    // 9. LẤY CẤU HÌNH EMAIL SMTP
    if (action === "get-smtp") {
      const currentUser = await getLoggedInAdminUser();
      if (!currentUser) {
        return NextResponse.json({ success: false, error: "Chưa đăng nhập." }, { status: 401 });
      }

      const smtpConfig = await getSmtpConfig();
      return NextResponse.json({
        success: true,
        config: smtpConfig
          ? {
              ...smtpConfig,
              pass: smtpConfig.pass ? "••••••••" : "",
            }
          : null,
      });
    }

    // 10. LƯU & KIỂM TRA CẤU HÌNH EMAIL SMTP
    if (action === "save-smtp") {
      const currentUser = await getLoggedInAdminUser();
      if (!currentUser || currentUser.role !== "super_admin") {
        return NextResponse.json(
          { success: false, error: "Chỉ Quản trị viên cấp cao nhất mới có quyền cấu hình Email SMTP." },
          { status: 403 }
        );
      }

      const { host, port, user, pass, secure, from } = body;
      if (!host || !user) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập đầy đủ Máy chủ SMTP (Host) và Email người gửi." },
          { status: 400 }
        );
      }

      const existing = await getSmtpConfig();
      const finalPass = pass && pass !== "••••••••" ? pass : existing?.pass || "";
      if (!finalPass) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập Mật khẩu ứng dụng (App Password) cho tài khoản email." },
          { status: 400 }
        );
      }

      const isGmail = host.toLowerCase().includes("gmail");
      const normalizedPort = Number(port) || (isGmail ? 465 : 587);

      const newConfig = {
        host: host.trim(),
        port: normalizedPort,
        user: user.trim(),
        pass: finalPass.replace(/\s+/g, ""),
        secure: isGmail ? true : Boolean(secure),
        from: from ? from.trim() : user.trim(),
      };

      const testRes = await testSmtpConnection(newConfig);
      if (!testRes.success) {
        return NextResponse.json(
          { success: false, error: `Kiểm tra kết nối thất bại: ${testRes.error}` },
          { status: 400 }
        );
      }

      await saveSmtpConfig(newConfig);
      return NextResponse.json({
        success: true,
        message: "Đã kết nối và lưu cấu hình Email SMTP thành công!",
      });
    }

    return NextResponse.json({ success: false, error: "Hành động không hợp lệ." }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Auth API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi máy chủ nội bộ." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const user = await getLoggedInAdminUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Chưa đăng nhập." }, { status: 401 });
  }
  return NextResponse.json({ success: true, user });
}

