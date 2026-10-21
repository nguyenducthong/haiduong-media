import type { Metadata } from "next";
import { siteUrl, absoluteSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu",
    template: "%s - Thương Hiệu Hàng Đầu VN",
  },
  description:
    "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn) - Tư vấn chiến lược truyền thông, sản xuất TVC phát sóng VTV và kết nối doanh nghiệp với báo chí hàng đầu.",
  keywords: [
    "thuonghieuhangdauvn",
    "thương hiệu hàng đầu việt nam",
    "thương hiệu hàng đầu vn",
    "truyền thông thương hiệu",
    "sản xuất tvc vtv",
    "booking báo chí pr",
    "vinh danh thương hiệu",
    "thuong hieu hang dau viet nam",
  ],
  metadataBase: siteUrl,
  openGraph: {
    title: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu",
    description:
      "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn) - Tư vấn chiến lược truyền thông, sản xuất TVC phát sóng VTV và kết nối doanh nghiệp với báo chí hàng đầu.",
    siteName: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM - thuonghieuhangdauvn",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu",
    description:
      "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn) - Tư vấn chiến lược truyền thông, sản xuất TVC phát sóng VTV và kết nối doanh nghiệp với báo chí hàng đầu.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteSiteUrl('/#organization'),
      name: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM",
      alternateName: ["thuonghieuhangdauvn", "Thương Hiệu Hàng Đầu VN"],
      url: absoluteSiteUrl(),
      logo: absoluteSiteUrl('/images/logo.png'),
      description:
        "Đơn vị tư vấn chiến lược truyền thông, sản xuất phim quảng cáo và kết nối doanh nghiệp với các chương trình truyền hình, báo chí.",
      telephone: "0931 538 666",
      email: "bantochuc.thuonghieu2009@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "89 Lê Đức Thọ, Mỹ Đình 2",
        addressLocality: "Hà Nội",
        addressCountry: "VN",
      },
      sameAs: [
        "https://www.facebook.com/haiduongmedia",
      ],
    },
    {
      "@type": "WebSite",
      "@id": absoluteSiteUrl('/#website'),
      url: absoluteSiteUrl(),
      name: "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM",
      alternateName: "thuonghieuhangdauvn",
      publisher: {
        "@id": absoluteSiteUrl('/#organization'),
      },
      inLanguage: "vi",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
