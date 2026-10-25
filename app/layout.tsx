import type { Metadata } from "next";
import { siteUrl, absoluteSiteUrl } from "@/lib/site-url";
import { loadSiteContent } from "@/lib/site-content";
import { AutoPopupModal } from "@/components/auto-popup-modal";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadSiteContent();
  const title = content.seoTitle || "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu";
  const description =
    content.seoDescription ||
    "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn) - Tư vấn chiến lược truyền thông, sản xuất TVC phát sóng VTV và kết nối doanh nghiệp với báo chí hàng đầu.";
  const ogImage = content.seoImage || "/images/logo.png";
  const keywords = (
    content.seoKeywords ||
    "thuonghieuhangdauvn, thương hiệu hàng đầu việt nam, thương hiệu hàng đầu vn, truyền thông thương hiệu, sản xuất tvc vtv, booking báo chí pr, vinh danh thương hiệu"
  )
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title: {
      default: title,
      template: `%s - ${content.brandName || "Thương Hiệu Hàng Đầu VN"}`,
    },
    description,
    keywords,
    metadataBase: siteUrl,
    openGraph: {
      title,
      description,
      siteName: content.brandName || "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
}

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
      <body className="antialiased">
        {children}
        <AutoPopupModal />
      </body>
    </html>
  );
}

