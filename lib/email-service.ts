import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { eq } from "drizzle-orm";

export type SmtpConfig = {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
  from?: string;
};

const DB_SMTP_KEY = "smtp_config";
const LOCAL_SMTP_PATH = path.join(process.cwd(), "data", "smtp-config.json");

/**
 * Lấy cấu hình SMTP từ CSDL, file local, hoặc biến môi trường
 */
export async function getSmtpConfig(): Promise<SmtpConfig | null> {
  // 1. Kiểm tra CSDL
  try {
    const db = getDb();
    const [row] = await db.select().from(siteContent).where(eq(siteContent.key, DB_SMTP_KEY)).limit(1);
    if (row && row.data) {
      const parsed = JSON.parse(row.data) as SmtpConfig;
      if (parsed.host && parsed.user && parsed.pass) {
        return parsed;
      }
    }
  } catch {}

  // 2. Kiểm tra file local
  try {
    if (fs.existsSync(LOCAL_SMTP_PATH)) {
      const raw = fs.readFileSync(LOCAL_SMTP_PATH, "utf-8");
      const parsed = JSON.parse(raw) as SmtpConfig;
      if (parsed.host && parsed.user && parsed.pass) {
        return parsed;
      }
    }
  } catch {}

  // 3. Kiểm tra biến môi trường .env
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from = process.env.SMTP_FROM || user;

  if (host && user && pass) {
    return { host, port, secure, user, pass, from };
  }

  return null;
}

/**
 * Lưu cấu hình SMTP vào CSDL và file local
 */
export async function saveSmtpConfig(config: SmtpConfig): Promise<void> {
  try {
    const db = getDb();
    const values = {
      key: DB_SMTP_KEY,
      data: JSON.stringify(config),
      updatedBy: "admin",
      updatedAt: new Date(),
    };
    await db.insert(siteContent).values(values).onConflictDoUpdate({
      target: siteContent.key,
      set: values,
    });
  } catch {}

  try {
    const dir = path.dirname(LOCAL_SMTP_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_SMTP_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch {}
}

/**
 * Tạo Nodemailer transporter tối ưu hóa cho môi trường Cloudflare Workers / Vinext
 */
function createMailTransporter(config: SmtpConfig) {
  const host = config.host.toLowerCase();
  const cleanPass = config.pass.replace(/\s+/g, "");

  // Nếu là Gmail, ưu tiên sử dụng service gmail hoặc cổng 465 SSL trực tiếp
  if (host.includes("gmail")) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.user.trim(),
        pass: cleanPass,
      },
    });
  }

  const isSecure = config.secure ?? (config.port === 465);
  return nodemailer.createTransport({
    host: config.host.trim(),
    port: config.port,
    secure: isSecure,
    auth: {
      user: config.user.trim(),
      pass: config.pass.trim(),
    },
  });
}

/**
 * Kiểm tra kết nối SMTP
 */
export async function testSmtpConnection(config: SmtpConfig): Promise<{ success: boolean; error?: string }> {
  // 1. Thử gọi qua Node-level Vite Mail Dispatcher (giải quyết triệt để giới hạn TCP/proxy của Cloudflare Workers / Vinext)
  try {
    const res = await fetch("http://127.0.0.1:5173/__sites_mail_dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", config }),
    });
    if (res.ok) {
      const data = (await res.json()) as any;
      return data;
    }
  } catch {}

  // 2. Fallback sang transporter trực tiếp
  try {
    const transporter = createMailTransporter(config);
    await transporter.verify();
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Không thể kết nối đến máy chủ SMTP.";
    return { success: false, error: msg };
  }
}

