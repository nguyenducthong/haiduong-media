import { ArrowRight } from "lucide-react";
import Link from "@/components/link";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/dich-vu" },
  title: "Dịch Vụ Truyền Thông & Quảng Cáo VTV - Báo Chí",
  description:
    "Giải pháp truyền thông toàn diện từ THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn): Sản xuất phim quảng cáo, phát sóng VTV khung giờ vàng và booking báo chí uy tín.",
};

export default async function ServicesPage() {
  const content = await loadSiteContent();
  return <><SiteHeader content={content}/><main><PageHero eyebrow="Dịch vụ" title="Kết nối chiến lược, nội dung và trải nghiệm" description="Chọn từng dịch vụ riêng lẻ hoặc xây dựng gói giải pháp phù hợp với mục tiêu và ngân sách của doanh nghiệp."/><section className="section"><div className="site-container service-list">{content.services.map((service,index)=><article key={`${service.title}-${index}`}><span>0{index+1}</span><div><h2>{service.title}</h2><p>{service.description}</p></div><Link href="/lien-he">Nhận tư vấn <ArrowRight size={17}/></Link></article>)}</div></section></main><SiteFooter content={content}/><FloatingContact content={content}/></>;
}
