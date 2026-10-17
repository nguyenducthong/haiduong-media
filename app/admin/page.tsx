import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { loadSiteContent } from "@/lib/site-content";
import AdminEditor from "./admin-editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const content = await loadSiteContent();

  return <main className="admin-shell">
    <header className="admin-header"><div><Link href="/"><ArrowLeft size={17}/> Về website</Link><span>Hệ thống quản trị nội dung</span></div><div><small>Đang đăng nhập</small><strong>{user.displayName}</strong><Link href="/" target="_blank">Xem trang <ExternalLink size={15}/></Link></div></header>
    <section className="admin-intro"><div><span className="eyebrow">CMS đơn giản</span><h1>Quản lý nội dung website</h1><p>Chỉnh sửa nội dung hiển thị trên các trang. Sau khi lưu, hãy mở lại website để xem thay đổi.</p></div><div className="admin-status"><i/> Website đang hoạt động</div></section>
    <AdminEditor initialContent={content}/>
  </main>;
}
