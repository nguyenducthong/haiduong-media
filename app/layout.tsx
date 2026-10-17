import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hải Dương Media | Truyền thông & Thương hiệu",
  description: "Giải pháp truyền thông, nội dung, quảng cáo, sự kiện và xây dựng thương hiệu cho doanh nghiệp.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
