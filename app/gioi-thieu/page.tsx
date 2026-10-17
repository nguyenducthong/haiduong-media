import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await loadSiteContent();
  return <><SiteHeader content={content}/><main><PageHero eyebrow="Giới thiệu" title={content.aboutTitle} description={content.aboutBody}/><section className="section"><div className="site-container about-grid"><div className="about-panel"><span className="eyebrow">Cam kết</span><h2>{content.trustTitle}</h2><p>{content.trustBody}</p></div><div className="values-grid">{[["01","Hiểu doanh nghiệp"],["02","Sáng tạo có mục tiêu"],["03","Thực thi có trách nhiệm"],["04","Đồng hành dài hạn"]].map(([n,t])=><div key={n}><span>{n}</span><h3>{t}</h3><p>Mỗi quyết định đều bám sát mục tiêu và trải nghiệm của khách hàng.</p></div>)}</div></div></section></main><SiteFooter content={content}/><FloatingContact content={content}/></>;
}
