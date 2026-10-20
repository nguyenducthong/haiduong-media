import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu",
  description: "Giải pháp truyền thông, nội dung, quảng cáo, sự kiện và xây dựng thương hiệu cho doanh nghiệp.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
