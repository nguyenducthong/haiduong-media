import { Globe2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Liên Hệ Tư Vấn Chiến Lược Truyền Thông",
  description:
    "Liên hệ THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn) - Hotline: 0931 538 666. Tư vấn sản xuất phim quảng cáo, phát sóng VTV và booking báo chí toàn quốc.",
};

export default async function ContactPage() {
  const content = await loadSiteContent();
  const items = [
    [Phone, "Hotline", content.hotline, `tel:${content.hotlineHref}`],
    [Mail, "Email", content.email, `mailto:${content.email}`],
    [MessageCircle, "Zalo", "Chat trực tiếp", content.zaloUrl],
    [Globe2, "Fanpage", "Theo dõi chúng tôi", content.facebookUrl],
  ] as const;
  return <><SiteHeader content={content}/><main><PageHero eyebrow="Liên hệ" title="Cùng biến ý tưởng thành một dự án hiệu quả" description="Hãy để lại nhu cầu hoặc liên hệ trực tiếp qua các kênh dưới đây. Chúng tôi sẽ phản hồi trong thời gian sớm nhất."/><section className="section"><div className="site-container contact-grid"><div className="contact-cards">{items.map(([Icon,label,value,href])=><a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><Icon size={24}/><span><small>{label}</small><strong>{value}</strong></span></a>)}<a href={content.mapUrl} target="_blank" rel="noreferrer"><MapPin size={24}/><span><small>Địa chỉ</small><strong>{content.address}</strong></span></a></div><div className="contact-note"><span className="eyebrow">Thông tin doanh nghiệp</span><h2>Chúng tôi luôn sẵn sàng lắng nghe.</h2><p>Thông tin liên hệ hiện là dữ liệu mẫu. Bạn có thể cập nhật hotline, email, địa chỉ, Zalo, Facebook và đường dẫn bản đồ tại trang quản trị.</p><a className="button button-primary" href={`tel:${content.hotlineHref}`}>Gọi {content.hotline}</a></div></div></section></main><SiteFooter content={content}/><FloatingContact content={content}/></>;
}
