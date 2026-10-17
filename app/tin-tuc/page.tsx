import { CalendarDays } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const content = await loadSiteContent();
  return <><SiteHeader content={content}/><main><PageHero eyebrow="Tin tức & kiến thức" title="Góc nhìn thực tế về truyền thông" description="Nội dung ngắn gọn, dễ áp dụng dành cho doanh nghiệp đang xây dựng và phát triển thương hiệu."/><section className="section"><div className="site-container article-list">{content.news.map((item,index)=><article key={`${item.title}-${index}`}><div className={`article-thumb cover-${index+1}`}><span>{item.category}</span></div><div><small><CalendarDays size={14}/> 17.10.2026</small><h2>{item.title}</h2><p>{item.excerpt}</p><span className="article-tag">Bài viết mẫu</span></div></article>)}</div></section></main><SiteFooter content={content}/><FloatingContact content={content}/></>;
}
