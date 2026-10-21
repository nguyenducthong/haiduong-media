import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu",
  description: "Giải pháp truyền thông, nội dung, quảng cáo, sự kiện và xây dựng thương hiệu cho doanh nghiệp.",
  metadataBase: new URL("https://thuonghieuhangdauvn.com"),
  openGraph: {
    title: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu",
    description: "Giải pháp truyền thông, nội dung, quảng cáo, sự kiện và xây dựng thương hiệu cho doanh nghiệp.",
    url: "https://thuonghieuhangdauvn.com",
    siteName: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu",
    description: "Giải pháp truyền thông, nội dung, quảng cáo, sự kiện và xây dựng thương hiệu cho doanh nghiệp.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
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