/**
 * Gửi email chứa mã OTP đặt lại mật khẩu đến hòm thư người dùng
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  otp: string,
  recipientName = "Quản trị viên"
): Promise<{ success: boolean; error?: string }> {
  const config = await getSmtpConfig();

  // Log ra console máy chủ để tiện kiểm tra / debug
  console.log(`\n=======================================================`);
  console.log(`[EMAIL DISPATCH] Đang gửi OTP đến: ${toEmail}`);
  console.log(`[EMAIL DISPATCH] Mã OTP: ${otp} (Hiệu lực: 15 phút)`);
  console.log(`[EMAIL DISPATCH] Trạng thái cấu hình SMTP: ${config ? "Đã cấu hình (" + config.host + ")" : "Chưa cấu hình"}`);
  console.log(`=======================================================\n`);

  if (!config) {
    return {
      success: false,
      error:
        "Hệ thống chưa được cấu hình Email SMTP (Gmail / Brevo / SendGrid). Vui lòng cấu hình tài khoản gửi thư trong Cài đặt hệ thống hoặc file .env.",
    };
  }

  try {
    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã OTP Đặt Lại Mật Khẩu CMS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 560px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #d42027;">
      <div style="display: inline-block; background: rgba(212,32,39,0.2); border: 1px solid rgba(212,32,39,0.4); color: #ff8589; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; margin-bottom: 12px;">
        BẢO MẬT & PHÂN QUYỀN
      </div>
      <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">
        Hệ Thống Quản Trị CMS
      </h1>
      <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">
        Yêu cầu đặt lại mật khẩu truy cập hệ thống
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 28px;">
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
        Xin chào <strong>${recipientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản quản trị liên kết với địa chỉ email <strong>${toEmail}</strong>. Để tiếp tục, vui lòng sử dụng mã xác thực OTP bên dưới:
      </p>

      <!-- OTP Box -->
      <div style="text-align: center; margin: 28px 0; padding: 24px 20px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 14px;">
        <span style="display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
          Mã xác thực của bạn là:
        </span>
        <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #d42027; font-family: 'Courier New', Courier, monospace; text-shadow: 0 2px 4px rgba(212,32,39,0.1);">
          ${otp}
        </div>
        <span style="display: inline-block; margin-top: 10px; font-size: 12px; color: #d97706; background: #fef3c7; padding: 4px 10px; border-radius: 999px; font-weight: 600;">
          ⏱️ Mã có hiệu lực trong vòng 15 phút
        </span>
      </div>

      <!-- Warning Box -->
      <div style="background: #fff1f2; border-left: 4px solid #f43f5e; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #9f1239; line-height: 1.5;">
          <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã OTP này cho bất kỳ ai. Ban quản trị sẽ không bao giờ yêu cầu cung cấp mã OTP của bạn.
        </p>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">
        Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này hoặc liên hệ ngay với Quản trị viên cấp cao để kiểm tra bảo mật tài khoản.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
      Email này được gửi tự động từ Hệ thống Quản trị CMS. Vui lòng không trả lời trực tiếp email này.
    </div>
  </div>
</body>
</html>
    `;

    // 1. Thử gửi qua Node-level Vite Mail Dispatcher
    try {
      const res = await fetch("http://127.0.0.1:5173/__sites_mail_dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          config,
          to: toEmail,
          subject: `[${otp}] Mã OTP xác thực đặt lại mật khẩu CMS`,
          html: htmlContent,
          text: `Xin chào ${recipientName},\n\nMã xác thực OTP để đặt lại mật khẩu tài khoản CMS của bạn là: ${otp}\n\nMã có hiệu lực trong 15 phút.\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này.`,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.success) {
          console.log(`[EMAIL DISPATCH] Đã gửi thành công email OTP tới: ${toEmail} qua Dispatcher`);
          return { success: true };
        }
      }
    } catch {}

    // 2. Fallback sang transporter trực tiếp
    try {
      const transporter = createMailTransporter(config);
      const fromAddress = config.from || `"Hệ Thống CMS Quản Trị" <${config.user}>`;
      await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: `[${otp}] Mã OTP xác thực đặt lại mật khẩu CMS`,
        text: `Xin chào ${recipientName},\n\nMã xác thực OTP để đặt lại mật khẩu tài khoản CMS của bạn là: ${otp}\n\nMã có hiệu lực trong 15 phút.\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này.`,
        html: htmlContent,
      });

      console.log(`[EMAIL DISPATCH] Đã gửi thành công email OTP tới: ${toEmail}`);
      return { success: true };
    } catch (directErr) {
      console.error(`[EMAIL DISPATCH ERROR] Không thể gửi email:`, directErr);
      const msg = directErr instanceof Error ? directErr.message : "Lỗi gửi email từ máy chủ SMTP.";
      return {
        success: false,
        error: msg,
      };
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Lỗi xử lý gửi email.";
    return {
      success: false,
      error: msg,
    };
  }
}
