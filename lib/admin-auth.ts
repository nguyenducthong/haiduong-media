import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { cookies } from "next/headers";
import { sendPasswordResetEmail } from "./email-service";

export type AdminRole = "super_admin" | "admin" | "editor";

export type AdminAccount = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: AdminRole;
  passwordHash: string;
  status: "active" | "locked";
  createdAt: string;
  lastLogin?: string;
  resetOtp?: {
    code: string;
    expiresAt: number;
  };
};

export type SafeAdminUser = Omit<AdminAccount, "passwordHash" | "resetOtp">;

const SALT = "haiduong_salt_2026";
const SECRET_KEY = process.env.ADMIN_AUTH_SECRET || "haiduong-media-admin-secret-key-2026";
const DB_KEY = "admin_accounts";
const LOCAL_PATH = path.join(process.cwd(), "data", "admin-accounts.json");

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "_" + SALT).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createSessionToken(user: SafeAdminUser, remember = false): string {
  const maxAge = remember ? 30 * 24 * 3600 * 1000 : 24 * 3600 * 1000;
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
    exp: Date.now() + maxAge,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(payloadStr).digest("base64url");
  return `${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; username: string; role: AdminRole; email: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", SECRET_KEY).update(payloadStr).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export const defaultAdminAccounts: AdminAccount[] = [
  {
    id: "admin-1",
    username: "admin",
    email: "admin@haiduongmedia.com",
    fullName: "Quản Trị Viên Cấp Cao",
    role: "super_admin",
    passwordHash: "fcba7a769b331ef7efab482a1ea56ce5459581ee07eb9f3761831b13075e619d", // haiduong2026
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "admin-2",
    username: "editor",
    email: "bientap@haiduongmedia.com",
    fullName: "Ban Biên Tập",
    role: "editor",
    passwordHash: "ff0e1c989f3ac3e07078b8c30eef90bf48dc0fac1b66d2382f983fc67b348ef9", // haiduong123
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export async function loadAdminAccounts(): Promise<AdminAccount[]> {
  // 1. Try reading from DB
  try {
    const db = getDb();
    const [row] = await db.select().from(siteContent).where(eq(siteContent.key, DB_KEY)).limit(1);
    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // 2. Try local file fallback
  try {
    if (fs.existsSync(LOCAL_PATH)) {
      const raw = fs.readFileSync(LOCAL_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // 3. Seed default accounts
  await saveAdminAccounts(defaultAdminAccounts);
  return defaultAdminAccounts;
}

export async function saveAdminAccounts(accounts: AdminAccount[]): Promise<void> {
  // 1. Save to DB
  try {
    const db = getDb();
    const values = {
      key: DB_KEY,
      data: JSON.stringify(accounts),
      updatedBy: "admin",
      updatedAt: new Date(),
    };
    await db.insert(siteContent).values(values).onConflictDoUpdate({
      target: siteContent.key,
      set: values,
    });
  } catch {}

  // 2. Save to local file
  try {
    const dir = path.dirname(LOCAL_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_PATH, JSON.stringify(accounts, null, 2), "utf-8");
  } catch {}
}

export async function getLoggedInAdminUser(): Promise<SafeAdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload) return null;

    const accounts = await loadAdminAccounts();
    const account = accounts.find(
      (a) => a.id === payload.userId || a.username.toLowerCase() === payload.username.toLowerCase()
    );
    if (!account || account.status !== "active") return null;

    const { passwordHash: _, resetOtp: __, ...safeUser } = account;
    return safeUser;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(
  usernameOrEmail: string,
  password: string
): Promise<{ success: boolean; user?: SafeAdminUser; error?: string }> {
  const accounts = await loadAdminAccounts();
  const normalized = usernameOrEmail.trim().toLowerCase();
  const account = accounts.find(
    (a) =>
      a.username.toLowerCase() === normalized || a.email.toLowerCase() === normalized
  );

  if (!account) {
    return {
      success: false,
      error: "Tài khoản hoặc email không tồn tại trong hệ thống.",
    };
  }

  if (account.status === "locked") {
    return {
      success: false,
      error: "Tài khoản này đang bị khóa. Vui lòng liên hệ Quản trị viên cấp cao.",
    };
  }

  if (!verifyPassword(password, account.passwordHash)) {
    return {
      success: false,
      error: "Mật khẩu không chính xác. Vui lòng kiểm tra lại.",
    };
  }

  account.lastLogin = new Date().toISOString();
  await saveAdminAccounts(accounts);

  const { passwordHash: _, resetOtp: __, ...safeUser } = account;
  return { success: true, user: safeUser };
}

export async function requestPasswordReset(
  usernameOrEmail: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const accounts = await loadAdminAccounts();
  const normalized = usernameOrEmail.trim().toLowerCase();
  const account = accounts.find(
    (a) =>
      a.username.toLowerCase() === normalized || a.email.toLowerCase() === normalized
  );

  if (!account) {
    return {
      success: false,
      error: "Không tìm thấy tài khoản với thông tin đã cung cấp.",
    };
  }

  // Tạo mã OTP ngẫu nhiên 6 chữ số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  account.resetOtp = {
    code: otp,
    expiresAt: Date.now() + 15 * 60 * 1000,
  };
  await saveAdminAccounts(accounts);

  // Gửi email thực tế chứa mã OTP đến hòm thư người dùng
  const emailRes = await sendPasswordResetEmail(
    account.email,
    otp,
    account.fullName || account.username
  );

  if (!emailRes.success) {
    return {
      success: false,
      error: emailRes.error || "Không thể gửi email chứa mã OTP.",
    };
  }

  return {
    success: true,
    message: `Mã OTP xác thực đặt lại mật khẩu đã được gửi đến email ${account.email}. Vui lòng kiểm tra hộp thư đến (hoặc thư rác/spam).`,
  };
}

export async function confirmPasswordReset(
  usernameOrEmail: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      error: "Mật khẩu mới phải có ít nhất 6 ký tự.",
    };
  }

  const accounts = await loadAdminAccounts();
  const normalized = usernameOrEmail.trim().toLowerCase();
  const account = accounts.find(
    (a) =>
      a.username.toLowerCase() === normalized || a.email.toLowerCase() === normalized
  );

  if (!account) {
    return { success: false, error: "Không tìm thấy tài khoản." };
  }

  if (!account.resetOtp || account.resetOtp.code !== otp.trim()) {
    return { success: false, error: "Mã OTP xác thực không chính xác." };
  }

  if (Date.now() > account.resetOtp.expiresAt) {
    return {
      success: false,
      error: "Mã OTP đã hết hạn (chỉ có hiệu lực trong 15 phút). Vui lòng yêu cầu lại.",
    };
  }

  account.passwordHash = hashPassword(newPassword);
  delete account.resetOtp;
  await saveAdminAccounts(accounts);

  return {
    success: true,
    message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay với mật khẩu mới.",
  };
}
