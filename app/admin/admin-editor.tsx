"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Save } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

type Message = { type: "success" | "error"; text: string } | null;

export default function AdminEditor({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const update = (key: keyof SiteContent, value: string) => setContent(current => ({ ...current, [key]: value }));
  const updateService = (index: number, key: "title" | "description", value: string) => setContent(current => ({ ...current, services: current.services.map((item, i) => i === index ? { ...item, [key]: value } : item) }));
  const updateNews = (index: number, key: "category" | "title" | "excerpt", value: string) => setContent(current => ({ ...current, news: current.news.map((item, i) => i === index ? { ...item, [key]: value } : item) }));

  async function save() {
    setSaving(true); setMessage(null);
    try {
      const response = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const result = await response.json() as { content?: SiteContent; message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "Không thể lưu nội dung.");
      if (result.content) setContent(result.content);
      setMessage({ type: "success", text: result.message || "Đã lưu nội dung website." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Đã có lỗi xảy ra." });
    } finally { setSaving(false); }
  }

  return <div className="admin-layout">
    <aside className="admin-nav"><strong>Nội dung</strong><a href="#thuong-hieu">Thương hiệu</a><a href="#trang-chu">Trang chủ</a><a href="#dich-vu">Dịch vụ</a><a href="#tin-tuc">Tin tức</a><a href="#lien-he">Liên hệ</a></aside>
    <div className="admin-content">
      <EditorSection id="thuong-hieu" number="01" title="Thông tin thương hiệu" description="Tên và câu mô tả ngắn hiển thị tại đầu và cuối trang.">
        <Field label="Tên thương hiệu" value={content.brandName} onChange={value => update("brandName", value)}/>
        <Field label="Dòng giới thiệu" value={content.brandKicker} onChange={value => update("brandKicker", value)}/>
        <Field label="Ghi chú chân trang" value={content.footerNote} onChange={value => update("footerNote", value)} multiline/>
      </EditorSection>

      <EditorSection id="trang-chu" number="02" title="Trang chủ" description="Nội dung khu vực đầu trang và phần giới thiệu doanh nghiệp.">
        <Field label="Dòng nhấn đầu trang" value={content.heroEyebrow} onChange={value => update("heroEyebrow", value)}/>
        <Field label="Tiêu đề chính" value={content.heroTitle} onChange={value => update("heroTitle", value)} multiline/>
        <Field label="Mô tả chính" value={content.heroDescription} onChange={value => update("heroDescription", value)} multiline/>
        <div className="field-row"><Field label="Nút chính" value={content.primaryCta} onChange={value => update("primaryCta", value)}/><Field label="Nút phụ" value={content.secondaryCta} onChange={value => update("secondaryCta", value)}/></div>
        <Field label="Tiêu đề giới thiệu" value={content.aboutTitle} onChange={value => update("aboutTitle", value)}/>
        <Field label="Nội dung giới thiệu" value={content.aboutBody} onChange={value => update("aboutBody", value)} multiline/>
        <Field label="Tiêu đề cam kết" value={content.trustTitle} onChange={value => update("trustTitle", value)}/>
        <Field label="Nội dung cam kết" value={content.trustBody} onChange={value => update("trustBody", value)} multiline/>
      </EditorSection>

      <EditorSection id="dich-vu" number="03" title="Danh sách dịch vụ" description="Sáu dịch vụ được hiển thị tại trang chủ và trang Dịch vụ.">
        <div className="repeat-grid">{content.services.map((item,index)=><div className="repeat-card" key={index}><span>Dịch vụ {index+1}</span><Field label="Tên dịch vụ" value={item.title} onChange={value => updateService(index,"title",value)}/><Field label="Mô tả" value={item.description} onChange={value => updateService(index,"description",value)} multiline/></div>)}</div>
      </EditorSection>

      <EditorSection id="tin-tuc" number="04" title="Tin tức nổi bật" description="Ba bài viết giới thiệu đang hiển thị trên website.">
        <div className="repeat-grid news-admin-grid">{content.news.map((item,index)=><div className="repeat-card" key={index}><span>Bài viết {index+1}</span><Field label="Chuyên mục" value={item.category} onChange={value => updateNews(index,"category",value)}/><Field label="Tiêu đề" value={item.title} onChange={value => updateNews(index,"title",value)}/><Field label="Mô tả" value={item.excerpt} onChange={value => updateNews(index,"excerpt",value)} multiline/></div>)}</div>
      </EditorSection>

      <EditorSection id="lien-he" number="05" title="Thông tin liên hệ" description="Các nút gọi điện, chat, fanpage và bản đồ trên toàn website.">
        <div className="field-row"><Field label="Hotline hiển thị" value={content.hotline} onChange={value => update("hotline", value)}/><Field label="Số gọi dạng +84" value={content.hotlineHref} onChange={value => update("hotlineHref", value)}/></div>
        <Field label="Email" value={content.email} onChange={value => update("email", value)}/>
        <Field label="Địa chỉ" value={content.address} onChange={value => update("address", value)} multiline/>
        <Field label="Đường dẫn Zalo" value={content.zaloUrl} onChange={value => update("zaloUrl", value)}/>
        <Field label="Đường dẫn Fanpage" value={content.facebookUrl} onChange={value => update("facebookUrl", value)}/>
        <Field label="Đường dẫn Google Maps" value={content.mapUrl} onChange={value => update("mapUrl", value)}/>
      </EditorSection>

      <div className="admin-savebar">{message && <p className={message.type}><CheckCircle2 size={17}/>{message.text}</p>}<button type="button" onClick={save} disabled={saving}>{saving ? <LoaderCircle className="spin" size={18}/> : <Save size={18}/>} {saving ? "Đang lưu..." : "Lưu toàn bộ thay đổi"}</button></div>
    </div>
  </div>;
}

function EditorSection({ id, number, title, description, children }: { id: string; number: string; title: string; description: string; children: React.ReactNode }) {
  return <section id={id} className="editor-section"><div className="editor-heading"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div><div className="editor-fields">{children}</div></section>;
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="admin-field"><span>{label}</span>{multiline ? <textarea value={value} onChange={event => onChange(event.target.value)} rows={3}/> : <input value={value} onChange={event => onChange(event.target.value)}/>}</label>;
}
