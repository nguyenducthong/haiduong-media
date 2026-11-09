"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Shield,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Handshake,
  Home,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Link as LinkIcon,
  ListOrdered,
  LoaderCircle,
  MessageSquareQuote,
  Newspaper,
  Package,
  Plus,
  Quote,
  Save,
  Share2,
  Sliders,
  Sparkles,
  Star,
  Trash2,
  Tv,
  Users,
} from "lucide-react";
import type {
  BannerSlide,
  BrandItem,
  ClientItem,
  EventItem,
  HomepageSection,
  KnowledgeItem,
  NewsItem,
  PartnerItem,
  PressItem,
  ProcessStep,
  SiteContent,
  TestimonialItem,
  VtvCommercial,
} from "@/lib/site-content";
import { AdminRichEditor } from "@/components/admin-rich-editor";
import { EnterpriseContentEditor } from "@/components/enterprise-content-editor";
import { ImageUploadField } from "@/components/image-upload-field";
import { AdminEnterprises } from "@/components/admin-enterprises";
import { AdminFacebookManager } from "@/components/admin-facebook-manager";
import { AdminAccountsManager } from "@/components/admin-accounts-manager";
import { AdminSidebarV2 } from "@/components/admin-sidebar-v2";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import type { SafeAdminUser } from "@/lib/admin-auth";
import React, { useEffect } from "react";

export interface ScreenMeta {
  id: string;
  groupId: string;
  groupLabel: string;
  itemLabel: string;
  liveUrl?: string;
}

export const ADMIN_SCREENS: ScreenMeta[] = [
  // 1. Nhóm Trang Chủ
  { id: "homepage-sections", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "01. Bật/Tắt & Thứ tự khối", liveUrl: "/" },
  { id: "banner-slider", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "02. Banner Slider", liveUrl: "/" },
  { id: "vtv-commercials-admin", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "03. Phim/TVC Trên VTV", liveUrl: "/" },
  { id: "su-kien-admin", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "04. Sự Kiện Sắp Diễn Ra", liveUrl: "/" },
  { id: "trang-chu", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "05. Giới Thiệu & Niềm Tin", liveUrl: "/" },
  { id: "dich-vu", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "06. Dịch Vụ Chủ Lực", liveUrl: "/" },
  { id: "bao-chi-admin", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "07. Báo Chí Đưa Tin", liveUrl: "/" },
  { id: "thuong-hieu-admin", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "08. Hệ Sinh Thái Đa Kênh", liveUrl: "/" },
  { id: "danh-gia-admin", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "09. Đánh Giá Khách Hàng", liveUrl: "/" },
  { id: "doi-tac-admin", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "10. Đối Tác Doanh Nghiệp", liveUrl: "/" },
  { id: "quy-trinh-cta-admin", groupId: "trang-chu", groupLabel: "Trang Chủ", itemLabel: "11. Quy Trình & Kêu Gọi Hợp Tác", liveUrl: "/" },

  // 2. Nhóm Trang Menu
  { id: "menu-gioi-thieu", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "01. Trang Giới thiệu", liveUrl: "/gioi-thieu" },
  { id: "menu-tin-tuc", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "02. Trang Tin tức", liveUrl: "/tin-tuc" },
  { id: "menu-doanh-nghiep", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "03. Trang Doanh nghiệp", liveUrl: "/doanh-nghiep" },
  { id: "menu-doanh-nhan", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "04. Trang Doanh nhân", liveUrl: "/doanh-nhan" },
  { id: "menu-san-pham", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "05. Trang Sản phẩm", liveUrl: "/san-pham" },
  { id: "menu-iso", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "06. Tư Vấn ISO", liveUrl: "/dich-vu/chung-nhan-iso" },
  { id: "menu-nhan-hieu", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "07. Đăng Ký Nhãn Hiệu", liveUrl: "/dich-vu/dang-ky-nhan-hieu" },
  { id: "menu-shtt", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "08. Sở Hữu Trí Tuệ", liveUrl: "/dich-vu/so-huu-tri-tue" },
  { id: "menu-fb", groupId: "menu-trang", groupLabel: "Trang Menu", itemLabel: "09. Dịch Vụ Facebook", liveUrl: "/dich-vu-facebook" },

  // 3. Nhóm Bài Viết
  { id: "bai-viet", groupId: "bai-viet", groupLabel: "Bài Viết", itemLabel: "Quản Lý Bài Viết", liveUrl: "/tin-tuc" },

  // 4. Nhóm Cấu Hình
  { id: "thuong-hieu", groupId: "cau-hinh", groupLabel: "Cấu Hình Chung", itemLabel: "01. Thông Tin Thương Hiệu", liveUrl: "/" },
  { id: "seo-chia-se", groupId: "cau-hinh", groupLabel: "Cấu Hình Chung", itemLabel: "02. SEO & Thẻ Chia Sẻ Link", liveUrl: "/" },
  { id: "lien-he", groupId: "cau-hinh", groupLabel: "Cấu Hình Chung", itemLabel: "03. Thông Tin Liên Hệ", liveUrl: "/lien-he" },

  // 5. Nhóm Tài Khoản
  { id: "tai-khoan", groupId: "tai-khoan", groupLabel: "Hệ Thống", itemLabel: "Tài Khoản Quản Trị", liveUrl: "/admin" },
];

export const ActiveScreenContext = React.createContext<{
  activeScreenId: string;
}>({ activeScreenId: "" });

type Message = { type: "success" | "error"; text: string } | null;
export type MainAdminTab =
  | "trang-chu"
  | "menu-trang"
  | "bai-viet"
  | "su-kien"
  | "tin-tuc"
  | "cau-hinh"
  | "tai-khoan";

export default function AdminEditor({
  initialContent,
  currentUser,
}: {
  initialContent: SiteContent;
  currentUser?: SafeAdminUser | null;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [mainTab, setMainTab] = useState<MainAdminTab>("trang-chu");
  const [eventAdminView, setEventAdminView] = useState<"articles" | "cards">("articles");

  // State màn hình đang chọn (Single-Screen View)
  const [activeScreenId, setActiveScreenId] = useState<string>("menu-iso");
  const [activeParentLabel, setActiveParentLabel] = useState<string>("Trang Menu");
  const [activeItemLabel, setActiveItemLabel] = useState<string>("06. Tư Vấn ISO");

  useEffect(() => {
    try {
      const savedId = localStorage.getItem("admin_active_screen");
      const savedParent = localStorage.getItem("admin_active_parent");
      const savedItem = localStorage.getItem("admin_active_item");
      if (savedId) {
        setActiveScreenId(savedId);
        if (savedParent) setActiveParentLabel(savedParent);
        if (savedItem) setActiveItemLabel(savedItem);
        const meta = ADMIN_SCREENS.find((s) => s.id === savedId);
        if (meta) setMainTab(meta.groupId as MainAdminTab);
      } else {
        setMainTab("menu-trang");
      }
    } catch {}
  }, []);

  const handleSelectScreen = (screenId: string, parentLabel: string, itemLabel: string) => {
    setActiveScreenId(screenId);
    setActiveParentLabel(parentLabel);
    setActiveItemLabel(itemLabel);
    const meta = ADMIN_SCREENS.find((s) => s.id === screenId);
    if (meta) {
      setMainTab(meta.groupId as MainAdminTab);
    }
    try {
      localStorage.setItem("admin_active_screen", screenId);
      localStorage.setItem("admin_active_parent", parentLabel);
      localStorage.setItem("admin_active_item", itemLabel);
    } catch {}
  };

  // Tính toán meta màn hình hiện tại, mục trước và mục sau
  const currentScreenIndex = ADMIN_SCREENS.findIndex((s) => s.id === activeScreenId);
  const currentScreenMeta = currentScreenIndex !== -1 ? ADMIN_SCREENS[currentScreenIndex] : null;
  const prevScreenMeta = currentScreenIndex > 0 ? ADMIN_SCREENS[currentScreenIndex - 1] : null;
  const nextScreenMeta =
    currentScreenIndex !== -1 && currentScreenIndex < ADMIN_SCREENS.length - 1
      ? ADMIN_SCREENS[currentScreenIndex + 1]
      : null;

  // Collapsed state tracking (mặc định thu gọn)
  const [collapsedBanners, setCollapsedBanners] = useState<Record<string, boolean>>({});
  const [collapsedNews, setCollapsedNews] = useState<Record<string, boolean>>({});
  const [collapsedEvents, setCollapsedEvents] = useState<Record<string, boolean>>({});
  const [collapsedKnowledge, setCollapsedKnowledge] = useState<Record<string, boolean>>({});
  const [collapsedVtv, setCollapsedVtv] = useState<Record<string, boolean>>({});
  const [collapsedPress, setCollapsedPress] = useState<Record<string, boolean>>({});
  const [collapsedBrands, setCollapsedBrands] = useState<Record<string, boolean>>({});
  const [collapsedTestimonials, setCollapsedTestimonials] = useState<Record<string, boolean>>({});
  const [collapsedPartners, setCollapsedPartners] = useState<Record<string, boolean>>({});
  const [collapsedClients, setCollapsedClients] = useState<Record<string, boolean>>({});

  // String field update
  const update = (key: keyof SiteContent, value: string) =>
    setContent((current) => ({ ...current, [key]: value }));

  // Service updates
  const updateService = (index: number, key: "title" | "description", value: string) =>
    setContent((current) => ({
      ...current,
      services: current.services.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));

  // ==========================================
  // 1. CẤU HÌNH CÁC MỤC TRANG CHỦ (BẬT/TẮT & SẮP XẾP)
  // ==========================================
  const toggleHomepageSection = (id: string) => {
    setContent((current) => {
      const list = current.homepageSections || [];
      return {
        ...current,
        homepageSections: list.map((sec) =>
          sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
        ),
      };
    });
  };

  const moveHomepageSection = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...(current.homepageSections || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, homepageSections: list };
    });
  };

  // ==========================================
  // 2. BANNER SLIDER (THÊM, UPLOAD ẢNH, NỘI DUNG, LINK, ACTIVE, SẮP XẾP)
  // ==========================================
  const addBanner = () => {
    const newId = `banner-${Date.now()}`;
    const newBanner: BannerSlide = {
      id: newId,
      tag: "TIÊU ĐIỂM",
      title: "TIÊU ĐỀ BANNER MỚI",
      highlight: "Dòng phụ đề nổi bật cho banner",
      description: "Nội dung giới thiệu chi tiết về thông điệp truyền thông...",
      ctaText: "Khám phá ngay",
      ctaHref: "/lien-he",
      badge: "NỔI BẬT",
      bgImage: "/images/vtv-studio.jpg",
      active: true,
      secondaryCtaText: "Xem mẫu phim VTV",
      secondaryCtaHref: "#vtv-commercials",
    };
    setContent((current) => ({
      ...current,
      bannerSlides: [newBanner, ...current.bannerSlides],
    }));
    // Open the new banner for editing
    setCollapsedBanners((prev) => ({ ...prev, [newId]: false }));
  };

  const updateBanner = <K extends keyof BannerSlide>(index: number, key: K, value: BannerSlide[K]) =>
    setContent((current) => ({
      ...current,
      bannerSlides: current.bannerSlides.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const removeBanner = (index: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này không?")) return;
    setContent((current) => ({
      ...current,
      bannerSlides: current.bannerSlides.filter((_, i) => i !== index),
    }));
  };

  const moveBanner = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...current.bannerSlides];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, bannerSlides: list };
    });
  };

  const toggleCollapseBanner = (id: string) => {
    setCollapsedBanners((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllBannersCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    content.bannerSlides.forEach((b, i) => {
      next[b.id || `banner-${i}`] = collapsed;
    });
    setCollapsedBanners(next);
  };

  // ==========================================
  // 3. BÀI VIẾT (LƯU, ACTIVE, THU GỌN, SẮP XẾP, THÊM, XÓA)
  // ==========================================
  const updateNews = <K extends keyof NewsItem>(index: number, key: K, value: NewsItem[K]) =>
    setContent((current) => ({
      ...current,
      news: current.news.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));

  const addNews = () => {
    const newId = `news-${Date.now()}`;
    const newArticle: NewsItem = {
      id: newId,
      slug: `bai-viet-moi-${Date.now().toString().slice(-4)}`,
      category: "Tin mới",
      title: "Tiêu đề bài viết mới",
      excerpt: "Tóm tắt ngắn gọn nội dung bài viết...",
      content: `[justify]Nội dung bài viết mới được cập nhật từ ban biên tập Hải Dương Media.[/justify]\n\n## Nội dung trọng tâm\n\n- Điểm nổi bật 1\n- Điểm nổi bật 2\n\n[center]**Liên hệ Hải Dương Media để nhận tư vấn chi tiết!**[/center]`,
      date: new Date().toLocaleDateString("vi-VN"),
      image: "/images/posts/post-thuong-hieu-manh.png",
      author: "Ban Biên Tập",
      link: `/tin-tuc/bai-viet-moi-${Date.now().toString().slice(-4)}`,
      active: true,
    };
    setContent((current) => ({
      ...current,
      news: [newArticle, ...current.news],
    }));
    setCollapsedNews((prev) => ({ ...prev, [newId]: false }));
  };

  const removeNews = (index: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
    setContent((current) => ({
      ...current,
      news: current.news.filter((_, i) => i !== index),
    }));
  };

  const moveNews = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...current.news];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, news: list };
    });
  };

  const toggleCollapseNews = (id: string) => {
    setCollapsedNews((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllNewsCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    content.news.forEach((n, i) => {
      next[n.id || `news-${i}`] = collapsed;
    });
    setCollapsedNews(next);
  };

  // ==========================================
  // 4. SỰ KIỆN (ACTIVE, THU GỌN, SẮP XẾP, THÊM, XÓA)
  // ==========================================
  const updateEvent = <K extends keyof EventItem>(index: number, key: K, value: EventItem[K]) =>
    setContent((current) => ({
      ...current,
      upcomingEvents: current.upcomingEvents.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addEvent = () => {
    const newId = `event-${Date.now()}`;
    const newEv: EventItem = {
      id: newId,
      slug: `su-kien-moi-${Date.now().toString().slice(-4)}`,
      title: "TIÊU ĐỀ SỰ KIỆN MỚI 2026 - 2027",
      date: "15/12/2026",
      time: "08:30 - 17:30",
      location: "Hà Nội / Quốc tế",
      status: "",
      tag: "Diễn đàn Doanh nghiệp",
      image: "/images/events/event-korea.png",
      summary: "Tóm tắt chương trình sự kiện ngắn gọn hiển thị trên thẻ...",
      description: "Nội dung chi tiết sự kiện hiển thị khi người dùng bấm vào xem trang chi tiết sự kiện...",
      agenda: [
        "08:30 - 09:00: Đón tiếp đại biểu",
        "09:00 - 11:30: Khai mạc và tọa đàm",
        "13:30 - 17:00: Lễ vinh danh & Gala",
      ],
      benefits: [
        "Phát sóng truyền hình VTV1 & HTV",
        "Đưa tin trên báo chí lớn (VnExpress, Dân Trí)",
        "Gặp gỡ và kết nối đối tác B2B",
      ],
      contactPerson: "Hotline Ban Tổ Chức: 090 377 2086",
      organizer: "Hải Dương Media & Đối tác",
      partner: "Hải Dương Media & Đối tác",
      active: true,
    };
    setContent((current) => ({
      ...current,
      upcomingEvents: [newEv, ...current.upcomingEvents],
    }));
    setCollapsedEvents((prev) => ({ ...prev, [newId]: false }));
  };

  const removeEvent = (index: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này không?")) return;
    setContent((current) => ({
      ...current,
      upcomingEvents: current.upcomingEvents.filter((_, i) => i !== index),
    }));
  };

  const moveEvent = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...current.upcomingEvents];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, upcomingEvents: list };
    });
  };

  const toggleCollapseEvent = (id: string) => {
    setCollapsedEvents((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllEventsCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    content.upcomingEvents.forEach((e, i) => {
      next[e.id || `event-${i}`] = collapsed;
    });
    setCollapsedEvents(next);
  };

  // ==========================================
  // 5. KIẾN THỨC & CẨM NANG (ACTIVE, THU GỌN, SẮP XẾP, THÊM, XÓA)
  // ==========================================
  const updateKnowledge = <K extends keyof KnowledgeItem>(index: number, key: K, value: KnowledgeItem[K]) =>
    setContent((current) => ({
      ...current,
      knowledge: (current.knowledge || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addKnowledge = () => {
    const newId = `know-${Date.now()}`;
    const newItem: KnowledgeItem = {
      id: newId,
      slug: `kien-thuc-${Date.now().toString().slice(-4)}`,
      title: "TIÊU ĐỀ BÀI KIẾN THỨC MỚI",
      category: "Chiến lược Marketing",
      excerpt: "Tóm tắt bài viết chia sẻ kiến thức chuyên môn...",
      date: "17.10.2026",
      readTime: "5 phút đọc",
      image: "/images/posts/post-marketing-trend.jpeg",
      link: "/tin-tuc",
      active: true,
    };
    setContent((current) => ({
      ...current,
      knowledge: [newItem, ...(current.knowledge || [])],
    }));
    setCollapsedKnowledge((prev) => ({ ...prev, [newId]: false }));
  };

  const removeKnowledge = (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài kiến thức này?")) return;
    setContent((current) => ({
      ...current,
      knowledge: (current.knowledge || []).filter((_, i) => i !== index),
    }));
  };

  const moveKnowledge = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...(current.knowledge || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, knowledge: list };
    });
  };

  const toggleCollapseKnowledge = (id: string) => {
    setCollapsedKnowledge((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllKnowledgeCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    (content.knowledge || []).forEach((k, i) => {
      next[k.id || `know-${i}`] = collapsed;
    });
    setCollapsedKnowledge(next);
  };

  // ==========================================
  // 6. PHIM & TVC VTV (ACTIVE, THU GỌN, SẮP XẾP, THÊM, XÓA)
  // ==========================================
  const updateVtv = <K extends keyof VtvCommercial>(index: number, key: K, value: VtvCommercial[K]) =>
    setContent((current) => ({
      ...current,
      vtvCommercials: (current.vtvCommercials || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addVtv = () => {
    const newId = `vtv-${Date.now()}`;
    const newItem: VtvCommercial = {
      id: newId,
      channel: "VTV1",
      program: "Thời Sự & Phóng Sự",
      title: "TIÊU ĐỀ PHIM DOANH NGHIỆP TRÊN VTV",
      timeSlot: "Khung giờ vàng 18:30",
      youtubeId: "QEBI8sjWxdQ",
      description: "Mô tả phóng sự phát sóng trên truyền hình quốc gia...",
      active: true,
    };
    setContent((current) => ({
      ...current,
      vtvCommercials: [newItem, ...(current.vtvCommercials || [])],
    }));
    setCollapsedVtv((prev) => ({ ...prev, [newId]: false }));
  };

  const removeVtv = (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa video này?")) return;
    setContent((current) => ({
      ...current,
      vtvCommercials: (current.vtvCommercials || []).filter((_, i) => i !== index),
    }));
  };

  const moveVtv = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...(current.vtvCommercials || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, vtvCommercials: list };
    });
  };

  const toggleCollapseVtv = (id: string) => {
    setCollapsedVtv((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllVtvCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    (content.vtvCommercials || []).forEach((v, i) => {
      next[v.id || `vtv-${i}`] = collapsed;
    });
    setCollapsedVtv(next);
  };

  // ==========================================
  // 7. BÁO CHÍ NÓI VỀ CHÚNG TÔI (ACTIVE, THU GỌN, SẮP XẾP, THÊM, XÓA)
  // ==========================================
  const updatePress = <K extends keyof PressItem>(index: number, key: K, value: PressItem[K]) =>
    setContent((current) => ({
      ...current,
      press: (current.press || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addPress = () => {
    const newId = `press-${Date.now()}`;
    const newItem: PressItem = {
      id: newId,
      newspaper: "VnExpress",
      title: "TIÊU ĐỀ BÀI BÁO ĐƯA TIN VỀ HẢI DƯƠNG MEDIA",
      quote: "Lời trích dẫn nhận xét ấn tượng từ bài báo...",
      date: "Tháng 10/2026",
      link: "/tin-tuc",
      active: true,
    };
    setContent((current) => ({
      ...current,
      press: [newItem, ...(current.press || [])],
    }));
    setCollapsedPress((prev) => ({ ...prev, [newId]: false }));
  };

  const removePress = (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài báo này?")) return;
    setContent((current) => ({
      ...current,
      press: (current.press || []).filter((_, i) => i !== index),
    }));
  };

  const movePress = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...(current.press || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, press: list };
    });
  };

  const toggleCollapsePress = (id: string) => {
    setCollapsedPress((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllPressCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    (content.press || []).forEach((p, i) => {
      next[p.id || `press-${i}`] = collapsed;
    });
    setCollapsedPress(next);
  };

  // ==========================================
  // 8. THƯƠNG HIỆU & HỆ SINH THÁI (ACTIVE, THU GỌN, SẮP XẾP, THÊM, XÓA)
  // ==========================================
  const updateBrand = <K extends keyof BrandItem>(index: number, key: K, value: BrandItem[K]) =>
    setContent((current) => ({
      ...current,
      brands: (current.brands || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addBrand = () => {
    const newId = `brand-${Date.now()}`;
    const newItem: BrandItem = {
      id: newId,
      name: "TÊN THƯƠNG HIỆU / ẤN PHẨM",
      category: "Cổng thông tin",
      description: "Mô tả ấn phẩm truyền thông...",
      url: "https://haiduongmedia.com",
      active: true,
    };
    setContent((current) => ({
      ...current,
      brands: [newItem, ...(current.brands || [])],
    }));
    setCollapsedBrands((prev) => ({ ...prev, [newId]: false }));
  };

  const removeBrand = (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
    setContent((current) => ({
      ...current,
      brands: (current.brands || []).filter((_, i) => i !== index),
    }));
  };

  const moveBrand = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...(current.brands || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, brands: list };
    });
  };

  const toggleCollapseBrand = (id: string) => {
    setCollapsedBrands((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllBrandCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    (content.brands || []).forEach((b, i) => {
      next[b.id || `brand-${i}`] = collapsed;
    });
    setCollapsedBrands(next);
  };

  // ==========================================
  // 9. LỜI CHỨNG THỰC / KHÁCH HÀNG (ACTIVE, THU GỌN, SẮP XẾP, THÊM, XÓA)
  // ==========================================
  const updateTestimonial = <K extends keyof TestimonialItem>(index: number, key: K, value: TestimonialItem[K]) =>
    setContent((current) => ({
      ...current,
      testimonials: (current.testimonials || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addTestimonial = () => {
    const newId = `testi-${Date.now()}`;
    const newItem: TestimonialItem = {
      id: newId,
      name: "Ông / Bà Nguyễn Văn A",
      title: "Tổng Giám Đốc",
      company: "Tập đoàn ABC",
      quote: "Lời chứng thực đánh giá về năng lực và sự hài lòng...",
      avatarText: "NVA",
      active: true,
    };
    setContent((current) => ({
      ...current,
      testimonials: [newItem, ...(current.testimonials || [])],
    }));
    setCollapsedTestimonials((prev) => ({ ...prev, [newId]: false }));
  };

  const removeTestimonial = (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa nhận xét này?")) return;
    setContent((current) => ({
      ...current,
      testimonials: (current.testimonials || []).filter((_, i) => i !== index),
    }));
  };

  const moveTestimonial = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...(current.testimonials || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, testimonials: list };
    });
  };

  const toggleCollapseTestimonial = (id: string) => {
    setCollapsedTestimonials((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllTestimonialCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    (content.testimonials || []).forEach((t, i) => {
      next[t.id || `testi-${i}`] = collapsed;
    });
    setCollapsedTestimonials(next);
  };

  // ==========================================
  // PARTNERS (ĐỐI TÁC TRUYỀN THÔNG)
  // ==========================================
  const updatePartner = <K extends keyof PartnerItem>(index: number, key: K, value: PartnerItem[K]) =>
    setContent((current) => ({
      ...current,
      partners: (current.partners || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addPartner = () => {
    const newId = `partner-${Date.now()}`;
    const newItem: PartnerItem = {
      id: newId,
      name: "Tên Đối Tác Mới",
      logo: "",
      url: "",
      active: true,
    };
    setContent((current) => ({
      ...current,
      partners: [newItem, ...(current.partners || [])],
    }));
    setCollapsedPartners((prev) => ({ ...prev, [newId]: false }));
  };

  const removePartner = (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa đối tác này?")) return;
    setContent((current) => ({
      ...current,
      partners: (current.partners || []).filter((_, i) => i !== index),
    }));
  };

  const movePartner = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...(current.partners || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, partners: list };
    });
  };

  const toggleCollapsePartner = (id: string) => {
    setCollapsedPartners((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllPartnerCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    (content.partners || []).forEach((p, i) => {
      next[p.id || `partner-${i}`] = collapsed;
    });
    setCollapsedPartners(next);
  };

  // ==========================================
  // CLIENTS (KHÁCH HÀNG & THƯƠNG HIỆU TIÊU BIỂU)
  // ==========================================
  const updateClient = <K extends keyof ClientItem>(index: number, key: K, value: ClientItem[K]) =>
    setContent((current) => ({
      ...current,
      clients: (current.clients || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addClient = () => {
    const newId = `client-${Date.now()}`;
    const newItem: ClientItem = {
      id: newId,
      name: "Tên Thương Hiệu Mới",
      logo: "",
      url: "",
      active: true,
    };
    setContent((current) => ({
      ...current,
      clients: [newItem, ...(current.clients || [])],
    }));
    setCollapsedClients((prev) => ({ ...prev, [newId]: false }));
  };

  const removeClient = (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa khách hàng / thương hiệu này?")) return;
    setContent((current) => ({
      ...current,
      clients: (current.clients || []).filter((_, i) => i !== index),
    }));
  };

  const moveClient = (index: number, direction: "up" | "down") => {
    setContent((current) => {
      const list = [...(current.clients || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return current;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...current, clients: list };
    });
  };

  const toggleCollapseClient = (id: string) => {
    setCollapsedClients((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const setAllClientCollapse = (collapsed: boolean) => {
    const next: Record<string, boolean> = {};
    (content.clients || []).forEach((c, i) => {
      next[c.id || `client-${i}`] = collapsed;
    });
    setCollapsedClients(next);
  };

  // ==========================================
  // 10. QUY TRÌNH 4 BƯỚC
  // ==========================================
  const updateProcessStep = (index: number, key: "title" | "desc", value: string) =>
    setContent((current) => ({
      ...current,
      processSteps: (current.processSteps || []).map((s, i) =>
        i === index ? { ...s, [key]: value } : s
      ),
    }));

  // ==========================================
  // LƯU TOÀN BỘ NỘI DUNG / LƯU BÀI VIẾT
  // ==========================================
  const saveAllContent = () => save();

  async function save(customSuccessMessage?: string) {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = (await response.json()) as {
        content?: SiteContent;
        message?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Không thể lưu nội dung.");
      if (result.content) setContent(result.content);
      setMessage({
        type: "success",
        text: customSuccessMessage || result.message || "Đã lưu nội dung website thành công.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Đã có lỗi xảy ra khi lưu.",
      });
    } finally {
      setSaving(false);
    }
  }

  const sectionsList = content.homepageSections || [
    { id: "banner", name: "Banner Slider nổi bật", enabled: true },
    { id: "trust", name: "Chỉ số niềm tin & Thành tựu", enabled: true },
    { id: "vtv", name: "Sản xuất phim quảng cáo trên VTV", enabled: true },
    { id: "events", name: "Danh mục sự kiện sắp diễn ra", enabled: true },
    { id: "services", name: "Dịch vụ & Sản phẩm chủ lực", enabled: true },
    { id: "news", name: "Tin mới & Kiến thức", enabled: true },
    { id: "about", name: "Về chúng tôi (Giới thiệu công ty)", enabled: true },
    { id: "press", name: "Báo chí, Thương hiệu & Đối tác", enabled: true },
    { id: "process", name: "Quy trình triển khai 4 bước", enabled: true },
    { id: "cta", name: "Khối kêu gọi hợp tác (CTA)", enabled: true },
  ];

  return (
    <ActiveScreenContext.Provider value={{ activeScreenId }}>
      <div className="admin-shell-v2" style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
        {/* 1. SIDEBAR DỌC */}
        <AdminSidebarV2
          activeScreenId={activeScreenId}
          onSelectScreen={handleSelectScreen}
          currentUser={currentUser}
        />

        {/* 2. WORKSPACE BÊN PHẢI */}
        <main className="admin-workspace-v2" style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
          {/* Topbar Header */}
          <header className="admin-topbar-v2" style={{ height: "64px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#64748b" }}>
                <a href="/" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Website</a>
                <span style={{ color: "#cbd5e1" }}>/</span>
                <span>{activeParentLabel}</span>
                <span style={{ color: "#cbd5e1" }}>/</span>
                <span style={{ color: "#0f172a", fontWeight: 700 }}>{activeItemLabel}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {message && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: message.type === "success" ? "#16a34a" : "#dc2626", background: message.type === "success" ? "#f0fdf4" : "#fef2f2", padding: "5px 12px", borderRadius: "20px", border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}` }}>
                  <CheckCircle2 size={14} />
                  {message.text}
                </div>
              )}

              {/* User info & Logout */}
              {currentUser && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingRight: "12px", borderRight: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      {currentUser.fullName || currentUser.username}
                    </span>
                    <span style={{ fontSize: "11px", color: currentUser.role === "super_admin" ? "#dc2626" : "#64748b", fontWeight: 600 }}>
                      {currentUser.role === "super_admin" ? "Quản trị tối cao" : "Quản trị viên"}
                    </span>
                  </div>
                  <AdminLogoutButton />
                </div>
              )}

              {currentScreenMeta?.liveUrl && (
                <a
                  href={currentScreenMeta.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <Eye size={14} /> Xem trang thực tế
                </a>
              )}

              <button
                type="button"
                onClick={() => save()}
                disabled={saving}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  background: "#1877f2",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 6px rgba(24, 119, 242, 0.3)",
                }}
              >
                {saving ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </header>

          {/* Screen Viewport */}
          <div className="admin-screen-viewport-v2" style={{ flex: 1, overflowY: "auto", padding: "28px", display: "flex", flexDirection: "column" }}>
            {/* 1. Màn hình Bài Viết */}
            {activeScreenId === "bai-viet" && (
              <div style={{ maxWidth: "1240px", width: "100%", margin: "0 auto", paddingBottom: "40px" }}>
                <AdminEnterprises defaultType="all" />
              </div>
            )}

            {/* 2. Màn hình Tài Khoản */}
            {activeScreenId === "tai-khoan" && (
              <div style={{ maxWidth: "1240px", width: "100%", margin: "0 auto", paddingBottom: "40px" }}>
                <AdminAccountsManager currentUser={currentUser} />
              </div>
            )}

            {/* 3. Màn hình Các Form Chỉnh Sửa */}
            {activeScreenId !== "bai-viet" && activeScreenId !== "tai-khoan" && (
              <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto" }}>
                {/* 01. GIỚI THIỆU */}
                <EditorSection
                  id="menu-gioi-thieu"
                  number="01"
                  title="Trang Giới thiệu (/gioi-thieu)"
                  description="Chỉnh sửa dòng chữ nhấn, tiêu đề chính, giới thiệu chi tiết và phần cam kết niềm tin trên trang Giới thiệu."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/gioi-thieu"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#2563eb",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /gioi-thieu ↗
                    </a>
                  </div>

                  {/* Live preview */}
                  <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      👁️ Xem trước tiêu đề đầu trang Giới thiệu:
                    </div>
                    <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <span style={{ color: "#d42027", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        {content.aboutEyebrow || "GIỚI THIỆU DOANH NGHIỆP"}
                      </span>
                      <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                        {content.aboutTitle || "Hơn 11 năm đồng hành xây dựng hệ sinh thái thương hiệu vững mạnh"}
                      </h2>
                      <p style={{ color: "#64748b", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                        {content.aboutBody || "Hải Dương Media kết nối chiến lược..."}
                      </p>
                    </div>
                  </div>

                  <Field
                    label="Dòng nhấn đầu trang (Eyebrow)"
                    value={content.aboutEyebrow || ""}
                    onChange={(value) => update("aboutEyebrow", value)}
                    placeholder="vd: GIỚI THIỆU DOANH NGHIỆP"
                  />
                  <Field
                    label="Tiêu đề chính trang Giới thiệu"
                    value={content.aboutTitle || ""}
                    onChange={(value) => update("aboutTitle", value)}
                    placeholder="vd: Hơn 11 năm đồng hành xây dựng hệ sinh thái thương hiệu vững mạnh"
                  />
                  <Field
                    label="Nội dung giới thiệu chi tiết (Mô tả)"
                    value={content.aboutBody || ""}
                    onChange={(value) => update("aboutBody", value)}
                    multiline
                    placeholder="Nhập đoạn văn giới thiệu năng lực công ty..."
                  />

                  <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>
                      Khối Cam Kết & Giá Trị
                    </h4>
                    <div className="field-row">
                      <Field
                        label="Dòng nhấn khối cam kết (Eyebrow)"
                        value={content.trustEyebrow || ""}
                        onChange={(value) => update("trustEyebrow", value)}
                        placeholder="vd: Cam kết"
                      />
                      <Field
                        label="Tiêu đề khối cam kết"
                        value={content.trustTitle || ""}
                        onChange={(value) => update("trustTitle", value)}
                        placeholder="vd: Tập trung vào kết quả có thể đo lường và kiểm chứng"
                      />
                    </div>
                    <Field
                      label="Nội dung cam kết niềm tin"
                      value={content.trustBody || ""}
                      onChange={(value) => update("trustBody", value)}
                      multiline
                      placeholder="Mỗi chiến dịch được chuẩn bị kỹ lưỡng..."
                    />
                  </div>
                </EditorSection>

                {/* 02. TIN TỨC */}
                <EditorSection
                  id="menu-tin-tuc"
                  number="02"
                  title="Trang Tin tức (/tin-tuc)"
                  description="Chỉnh sửa dòng chữ nhấn, tiêu đề và mô tả giới thiệu đầu trang Tin tức (khối Tin Tức & Hoạt Động Doanh Nghiệp)."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/tin-tuc"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#9333ea",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /tin-tuc ↗
                    </a>
                  </div>

                  {/* Live preview */}
                  <div style={{ background: "#faf5ff", border: "1px dashed #d8b4fe", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#9333ea", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      👁️ Xem trước tiêu đề đầu trang Tin tức (giống ảnh bạn gửi):
                    </div>
                    <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e9d5ff" }}>
                      <span style={{ color: "#d42027", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        {content.newsPageEyebrow || "TIN TỨC & CHUYÊN MÔN"}
                      </span>
                      <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                        {content.newsPageTitle || "Tin Tức & Hoạt Động Doanh Nghiệp"}
                      </h2>
                      <p style={{ color: "#64748b", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                        {content.newsPageDescription || "Nội dung chuyên sâu, cập nhật hoạt động mới nhất cùng kiến thức thực chiến dành cho doanh nghiệp trong kỷ nguyên số."}
                      </p>
                    </div>
                  </div>

                  <Field
                    label="Dòng chữ in hoa nhỏ phía trên (Eyebrow)"
                    value={content.newsPageEyebrow || ""}
                    onChange={(value) => update("newsPageEyebrow", value)}
                    placeholder="vd: TIN TỨC & CHUYÊN MÔN"
                  />
                  <Field
                    label="Tiêu đề chính trang Tin tức"
                    value={content.newsPageTitle || ""}
                    onChange={(value) => update("newsPageTitle", value)}
                    placeholder="vd: Tin Tức & Hoạt Động Doanh Nghiệp"
                  />
                  <Field
                    label="Đoạn văn mô tả / giới thiệu (sửa text trong ô đỏ)"
                    value={content.newsPageDescription || ""}
                    onChange={(value) => update("newsPageDescription", value)}
                    multiline
                    placeholder="vd: Nội dung chuyên sâu, cập nhật hoạt động mới nhất cùng kiến thức thực chiến dành cho doanh nghiệp trong kỷ nguyên số."
                  />
                  <Field
                    label="Tiêu đề danh sách tin tức & hoạt động"
                    value={content.newsPageListTitle || ""}
                    onChange={(value) => update("newsPageListTitle", value)}
                    placeholder="vd: Danh sách tin tức & hoạt động"
                  />
                </EditorSection>

                {/* 03. DOANH NGHIỆP */}
                <EditorSection
                  id="menu-doanh-nghiep"
                  number="03"
                  title="Trang Doanh nghiệp (/doanh-nghiep)"
                  description="Chỉnh sửa dòng chữ nhấn, tiêu đề chính, mô tả đầu trang và banner kêu gọi hợp tác cuối trang Doanh nghiệp."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/doanh-nghiep"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#d42027",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /doanh-nghiep ↗
                    </a>
                  </div>

                  {/* Live preview */}
                  <div style={{ background: "#fef2f2", border: "1px dashed #fca5a5", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#d42027", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      👁️ Xem trước tiêu đề đầu trang Doanh nghiệp:
                    </div>
                    <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #fecaca" }}>
                      <span style={{ color: "#d42027", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        {content.enterprisesPageEyebrow || "ĐỒNG HÀNH & NÂNG TẦM"}
                      </span>
                      <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                        {content.enterprisesPageTitle || "Doanh Nghiệp & Thương Hiệu Tiêu Biểu"}
                      </h2>
                      <p style={{ color: "#64748b", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                        {content.enterprisesPageDescription || "Hơn 3.000 thương hiệu hàng đầu Việt Nam đã lựa chọn Hải Dương Media để kiến tạo chiến lược truyền thông..."}
                      </p>
                    </div>
                  </div>

                  <Field
                    label="Dòng chữ in hoa nhỏ phía trên (Eyebrow)"
                    value={content.enterprisesPageEyebrow || ""}
                    onChange={(value) => update("enterprisesPageEyebrow", value)}
                    placeholder="vd: ĐỒNG HÀNH & NÂNG TẦM"
                  />
                  <Field
                    label="Tiêu đề chính trang Doanh nghiệp"
                    value={content.enterprisesPageTitle || ""}
                    onChange={(value) => update("enterprisesPageTitle", value)}
                    placeholder="vd: Doanh Nghiệp & Thương Hiệu Tiêu Biểu"
                  />
                  <Field
                    label="Đoạn văn mô tả / giới thiệu"
                    value={content.enterprisesPageDescription || ""}
                    onChange={(value) => update("enterprisesPageDescription", value)}
                    multiline
                    placeholder="vd: Hơn 3.000 thương hiệu hàng đầu Việt Nam đã lựa chọn Hải Dương Media..."
                  />
                  <Field
                    label="Tiêu đề danh sách doanh nghiệp & thương hiệu"
                    value={content.enterprisesPageListTitle || ""}
                    onChange={(value) => update("enterprisesPageListTitle", value)}
                    placeholder="vd: Danh sách doanh nghiệp & thương hiệu"
                  />

                  {/* CTA Box Section */}
                  <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>
                      Khối Banner Kêu Gọi Hợp Tác (CTA) Cuối Trang Doanh Nghiệp
                    </h4>
                    <Field
                      label="Dòng nhãn nhỏ CTA"
                      value={content.enterprisesCtaEyebrow || ""}
                      onChange={(value) => update("enterprisesCtaEyebrow", value)}
                      placeholder="vd: DÀNH CHO DOANH NGHIỆP"
                    />
                    <Field
                      label="Tiêu đề khối CTA"
                      value={content.enterprisesCtaTitle || ""}
                      onChange={(value) => update("enterprisesCtaTitle", value)}
                      placeholder="vd: Đưa thương hiệu của bạn xuất hiện trên VTV & hơn 200 báo điện tử"
                    />
                    <Field
                      label="Mô tả quyền lợi doanh nghiệp CTA"
                      value={content.enterprisesCtaDescription || ""}
                      onChange={(value) => update("enterprisesCtaDescription", value)}
                      multiline
                      placeholder="vd: Đồng hành cùng Hải Dương Media để sản xuất TVC chuẩn 4K..."
                    />
                    <div className="field-row">
                      <Field
                        label="Chữ trên nút bấm CTA"
                        value={content.enterprisesCtaButtonText || ""}
                        onChange={(value) => update("enterprisesCtaButtonText", value)}
                        placeholder="vd: Nhận tư vấn truyền thông"
                      />
                      <Field
                        label="Đường dẫn nút bấm CTA"
                        value={content.enterprisesCtaButtonHref || ""}
                        onChange={(value) => update("enterprisesCtaButtonHref", value)}
                        placeholder="vd: /lien-he"
                      />
                    </div>
                  </div>
                </EditorSection>

                {/* 04. DOANH NHÂN */}
                <EditorSection
                  id="menu-doanh-nhan"
                  number="04"
                  title="Trang Doanh nhân (/doanh-nhan)"
                  description="Chỉnh sửa dòng chữ nhấn, tiêu đề chính và mô tả trên trang Gương Mặt Doanh Nhân & Lãnh Đạo Tiêu Biểu."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/doanh-nhan"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#0284c7",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /doanh-nhan ↗
                    </a>
                  </div>

                  {/* Live preview */}
                  <div style={{ background: "#f0f9ff", border: "1px dashed #7dd3fc", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      👁️ Xem trước tiêu đề đầu trang Doanh nhân:
                    </div>
                    <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #bae6fd" }}>
                      <span style={{ color: "#d42027", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        {content.entrepreneursPageEyebrow || "CHUYÊN ĐỀ DOANH NHÂN"}
                      </span>
                      <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                        {content.entrepreneursPageTitle || "Gương Mặt Doanh Nhân & Lãnh Đạo Tiêu Biểu"}
                      </h2>
                      <p style={{ color: "#64748b", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                        {content.entrepreneursPageDescription || "Chân dung các nhà lãnh đạo tiên phong, câu chuyện khởi nghiệp truyền cảm hứng..."}
                      </p>
                    </div>
                  </div>

                  <Field
                    label="Dòng chữ in hoa nhỏ phía trên (Eyebrow)"
                    value={content.entrepreneursPageEyebrow || ""}
                    onChange={(value) => update("entrepreneursPageEyebrow", value)}
                    placeholder="vd: CHUYÊN ĐỀ DOANH NHÂN"
                  />
                  <Field
                    label="Tiêu đề chính trang Doanh nhân"
                    value={content.entrepreneursPageTitle || ""}
                    onChange={(value) => update("entrepreneursPageTitle", value)}
                    placeholder="vd: Gương Mặt Doanh Nhân & Lãnh Đạo Tiêu Biểu"
                  />
                  <Field
                    label="Đoạn văn mô tả / giới thiệu"
                    value={content.entrepreneursPageDescription || ""}
                    onChange={(value) => update("entrepreneursPageDescription", value)}
                    multiline
                    placeholder="vd: Chân dung các nhà lãnh đạo tiên phong, câu chuyện khởi nghiệp truyền cảm hứng và hành trình phát triển doanh nghiệp."
                  />
                  <Field
                    label="Tiêu đề danh sách bài viết doanh nhân"
                    value={content.entrepreneursPageListTitle || ""}
                    onChange={(value) => update("entrepreneursPageListTitle", value)}
                    placeholder="vd: Danh sách bài viết doanh nhân"
                  />
                </EditorSection>

                {/* 05. SẢN PHẨM */}
                <EditorSection
                  id="menu-san-pham"
                  number="05"
                  title="Trang Sản phẩm (/san-pham)"
                  description="Chỉnh sửa dòng chữ nhấn, tiêu đề chính và mô tả giải pháp dịch vụ truyền thông toàn diện."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/san-pham"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#16a34a",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /san-pham ↗
                    </a>
                  </div>

                  {/* Live preview */}
                  <div style={{ background: "#f0fdf4", border: "1px dashed #86efac", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      👁️ Xem trước tiêu đề đầu trang Sản phẩm:
                    </div>
                    <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                      <span style={{ color: "#d42027", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        {content.productsPageEyebrow || "SẢN PHẨM & DỊCH VỤ TRUYỀN THÔNG"}
                      </span>
                      <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                        {content.productsPageTitle || "Giải Pháp Truyền Thông & Xây Dựng Thương Hiệu Toàn Diện"}
                      </h2>
                      <p style={{ color: "#64748b", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                        {content.productsPageDescription || "Hải Dương Media cung cấp hệ sinh thái sản phẩm và dịch vụ đồng bộ..."}
                      </p>
                    </div>
                  </div>

                  <Field
                    label="Dòng chữ in hoa nhỏ phía trên (Eyebrow)"
                    value={content.productsPageEyebrow || ""}
                    onChange={(value) => update("productsPageEyebrow", value)}
                    placeholder="vd: SẢN PHẨM & DỊCH VỤ TRUYỀN THÔNG"
                  />
                  <Field
                    label="Tiêu đề chính trang Sản phẩm"
                    value={content.productsPageTitle || ""}
                    onChange={(value) => update("productsPageTitle", value)}
                    placeholder="vd: Giải Pháp Truyền Thông & Xây Dựng Thương Hiệu Toàn Diện"
                  />
                  <Field
                    label="Đoạn văn mô tả / giới thiệu"
                    value={content.productsPageDescription || ""}
                    onChange={(value) => update("productsPageDescription", value)}
                    multiline
                    placeholder="vd: Hải Dương Media cung cấp hệ sinh thái sản phẩm và dịch vụ đồng bộ..."
                  />
                  <Field
                    label="Tiêu đề danh sách sản phẩm & dịch vụ"
                    value={content.productsPageListTitle || ""}
                    onChange={(value) => update("productsPageListTitle", value)}
                    placeholder="vd: Danh sách sản phẩm & dịch vụ"
                  />
                </EditorSection>

                {/* 06. TƯ VẤN VÀ CHỨNG NHẬN ISO */}
                <EditorSection
                  id="menu-iso"
                  number="06"
                  title="Trang Tư Vấn & Chứng Nhận ISO (/dich-vu/chung-nhan-iso)"
                  description="Chỉnh sửa dòng chữ nhấn, tiêu đề chính, mô tả, nội dung chi tiết bài viết và nút hành động của dịch vụ ISO."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/dich-vu/chung-nhan-iso"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#2563eb",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /dich-vu/chung-nhan-iso ↗
                    </a>
                  </div>

                  <Field
                    label="Dòng chữ in hoa nhỏ phía trên (Eyebrow)"
                    value={content.isoEyebrow || ""}
                    onChange={(value) => update("isoEyebrow", value)}
                    placeholder="vd: TIÊU CHUẨN QUỐC TẾ"
                  />
                  <Field
                    label="Tiêu đề chính dịch vụ ISO"
                    value={content.isoTitle || ""}
                    onChange={(value) => update("isoTitle", value)}
                    placeholder="vd: Tư Vấn & Chứng Nhận ISO Chuyên Nghiệp"
                  />
                  <Field
                    label="Mô tả tóm tắt đầu trang"
                    value={content.isoDescription || ""}
                    onChange={(value) => update("isoDescription", value)}
                    multiline
                    placeholder="vd: Dịch vụ tư vấn, đào tạo và cấp chứng chỉ ISO..."
                  />
                  <div className="field-row">
                    <Field
                      label="Chữ trên nút liên hệ (CTA)"
                      value={content.isoCtaText || ""}
                      onChange={(value) => update("isoCtaText", value)}
                      placeholder="vd: Nhận hồ sơ tư vấn miễn phí"
                    />
                    <Field
                      label="Đường dẫn nút liên hệ"
                      value={content.isoCtaHref || ""}
                      onChange={(value) => update("isoCtaHref", value)}
                      placeholder="vd: /lien-he"
                    />
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px", color: "var(--ink)" }}>
                      Nội dung chi tiết bài viết ISO (Trình soạn thảo chuyên nghiệp)
                    </label>
                    <EnterpriseContentEditor
                      value={content.isoContent || ""}
                      onChange={(val) => update("isoContent", val)}
                      minHeight="450px"
                    />
                  </div>
                </EditorSection>

                {/* 07. ĐĂNG KÝ NHÃN HIỆU ĐỘC QUYỀN */}
                <EditorSection
                  id="menu-nhan-hieu"
                  number="07"
                  title="Trang Đăng Ký Nhãn Hiệu Độc Quyền (/dich-vu/dang-ky-nhan-hieu)"
                  description="Chỉnh sửa dòng chữ nhấn, tiêu đề chính, mô tả, nội dung chi tiết bài viết và nút hành động của dịch vụ bảo hộ nhãn hiệu."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/dich-vu/dang-ky-nhan-hieu"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#dc2626",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /dich-vu/dang-ky-nhan-hieu ↗
                    </a>
                  </div>

                  <Field
                    label="Dòng chữ in hoa nhỏ phía trên (Eyebrow)"
                    value={content.trademarkEyebrow || ""}
                    onChange={(value) => update("trademarkEyebrow", value)}
                    placeholder="vd: BẢO VỆ TÀI SẢN THƯƠNG HIỆU"
                  />
                  <Field
                    label="Tiêu đề chính đăng ký nhãn hiệu"
                    value={content.trademarkTitle || ""}
                    onChange={(value) => update("trademarkTitle", value)}
                    placeholder="vd: Đăng Ký Nhãn Hiệu Độc Quyền Trọn Gói"
                  />
                  <Field
                    label="Mô tả tóm tắt đầu trang"
                    value={content.trademarkDescription || ""}
                    onChange={(value) => update("trademarkDescription", value)}
                    multiline
                    placeholder="vd: Xác lập quyền sở hữu hợp pháp đối với nhãn hiệu..."
                  />
                  <div className="field-row">
                    <Field
                      label="Chữ trên nút liên hệ (CTA)"
                      value={content.trademarkCtaText || ""}
                      onChange={(value) => update("trademarkCtaText", value)}
                      placeholder="vd: Tra cứu nhãn hiệu miễn phí"
                    />
                    <Field
                      label="Đường dẫn nút liên hệ"
                      value={content.trademarkCtaHref || ""}
                      onChange={(value) => update("trademarkCtaHref", value)}
                      placeholder="vd: /lien-he"
                    />
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px", color: "var(--ink)" }}>
                      Nội dung chi tiết bài viết Đăng ký nhãn hiệu (Trình soạn thảo chuyên nghiệp)
                    </label>
                    <EnterpriseContentEditor
                      value={content.trademarkContent || ""}
                      onChange={(val) => update("trademarkContent", val)}
                      minHeight="450px"
                    />
                  </div>
                </EditorSection>

                {/* 08. ĐĂNG KÝ SỞ HỮU TRÍ TUỆ */}
                <EditorSection
                  id="menu-shtt"
                  number="08"
                  title="Trang Đăng Ký Sở Hữu Trí Tuệ (/dich-vu/so-huu-tri-tue)"
                  description="Chỉnh sửa thông tin bản quyền tác giả, sáng chế, kiểu dáng công nghiệp và giải pháp bảo vệ SHTT."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/dich-vu/so-huu-tri-tue"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#059669",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /dich-vu/so-huu-tri-tue ↗
                    </a>
                  </div>

                  <Field
                    label="Dòng chữ in hoa nhỏ phía trên (Eyebrow)"
                    value={content.ipEyebrow || ""}
                    onChange={(value) => update("ipEyebrow", value)}
                    placeholder="vd: BẢO HỘ TÀI SẢN VÔ HÌNH"
                  />
                  <Field
                    label="Tiêu đề chính dịch vụ Sở hữu trí tuệ"
                    value={content.ipTitle || ""}
                    onChange={(value) => update("ipTitle", value)}
                    placeholder="vd: Đăng Ký & Bảo Hộ Sở Hữu Trí Tuệ Toàn Diện"
                  />
                  <Field
                    label="Mô tả tóm tắt đầu trang"
                    value={content.ipDescription || ""}
                    onChange={(value) => update("ipDescription", value)}
                    multiline
                    placeholder="vd: Giải pháp bảo hộ toàn diện cho bản quyền tác giả, sáng chế..."
                  />
                  <div className="field-row">
                    <Field
                      label="Chữ trên nút liên hệ (CTA)"
                      value={content.ipCtaText || ""}
                      onChange={(value) => update("ipCtaText", value)}
                      placeholder="vd: Tư vấn xác lập quyền"
                    />
                    <Field
                      label="Đường dẫn nút liên hệ"
                      value={content.ipCtaHref || ""}
                      onChange={(value) => update("ipCtaHref", value)}
                      placeholder="vd: /lien-he"
                    />
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px", color: "var(--ink)" }}>
                      Nội dung chi tiết bài viết Sở hữu trí tuệ (Trình soạn thảo chuyên nghiệp)
                    </label>
                    <EnterpriseContentEditor
                      value={content.ipContent || ""}
                      onChange={(val) => update("ipContent", val)}
                      minHeight="450px"
                    />
                  </div>
                </EditorSection>

                {/* 09. DỊCH VỤ FACEBOOK TOÀN DIỆN */}
                <EditorSection
                  id="menu-fb"
                  number="09"
                  title="Trang Dịch Vụ Facebook Toàn Diện (/dich-vu-facebook)"
                  description="Chỉnh sửa thông điệp đầu trang và khối Cam kết Làm trước trả tiền sau của Hub Dịch vụ Facebook (10 dịch vụ con được quản lý trong tab 'Bài viết')."
                >
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href="/dich-vu-facebook"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#1877f2",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={14} /> Xem trang thực tế: /dich-vu-facebook ↗
                    </a>
                  </div>

                  <Field
                    label="Dòng chữ in hoa nhỏ phía trên (Eyebrow)"
                    value={content.facebookHubEyebrow || ""}
                    onChange={(value) => update("facebookHubEyebrow", value)}
                    placeholder="vd: DỊCH VỤ FACEBOOK TOÀN DIỆN"
                  />
                  <Field
                    label="Tiêu đề chính Hub Dịch vụ Facebook"
                    value={content.facebookHubTitle || ""}
                    onChange={(value) => update("facebookHubTitle", value)}
                    placeholder="vd: Dịch Vụ Facebook Chuyên Nghiệp - Uy Tín Hàng Đầu"
                  />
                  <Field
                    label="Mô tả tóm tắt Hub Dịch vụ Facebook"
                    value={content.facebookHubDescription || ""}
                    onChange={(value) => update("facebookHubDescription", value)}
                    multiline
                    placeholder="vd: Hệ thống giải pháp xử lý sự cố Facebook toàn diện..."
                  />
                  <Field
                    label="Tiêu đề khối Cam kết vàng"
                    value={content.facebookHubPolicyTitle || ""}
                    onChange={(value) => update("facebookHubPolicyTitle", value)}
                    placeholder="vd: CHÍNH SÁCH VÀNG: LÀM TRƯỚC - TRẢ TIỀN SAU (KHÔNG CỌC)"
                  />
                  <Field
                    label="Nội dung chi tiết cam kết vàng"
                    value={content.facebookHubPolicyContent || ""}
                    onChange={(value) => update("facebookHubPolicyContent", value)}
                    multiline
                    placeholder="vd: Chúng tôi chỉ nhận thanh toán khi bạn đã lấy lại được nick..."
                  />

                  {/* NỘI DUNG BÀI VIẾT GIỚI THIỆU HUB FACEBOOK DẠNG WYSIWYG EDITOR */}
                  <div style={{ marginTop: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px", color: "var(--ink)" }}>
                      Nội dung bài viết giới thiệu Hub Dịch vụ Facebook (Trình soạn thảo chuyên nghiệp - hỗ trợ bảng biểu, hình ảnh)
                    </label>
                    <EnterpriseContentEditor
                      value={content.facebookHubContent || ""}
                      onChange={(val) => update("facebookHubContent", val)}
                      minHeight="350px"
                    />
                  </div>

                  {/* QUẢN LÝ VÀ CHỈNH SỬA NỘI DUNG 10 DỊCH VỤ FACEBOOK CON */}
                  <AdminFacebookManager />
                </EditorSection>

                {/* ========================================================
                    01. CẤU HÌNH HIỂN THỊ & SẮP XẾP CÁC MỤC TRÊN TRANG CHỦ
                    ======================================================== */}
                <EditorSection
                  id="homepage-sections"
                  number="01"
                  title="Cấu hình Hiển thị & Sắp xếp các mục trên Trang chủ"
                  description="Bật/Tắt từng khối nội dung và điều chỉnh thứ tự xuất hiện trên trang chủ website bằng nút Lên/Xuống."
                >
          <div style={{ display: "grid", gap: "10px" }}>
            {sectionsList.map((sec, index) => (
              <div
                key={sec.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid var(--line)",
                  background: sec.enabled ? "#ffffff" : "#f8fafc",
                  opacity: sec.enabled ? 1 : 0.65,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      background: sec.enabled ? "rgba(212,32,39,0.1)" : "#e2e8f0",
                      color: sec.enabled ? "#d42027" : "#64748b",
                      fontSize: "12px",
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#0f172a" }}>{sec.name}</strong>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--muted)" }}>
                      Mã khối: <code>{sec.id}</code>
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Toggle button */}
                  <button
                    type="button"
                    onClick={() => toggleHomepageSection(sec.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 800,
                      cursor: "pointer",
                      background: sec.enabled ? "#edfff4" : "#f1f5f9",
                      color: sec.enabled ? "#166534" : "#64748b",
                    }}
                  >
                    {sec.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                    {sec.enabled ? "Đang hiển thị" : "Đã tắt (Ẩn)"}
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveHomepageSection(index, "up")}
                    title="Di chuyển lên trên"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid var(--line)",
                      background: "#fff",
                      cursor: index === 0 ? "not-allowed" : "pointer",
                      opacity: index === 0 ? 0.3 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowUp size={15} />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={index === sectionsList.length - 1}
                    onClick={() => moveHomepageSection(index, "down")}
                    title="Di chuyển xuống dưới"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid var(--line)",
                      background: "#fff",
                      cursor: index === sectionsList.length - 1 ? "not-allowed" : "pointer",
                      opacity: index === sectionsList.length - 1 ? 0.3 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowDown size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        {/* ========================================================
            02. CẤU HÌNH BANNER TRANG CHỦ (THÊM, UPLOAD ẢNH, NỘI DUNG, LINK)
            ======================================================== */}
        <EditorSection
          id="banner-slider"
          number="02"
          title="Quản lý Banner Slider Trang Chủ"
          description="Cấu hình thêm banner mới, tải ảnh lên từ máy tính, nhập nội dung hiển thị (nếu có), link liên kết, bật/tắt và đổi thứ tự hiển thị."
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                Hiện có {content.bannerSlides.length} banner trên slider
              </span>
              <button
                type="button"
                onClick={() => setAllBannersCollapse(true)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Thu gọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setAllBannersCollapse(false)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Mở rộng tất cả
              </button>
            </div>
            <button
              type="button"
              onClick={addBanner}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#d42027",
                color: "#fff",
                fontWeight: 800,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Thêm Banner Mới
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {content.bannerSlides.map((slide, index) => {
              const slideId = slide.id || `banner-${index}`;
              const isCollapsed = collapsedBanners[slideId] ?? true;

              return (
                <div
                  key={slideId}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    background: slide.active !== false ? "#ffffff" : "#f8fafc",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    overflow: "hidden",
                  }}
                >
                  {/* Banner Card Header */}
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#fafbfd",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapseBanner(slideId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#d42027",
                          background: "rgba(212,32,39,0.1)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        BANNER #{index + 1}
                      </span>

                      {slide.bgImage && (
                        <img
                          src={slide.bgImage}
                          alt="Thumbnail"
                          style={{ width: "42px", height: "26px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--line)" }}
                        />
                      )}

                      <strong style={{ fontSize: "14px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {slide.title || slide.highlight || "Banner hình ảnh (Không có tiêu đề)"}
                      </strong>

                      {slide.tag && (
                        <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: "#fee2e2", color: "#b91c1c", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {slide.tag}
                        </span>
                      )}

                      {slide.badge && (
                        <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: "#f1f5f9", color: "#334155", fontWeight: 700, border: "1px solid var(--line)", whiteSpace: "nowrap" }}>
                          🛡️ {slide.badge}
                        </span>
                      )}

                      {slide.active === false ? (
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                          Đã ẩn
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                          Active
                        </span>
                      )}
                    </div>

                    {/* Action buttons on header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveBanner(index, "up")}
                        title="Di chuyển lên"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={index === content.bannerSlides.length - 1}
                        onClick={() => moveBanner(index, "down")}
                        title="Di chuyển xuống"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === content.bannerSlides.length - 1 ? "not-allowed" : "pointer",
                          opacity: index === content.bannerSlides.length - 1 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateBanner(index, "active", slide.active === false)}
                        title={slide.active === false ? "Bật hiển thị" : "Tắt ẩn"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {slide.active === false ? <Eye size={14} color="#64748b" /> : <EyeOff size={14} color="#166534" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCollapseBanner(slideId)}
                        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        {isCollapsed ? "Mở rộng" : "Thu gọn"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeBanner(index)}
                        title="Xóa banner"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(220,38,38,0.1)",
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Banner Expanded Form */}
                  {!isCollapsed && (
                    <div style={{ padding: "20px", display: "grid", gap: "14px" }}>
                      {/* Active switch */}
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                        <input
                          type="checkbox"
                          checked={slide.active !== false}
                          onChange={(e) => updateBanner(index, "active", e.target.checked)}
                          style={{ width: "16px", height: "16px", accentColor: "#d42027" }}
                        />
                        Hiển thị banner này trên Slider Trang chủ (Active)
                      </label>

                      {/* Image Upload */}
                      <ImageUploadField
                        label="Ảnh Banner (Upload từ máy tính hoặc dán URL)"
                        value={slide.bgImage || ""}
                        onChange={(val) => updateBanner(index, "bgImage", val)}
                        placeholder="Chọn ảnh từ máy tính hoặc dán link ảnh https://..."
                      />

                      {/* Link ctaHref */}
                      <Field
                        label="Đường dẫn liên kết khi bấm vào Banner (Link URL: https://... hoặc /su-kien/..., /san-pham...)"
                        value={slide.ctaHref || ""}
                        onChange={(val) => updateBanner(index, "ctaHref", val)}
                      />

                      {/* Tag tiêu điểm & Huy hiệu phụ / Khuyến mãi */}
                      <div className="field-row">
                        <Field
                          label="Tag tiêu điểm màu đỏ (Ví dụ: BOOKING PR / ADS, VTV BROADCAST)"
                          value={slide.tag || ""}
                          onChange={(val) => updateBanner(index, "tag", val)}
                          placeholder="vd: BOOKING PR / ADS"
                        />
                        <Field
                          label="Huy hiệu phụ / Khuyến mãi màu xám kính (Ví dụ: CHIẾT KHẤU ĐẾN 51%, CHUẨN PHÁT SÓNG VTV)"
                          value={slide.badge || ""}
                          onChange={(val) => updateBanner(index, "badge", val)}
                          placeholder="vd: CHIẾT KHẤU ĐẾN 51%"
                        />
                      </div>

                      {/* Tiêu đề & Dòng nổi bật */}
                      <div className="field-row">
                        <Field
                          label="Tiêu đề lớn Banner"
                          value={slide.title || ""}
                          onChange={(val) => updateBanner(index, "title", val)}
                          placeholder="vd: Booking Quảng Cáo Báo Mạng Toàn Quốc"
                        />
                        <Field
                          label="Dòng chữ nổi bật màu cam"
                          value={slide.highlight || ""}
                          onChange={(val) => updateBanner(index, "highlight", val)}
                          placeholder="vd: Ưu đãi chiết khấu lên đến 51% tại các đầu báo hàng đầu"
                        />
                      </div>

                      <Field
                        label="Mô tả nội dung chi tiết"
                        value={slide.description || ""}
                        onChange={(val) => updateBanner(index, "description", val)}
                        multiline
                        placeholder="vd: Booking bài viết PR trên VnExpress, Dân Trí, Tuổi Trẻ, CafeF, VietnamNet..."
                      />

                      {/* Nút bấm chính */}
                      <div className="field-row">
                        <Field
                          label="Chữ nút bấm chính (Ví dụ: Nhận báo giá báo mạng, Khám phá ngay)"
                          value={slide.ctaText || ""}
                          onChange={(val) => updateBanner(index, "ctaText", val)}
                          placeholder="vd: Nhận báo giá báo mạng"
                        />
                        <Field
                          label="Đường dẫn nút chính (Ví dụ: /lien-he, #vtv-commercials, https://...)"
                          value={slide.ctaHref || ""}
                          onChange={(val) => updateBanner(index, "ctaHref", val)}
                          placeholder="vd: /lien-he"
                        />
                      </div>

                      {/* Nút bấm phụ */}
                      <div className="field-row">
                        <Field
                          label="Chữ nút bấm phụ (Ví dụ: Xem mẫu phim VTV - để trống nếu muốn ẩn)"
                          value={slide.secondaryCtaText ?? "Xem mẫu phim VTV"}
                          onChange={(val) => updateBanner(index, "secondaryCtaText", val)}
                          placeholder="vd: Xem mẫu phim VTV"
                        />
                        <Field
                          label="Đường dẫn nút phụ (Ví dụ: #vtv-commercials hoặc /lien-he)"
                          value={slide.secondaryCtaHref || "#vtv-commercials"}
                          onChange={(val) => updateBanner(index, "secondaryCtaHref", val)}
                          placeholder="vd: #vtv-commercials"
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          onClick={() => toggleCollapseBanner(slideId)}
                          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}
                        >
                          Thu gọn lại
                        </button>
                        <button
                          type="button"
                          onClick={() => save(`Đã lưu banner #${index + 1} thành công!`)}
                          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#d42027", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Save size={15} /> Lưu Banner này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* ========================================================
            03. SẢN XUẤT PHIM QUẢNG CÁO TRÊN VTV
            ======================================================== */}
        <EditorSection
          id="vtv-commercials-admin"
          number="03"
          title="Phim Quảng Cáo & Phóng Sự Trên VTV/HTV"
          description="Quản lý tiêu đề, nội dung giới thiệu và danh sách các TVC, phóng sự truyền hình phát sóng khung giờ vàng trên các kênh VTV1, VTV3, HTV9..."
        >
          {/* Cấu hình tiêu đề & nội dung giới thiệu mục VTV */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid var(--line)",
              marginBottom: "24px",
              display: "grid",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Tv size={18} color="#d42027" />
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                Nội dung phần đầu mục VTV (Tiêu đề & Giới thiệu)
              </strong>
            </div>

            <div className="field-row">
              <Field
                label="Dòng nhãn nhỏ (Eyebrow Badge)"
                value={content.vtvBadge || ""}
                onChange={(val) => update("vtvBadge", val)}
              />
              <Field
                label="Tiêu đề chính mục VTV"
                value={content.vtvTitle || ""}
                onChange={(val) => update("vtvTitle", val)}
              />
            </div>

            <Field
              label="Đoạn văn mô tả / giới thiệu"
              value={content.vtvDescription || ""}
              onChange={(val) => update("vtvDescription", val)}
              multiline
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                Tổng số: {(content.vtvCommercials || []).length} video
              </span>
              <button
                type="button"
                onClick={() => setAllVtvCollapse(true)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Thu gọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setAllVtvCollapse(false)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Mở rộng tất cả
              </button>
            </div>

            <button
              type="button"
              onClick={addVtv}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 800,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Thêm Video TVC Mới
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {(content.vtvCommercials || []).map((vtv, index) => {
              const vtvId = vtv.id || `vtv-${index}`;
              const isCollapsed = collapsedVtv[vtvId] ?? true;

              return (
                <div
                  key={vtvId}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    background: vtv.active !== false ? "#ffffff" : "#f8fafc",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#fafbfd",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapseVtv(vtvId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#d42027",
                          background: "rgba(212,32,39,0.1)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        VTV #{index + 1}
                      </span>

                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {vtv.title}
                        </strong>
                        <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                          {vtv.channel} • {vtv.program} • {vtv.timeSlot}
                        </small>
                      </div>

                      {vtv.active === false ? (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                          Đã ẩn
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                          Active
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveVtv(index, "up")}
                        title="Di chuyển lên"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={index === (content.vtvCommercials || []).length - 1}
                        onClick={() => moveVtv(index, "down")}
                        title="Di chuyển xuống"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === (content.vtvCommercials || []).length - 1 ? "not-allowed" : "pointer",
                          opacity: index === (content.vtvCommercials || []).length - 1 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateVtv(index, "active", vtv.active === false)}
                        title={vtv.active === false ? "Bật hiển thị" : "Tắt (Ẩn)"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {vtv.active === false ? <EyeOff size={14} color="#64748b" /> : <Eye size={14} color="#166534" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCollapseVtv(vtvId)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        {isCollapsed ? "Mở rộng" : "Thu gọn"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeVtv(index)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(220,38,38,0.1)",
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div style={{ padding: "20px", display: "grid", gap: "14px" }}>
                      <Field
                        label="Tiêu đề video / Phóng sự"
                        value={vtv.title}
                        onChange={(val) => updateVtv(index, "title", val)}
                      />
                      <div className="field-row">
                        <Field
                          label="Kênh phát sóng (Ví dụ: VTV1, VTV3, HTV9)"
                          value={vtv.channel}
                          onChange={(val) => updateVtv(index, "channel", val)}
                        />
                        <Field
                          label="Chương trình (Ví dụ: Chuyển Động 24h, Thời Sự 19h)"
                          value={vtv.program}
                          onChange={(val) => updateVtv(index, "program", val)}
                        />
                      </div>
                      <div className="field-row">
                        <Field
                          label="Khung giờ phát sóng (Ví dụ: Trưa 11:15 & Tối 18:30)"
                          value={vtv.timeSlot}
                          onChange={(val) => updateVtv(index, "timeSlot", val)}
                        />
                        <Field
                          label="Mã YouTube ID (Ví dụ: QEBI8sjWxdQ hoặc dán link YouTube)"
                          value={vtv.youtubeId}
                          onChange={(val) => {
                            let cleanId = val.trim();
                            if (cleanId.includes("v=")) cleanId = cleanId.split("v=")[1].split("&")[0];
                            else if (cleanId.includes("youtu.be/")) cleanId = cleanId.split("youtu.be/")[1].split("?")[0];
                            updateVtv(index, "youtubeId", cleanId);
                          }}
                        />
                      </div>
                      <Field
                        label="Mô tả nội dung phóng sự / TVC"
                        value={vtv.description}
                        onChange={(val) => updateVtv(index, "description", val)}
                        multiline
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          onClick={() => toggleCollapseVtv(vtvId)}
                          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}
                        >
                          Thu gọn lại
                        </button>
                        <button
                          type="button"
                          onClick={() => save(`Đã lưu video "${vtv.title}" thành công!`)}
                          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#d42027", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Save size={15} /> Lưu Video này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* ========================================================
            04. MỤC SỰ KIỆN SẮP DIỄN RA (TRANG CHỦ)
            ======================================================== */}
        <EditorSection
          id="su-kien-admin"
          number="04"
          title="Mục Sự Kiện Sắp Diễn Ra (Trang Chủ)"
          description="Chỉnh sửa dòng nhãn nhỏ, tiêu đề chính 'Sự Kiện Sắp Diễn Ra', đoạn văn giới thiệu và nhãn liên kết của khối sự kiện trên trang chủ."
        >
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid var(--line)",
              marginBottom: "16px",
              display: "grid",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={18} color="#d42027" />
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                Nội dung phần đầu mục Sự Kiện (Tiêu đề & Giới thiệu)
              </strong>
            </div>

            <div className="field-row">
              <Field
                label="Dòng nhãn nhỏ (Eyebrow Badge)"
                value={content.eventsEyebrow || ""}
                onChange={(val) => update("eventsEyebrow", val)}
              />
              <Field
                label="Tiêu đề chính mục Sự Kiện"
                value={content.eventsTitle || ""}
                onChange={(val) => update("eventsTitle", val)}
              />
            </div>

            <Field
              label="Đoạn văn mô tả / giới thiệu"
              value={content.eventsDescription || ""}
              onChange={(val) => update("eventsDescription", val)}
              multiline
            />

            <div className="field-row">
              <Field
                label="Chữ trên nút xem tất cả sự kiện"
                value={content.eventsViewAllText || ""}
                onChange={(val) => update("eventsViewAllText", val)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => save("Đã lưu tiêu đề & giới thiệu mục Sự Kiện thành công!")}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#d42027",
                  color: "#fff",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Save size={15} /> Lưu mục Sự Kiện
              </button>
            </div>
          </div>

          <div
            style={{
              padding: "16px 20px",
              borderRadius: "12px",
              background: "#fff",
              border: "1px dashed var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                Danh sách bài viết & diễn đàn Sự kiện
              </strong>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Các thẻ sự kiện hiển thị phía dưới được quản lý tập trung trong danh mục Bài viết (Sự kiện & Diễn đàn).
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMainTab("bai-viet")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
              }}
            >
              <BookOpen size={14} /> Mở Quản lý bài viết Sự kiện →
            </button>
          </div>
        </EditorSection>

        {/* ========================================================
            04. QUẢN LÝ BÀI VIẾT (TIN TỨC)
            ======================================================== */}
        <EditorSection
          id="tin-tuc"
          number="04"
          title="Quản lý & Đăng Bài Viết (Tin tức & Bài đăng)"
          description="Đăng bài viết mới, căn chỉnh lề nội dung, ảnh minh họa. Mỗi bài có tùy chọn Bật/Tắt hiển thị (Active), Thu gọn/Mở rộng, Sắp xếp thứ tự và Lưu độc lập."
        >
          {/* Action header bar */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                Tổng số: {content.news.length} bài viết
              </span>
              <button
                type="button"
                onClick={() => setAllNewsCollapse(true)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Thu gọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setAllNewsCollapse(false)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Mở rộng tất cả
              </button>
            </div>

            <button
              type="button"
              onClick={addNews}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 800,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Viết bài mới
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {content.news.map((item, index) => {
              const newsId = item.id || `news-${index}`;
              const isCollapsed = collapsedNews[newsId] ?? true;

              return (
                <div
                  key={newsId}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    background: item.active !== false ? "#ffffff" : "#f8fafc",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    overflow: "hidden",
                  }}
                >
                  {/* Article Card Header */}
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#fafbfd",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapseNews(newsId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#0f172a",
                          background: "#e2e8f0",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        BÀI #{index + 1}
                      </span>

                      {item.image && (
                        <img
                          src={item.image}
                          alt="Thumbnail"
                          style={{ width: "38px", height: "38px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--line)" }}
                        />
                      )}

                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.title}
                        </strong>
                        <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                          {item.category} • {item.date}
                        </small>
                      </div>

                      {/* Active Status Badge */}
                      {item.active === false ? (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                          Bản nháp (Ẩn)
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                          Active (Đang hiển thị)
                        </span>
                      )}
                    </div>

                    {/* Action buttons on header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveNews(index, "up")}
                        title="Di chuyển bài viết lên trên"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={index === content.news.length - 1}
                        onClick={() => moveNews(index, "down")}
                        title="Di chuyển bài viết xuống dưới"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === content.news.length - 1 ? "not-allowed" : "pointer",
                          opacity: index === content.news.length - 1 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      {/* Active toggle */}
                      <button
                        type="button"
                        onClick={() => updateNews(index, "active", item.active === false)}
                        title={item.active === false ? "Bật hiển thị bài viết" : "Tắt (Lưu bản nháp)"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {item.active === false ? <EyeOff size={14} color="#64748b" /> : <Eye size={14} color="#166534" />}
                        {item.active === false ? "Bật" : "Active"}
                      </button>

                      {/* Quick Save this article button */}
                      <button
                        type="button"
                        onClick={() => save(`Đã lưu bài viết "${item.title}" thành công!`)}
                        title="Lưu bài viết này"
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: "1px solid #bbf7d0",
                          background: "#f0fdf4",
                          color: "#166534",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 800,
                        }}
                      >
                        <Save size={13} /> Lưu bài này
                      </button>

                      {/* Collapse/Expand button */}
                      <button
                        type="button"
                        onClick={() => toggleCollapseNews(newsId)}
                        title={isCollapsed ? "Mở rộng bài viết" : "Thu gọn bài viết"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        {isCollapsed ? "Mở rộng" : "Thu gọn"}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeNews(index)}
                        title="Xóa bài viết"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(220,38,38,0.1)",
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Article Expanded Form */}
                  {!isCollapsed && (
                    <div style={{ padding: "24px", display: "grid", gap: "16px" }}>
                      {/* Active Status Switch */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          background: item.active !== false ? "#f0fdf4" : "#f8fafc",
                          border: "1px solid",
                          borderColor: item.active !== false ? "#bbf7d0" : "var(--line)",
                        }}
                      >
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                          <input
                            type="checkbox"
                            checked={item.active !== false}
                            onChange={(e) => updateNews(index, "active", e.target.checked)}
                            style={{ width: "16px", height: "16px", accentColor: "#166534" }}
                          />
                          Trạng thái hiển thị (Active): Công khai trên website (Bỏ chọn để lưu bản nháp)
                        </label>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: item.active !== false ? "#166534" : "#64748b" }}>
                          {item.active !== false ? "🟢 Đang hiển thị" : "⚪ Bản nháp"}
                        </span>
                      </div>

                      <div className="field-row">
                        <Field
                          label="Tiêu đề bài viết"
                          value={item.title}
                          onChange={(val) => updateNews(index, "title", val)}
                        />
                        <Field
                          label="Đường dẫn tĩnh (Slug URL - ví dụ: thuong-hieu-manh-quoc-gia-2027)"
                          value={item.slug}
                          onChange={(val) => updateNews(index, "slug", val)}
                        />
                      </div>

                      <div className="field-row">
                        <Field
                          label="Chuyên mục bài viết (Ví dụ: Tin tức, Hoạt động, Doanh nghiệp, Doanh nhân)"
                          value={item.category}
                          onChange={(val) => updateNews(index, "category", val)}
                        />
                        <Field
                          label="Ngày đăng (Ví dụ: 17.10.2026)"
                          value={item.date}
                          onChange={(val) => updateNews(index, "date", val)}
                        />
                      </div>

                      <div className="field-row">
                        <ImageUploadField
                          label="Ảnh bìa bài viết (Tải từ máy tính hoặc dán URL)"
                          value={item.image || ""}
                          onChange={(val) => updateNews(index, "image", val)}
                          placeholder="Dán link ảnh (https://...) hoặc tải từ máy tính"
                        />
                        <Field
                          label="Tác giả / Ban biên tập"
                          value={item.author || "Ban Biên Tập"}
                          onChange={(val) => updateNews(index, "author", val)}
                        />
                      </div>

                      <Field
                        label="Đoạn trích tóm tắt (Hiển thị ngoài trang danh sách bài viết)"
                        value={item.excerpt}
                        onChange={(val) => updateNews(index, "excerpt", val)}
                        multiline
                      />

                      <AdminRichEditor
                        label="Nội dung bài viết chi tiết & Căn chỉnh lề (Trích dẫn, đề mục ##, ảnh minh họa, căn giữa/phải/đều)"
                        value={item.content || item.excerpt}
                        onChange={(val) => updateNews(index, "content", val)}
                        rows={12}
                      />

                      {item.slug && (
                        <div style={{ marginTop: "4px" }}>
                          <a
                            href={`/tin-tuc/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "13px", color: "#d42027", fontWeight: 800, textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            Mở xem bài viết này trên website ↗
                          </a>
                        </div>
                      )}

                      {/* Bottom action bar */}
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
                        <button
                          type="button"
                          onClick={() => toggleCollapseNews(newsId)}
                          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}
                        >
                          Thu gọn bài viết
                        </button>
                        <button
                          type="button"
                          onClick={() => save(`Đã lưu bài viết "${item.title}" thành công!`)}
                          style={{
                            padding: "8px 20px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#0f172a",
                            color: "#fff",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Save size={15} /> Lưu bài viết này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* ========================================================
            05. QUẢN LÝ KIẾN THỨC & CẨM NANG TRUYỀN THÔNG
            ======================================================== */}
        <EditorSection
          id="kien-thuc"
          number="05"
          title="Quản lý Kiến Thức & Cẩm Nang Truyền Thông"
          description="Quản lý các bài chia sẻ kiến thức, cẩm nang chuyên môn trong mục 'Tin Mới & Kiến Thức Truyền Thông'."
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                Tổng số: {(content.knowledge || []).length} bài kiến thức
              </span>
              <button
                type="button"
                onClick={() => setAllKnowledgeCollapse(true)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Thu gọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setAllKnowledgeCollapse(false)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Mở rộng tất cả
              </button>
            </div>

            <button
              type="button"
              onClick={addKnowledge}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 800,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Thêm Bài Kiến Thức Mới
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {(content.knowledge || []).map((item, index) => {
              const knowId = item.id || `know-${index}`;
              const isCollapsed = collapsedKnowledge[knowId] ?? true;

              return (
                <div
                  key={knowId}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    background: item.active !== false ? "#ffffff" : "#f8fafc",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#fafbfd",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapseKnowledge(knowId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#d42027",
                          background: "rgba(212,32,39,0.1)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        KIẾN THỨC #{index + 1}
                      </span>

                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.title}
                        </strong>
                        <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                          {item.category} • {item.readTime} • {item.date}
                        </small>
                      </div>

                      {item.active === false ? (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                          Đã ẩn
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                          Active
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveKnowledge(index, "up")}
                        title="Di chuyển lên"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={index === (content.knowledge || []).length - 1}
                        onClick={() => moveKnowledge(index, "down")}
                        title="Di chuyển xuống"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === (content.knowledge || []).length - 1 ? "not-allowed" : "pointer",
                          opacity: index === (content.knowledge || []).length - 1 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateKnowledge(index, "active", item.active === false)}
                        title={item.active === false ? "Bật hiển thị" : "Tắt (Ẩn)"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {item.active === false ? <EyeOff size={14} color="#64748b" /> : <Eye size={14} color="#166534" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCollapseKnowledge(knowId)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        {isCollapsed ? "Mở rộng" : "Thu gọn"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeKnowledge(index)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(220,38,38,0.1)",
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div style={{ padding: "20px", display: "grid", gap: "14px" }}>
                      <Field
                        label="Tiêu đề bài viết kiến thức"
                        value={item.title}
                        onChange={(val) => updateKnowledge(index, "title", val)}
                      />
                      <div className="field-row">
                        <Field
                          label="Chuyên mục (Ví dụ: Chiến lược Marketing, Thương hiệu cá nhân, Báo chí PR)"
                          value={item.category}
                          onChange={(val) => updateKnowledge(index, "category", val)}
                        />
                        <Field
                          label="Thời gian đọc (Ví dụ: 5 phút đọc)"
                          value={item.readTime}
                          onChange={(val) => updateKnowledge(index, "readTime", val)}
                        />
                      </div>
                      <div className="field-row">
                        <Field
                          label="Ngày đăng (Ví dụ: 17.10.2026)"
                          value={item.date}
                          onChange={(val) => updateKnowledge(index, "date", val)}
                        />
                        <Field
                          label="Đường dẫn liên kết (Link)"
                          value={item.link}
                          onChange={(val) => updateKnowledge(index, "link", val)}
                        />
                      </div>
                      <ImageUploadField
                        label="Ảnh bìa bài kiến thức (Tải lên hoặc dán URL)"
                        value={item.image || ""}
                        onChange={(val) => updateKnowledge(index, "image", val)}
                      />
                      <Field
                        label="Tóm tắt ngắn nội dung kiến thức"
                        value={item.excerpt}
                        onChange={(val) => updateKnowledge(index, "excerpt", val)}
                        multiline
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          onClick={() => toggleCollapseKnowledge(knowId)}
                          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}
                        >
                          Thu gọn lại
                        </button>
                        <button
                          type="button"
                          onClick={() => save(`Đã lưu bài kiến thức "${item.title}" thành công!`)}
                          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#d42027", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Save size={15} /> Lưu Bài kiến thức này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* ========================================================
            06. QUẢN LÝ SỰ KIỆN (CÓ THU GỌN, SẮP XẾP, ACTIVE)
            ======================================================== */}
        <EditorSection
          id="su-kien"
          number="06"
          title="Quản lý Sự Kiện & Diễn Đàn Doanh Nghiệp"
          description="Quản lý thẻ sự kiện hiển thị trên trang chủ và trang chi tiết sự kiện."
        >
          {/* Switcher header between Articles and Event Cards */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              background: "#f8fafc",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              padding: "12px 18px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
              Đang xem: <strong>Cấu hình Thẻ Sự kiện nổi bật (Trang chủ & /su-kien)</strong>
            </span>
            <button
              type="button"
              onClick={() => setEventAdminView("articles")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
              }}
            >
              <Newspaper size={14} /> Mở Danh sách bài viết Sự kiện & Diễn đàn
            </button>
          </div>

          {/* Cấu hình tiêu đề & nội dung giới thiệu mục Sự kiện */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid var(--line)",
              marginBottom: "24px",
              display: "grid",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={18} color="#d42027" />
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                Nội dung phần đầu mục Sự Kiện (Tiêu đề & Giới thiệu)
              </strong>
            </div>

            <div className="field-row">
              <Field
                label="Dòng nhãn nhỏ (Eyebrow Badge)"
                value={content.eventsEyebrow || ""}
                onChange={(val) => update("eventsEyebrow", val)}
              />
              <Field
                label="Tiêu đề chính mục Sự Kiện"
                value={content.eventsTitle || ""}
                onChange={(val) => update("eventsTitle", val)}
              />
            </div>

            <Field
              label="Đoạn văn mô tả / giới thiệu"
              value={content.eventsDescription || ""}
              onChange={(val) => update("eventsDescription", val)}
              multiline
            />

            <div className="field-row">
              <Field
                label="Chữ trên nút xem tất cả"
                value={content.eventsViewAllText || ""}
                onChange={(val) => update("eventsViewAllText", val)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => save("Đã lưu tiêu đề & giới thiệu mục Sự Kiện thành công!")}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#d42027",
                  color: "#fff",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Save size={15} /> Lưu mục Sự Kiện
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                Hiện có {content.upcomingEvents.length} sự kiện
              </span>
              <button
                type="button"
                onClick={() => setAllEventsCollapse(true)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Thu gọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setAllEventsCollapse(false)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Mở rộng tất cả
              </button>
            </div>
            <button
              type="button"
              onClick={addEvent}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 800,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Thêm Sự kiện mới
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {content.upcomingEvents.map((event, index) => {
              const eventId = event.id || `event-${index}`;
              const isCollapsed = collapsedEvents[eventId] ?? true;

              return (
                <div
                  key={eventId}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    background: event.active !== false ? "#ffffff" : "#f8fafc",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    overflow: "hidden",
                  }}
                >
                  {/* Event Card Header */}
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#fafbfd",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapseEvent(eventId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#d42027",
                          background: "rgba(212,32,39,0.1)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        SỰ KIỆN #{index + 1}
                      </span>

                      {event.image && (
                        <img
                          src={event.image}
                          alt="Thumbnail"
                          style={{ width: "32px", height: "44px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--line)" }}
                        />
                      )}

                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {event.title}
                        </strong>
                        <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                          {event.date} • {event.location}
                        </small>
                      </div>

                      {event.active === false ? (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                          Đã ẩn
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                          Active
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveEvent(index, "up")}
                        title="Di chuyển lên"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={index === content.upcomingEvents.length - 1}
                        onClick={() => moveEvent(index, "down")}
                        title="Di chuyển xuống"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === content.upcomingEvents.length - 1 ? "not-allowed" : "pointer",
                          opacity: index === content.upcomingEvents.length - 1 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateEvent(index, "active", event.active === false)}
                        title={event.active === false ? "Bật hiển thị" : "Tắt (Ẩn)"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {event.active === false ? <EyeOff size={14} color="#64748b" /> : <Eye size={14} color="#166534" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCollapseEvent(eventId)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        {isCollapsed ? "Mở rộng" : "Thu gọn"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeEvent(index)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(220,38,38,0.1)",
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Event Expanded Form */}
                  {!isCollapsed && (
                    <div style={{ padding: "20px", display: "grid", gap: "14px" }}>
                      <div className="field-row">
                        <Field
                          label="Tiêu đề sự kiện"
                          value={event.title}
                          onChange={(val) => updateEvent(index, "title", val)}
                        />
                        <Field
                          label="Đường dẫn tĩnh (Slug URL - ví dụ: vietnam-korea-business-forum-2026)"
                          value={event.slug}
                          onChange={(val) => updateEvent(index, "slug", val)}
                        />
                      </div>

                      <div className="field-row">
                        <ImageUploadField
                          label="Ảnh Poster Sự Kiện (Tải từ máy tính hoặc dán URL)"
                          value={event.image}
                          onChange={(val) => updateEvent(index, "image", val)}
                          placeholder="Dán link ảnh (https://...) hoặc tải từ máy tính"
                        />
                        <Field
                          label="Tag chủ đề (Ví dụ: Diễn đàn Việt - Hàn, Gala Chào Xuân)"
                          value={event.tag}
                          onChange={(val) => updateEvent(index, "tag", val)}
                        />
                      </div>

                      <div className="field-row">
                        <Field
                          label="Thời gian (Ví dụ: 18/12/2026)"
                          value={event.date}
                          onChange={(val) => updateEvent(index, "date", val)}
                        />
                        <Field
                          label="Địa điểm (Ví dụ: Seoul, Hàn Quốc / Hà Nội)"
                          value={event.location}
                          onChange={(val) => updateEvent(index, "location", val)}
                        />
                      </div>

                      <div className="field-row">
                        <Field
                          label="Giờ tổ chức (Ví dụ: 08:30 - 17:30)"
                          value={event.time || ""}
                          onChange={(val) => updateEvent(index, "time", val)}
                        />
                        <Field
                          label="Hotline / Người phụ trách sự kiện"
                          value={event.contactPerson || "Hotline Ban Tổ Chức: 090 377 2086"}
                          onChange={(val) => updateEvent(index, "contactPerson", val)}
                        />
                      </div>

                      <div className="field-row">
                        <Field
                          label="Đơn vị tổ chức sự kiện"
                          value={event.organizer || ""}
                          onChange={(val) => updateEvent(index, "organizer", val)}
                        />
                        <Field
                          label="Đơn vị đồng hành sự kiện"
                          value={event.partner || ""}
                          onChange={(val) => updateEvent(index, "partner", val)}
                        />
                      </div>

                      <Field
                        label="Tóm tắt ngắn (Hiển thị trên Card ngoài trang chủ)"
                        value={event.summary}
                        onChange={(val) => updateEvent(index, "summary", val)}
                        multiline
                      />

                      <AdminRichEditor
                        label="Nội dung giới thiệu chi tiết sự kiện (Căn chỉnh lề, đề mục, trích dẫn, ảnh minh họa)"
                        value={event.description}
                        onChange={(val) => updateEvent(index, "description", val)}
                        rows={10}
                      />

                      <Field
                        label="Lịch trình chương trình (Mỗi dòng một mốc thời gian)"
                        value={(event.agenda || []).join("\n")}
                        onChange={(val) =>
                          updateEvent(
                            index,
                            "agenda",
                            val
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        multiline
                      />

                      <Field
                        label="Quyền lợi tham dự (Mỗi dòng một quyền lợi)"
                        value={(event.benefits || []).join("\n")}
                        onChange={(val) =>
                          updateEvent(
                            index,
                            "benefits",
                            val
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        multiline
                      />

                      {event.slug && (
                        <div>
                          <a
                            href={`/su-kien/${event.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "12px", color: "#d42027", fontWeight: 800, textDecoration: "underline" }}
                          >
                            Mở xem trang sự kiện này trên website ↗
                          </a>
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          onClick={() => toggleCollapseEvent(eventId)}
                          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}
                        >
                          Thu gọn lại
                        </button>
                        <button
                          type="button"
                          onClick={() => save(`Đã lưu sự kiện "${event.title}" thành công!`)}
                          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#d42027", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Save size={15} /> Lưu Sự kiện này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* ========================================================
            07. BÁO CHÍ NÓI VỀ CHÚNG TÔI
            ======================================================== */}
        <EditorSection
          id="bao-chi-admin"
          number="07"
          title="Báo Chí Nói Về Chúng Tôi"
          description="Quản lý danh sách các bài báo uy tín (CafeF, VnExpress, Tuổi Trẻ, Dân Trí...) đưa tin và trích dẫn về công ty."
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                Tổng số: {(content.press || []).length} bài báo
              </span>
              <button
                type="button"
                onClick={() => setAllPressCollapse(true)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Thu gọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setAllPressCollapse(false)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Mở rộng tất cả
              </button>
            </div>

            <button
              type="button"
              onClick={addPress}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 800,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Thêm Bài Báo Mới
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {(content.press || []).map((item, index) => {
              const pressId = item.id || `press-${index}`;
              const isCollapsed = collapsedPress[pressId] ?? true;

              return (
                <div
                  key={pressId}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    background: item.active !== false ? "#ffffff" : "#f8fafc",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#fafbfd",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapsePress(pressId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#d42027",
                          background: "rgba(212,32,39,0.1)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        BÁO CHÍ #{index + 1}
                      </span>

                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.newspaper} — {item.title}
                        </strong>
                        <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                          {item.date}
                        </small>
                      </div>

                      {item.active === false ? (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                          Đã ẩn
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                          Active
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => movePress(index, "up")}
                        title="Di chuyển lên"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={index === (content.press || []).length - 1}
                        onClick={() => movePress(index, "down")}
                        title="Di chuyển xuống"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === (content.press || []).length - 1 ? "not-allowed" : "pointer",
                          opacity: index === (content.press || []).length - 1 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updatePress(index, "active", item.active === false)}
                        title={item.active === false ? "Bật hiển thị" : "Tắt (Ẩn)"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {item.active === false ? <EyeOff size={14} color="#64748b" /> : <Eye size={14} color="#166534" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCollapsePress(pressId)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        {isCollapsed ? "Mở rộng" : "Thu gọn"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removePress(index)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(220,38,38,0.1)",
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div style={{ padding: "20px", display: "grid", gap: "14px" }}>
                      <div className="field-row">
                        <Field
                          label="Tên cơ quan báo chí (Ví dụ: VnExpress, Dân Trí, CafeF)"
                          value={item.newspaper}
                          onChange={(val) => updatePress(index, "newspaper", val)}
                        />
                        <Field
                          label="Thời gian đăng bài (Ví dụ: Tháng 10/2026 hoặc 17.10.2026)"
                          value={item.date}
                          onChange={(val) => updatePress(index, "date", val)}
                        />
                      </div>
                      <Field
                        label="Tiêu đề bài viết trên báo"
                        value={item.title}
                        onChange={(val) => updatePress(index, "title", val)}
                      />
                      <Field
                        label="Lời trích dẫn nhận xét (Quote nổi bật)"
                        value={item.quote}
                        onChange={(val) => updatePress(index, "quote", val)}
                        multiline
                      />
                      <Field
                        label="Đường dẫn đến bài báo (Link)"
                        value={item.link}
                        onChange={(val) => updatePress(index, "link", val)}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          onClick={() => toggleCollapsePress(pressId)}
                          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}
                        >
                          Thu gọn lại
                        </button>
                        <button
                          type="button"
                          onClick={() => save(`Đã lưu bài báo "${item.title}" thành công!`)}
                          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#d42027", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Save size={15} /> Lưu Bài báo này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* ========================================================
            08. THƯƠNG HIỆU & HỆ SINH THÁI
            ======================================================== */}
        <EditorSection
          id="thuong-hieu-admin"
          number="08"
          title="Thương Hiệu & Hệ Sinh Thái Đa Kênh"
          description="Quản lý các ấn phẩm tạp chí, nền tảng truyền thông trong hệ sinh thái Hải Dương Media."
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                Tổng số: {(content.brands || []).length} thương hiệu
              </span>
              <button
                type="button"
                onClick={() => setAllBrandCollapse(true)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Thu gọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setAllBrandCollapse(false)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Mở rộng tất cả
              </button>
            </div>

            <button
              type="button"
              onClick={addBrand}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 800,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Thêm Thương Hiệu Mới
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {(content.brands || []).map((brand, index) => {
              const brandId = brand.id || `brand-${index}`;
              const isCollapsed = collapsedBrands[brandId] ?? true;

              return (
                <div
                  key={brandId}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    background: brand.active !== false ? "#ffffff" : "#f8fafc",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#fafbfd",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapseBrand(brandId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#d42027",
                          background: "rgba(212,32,39,0.1)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        THƯƠNG HIỆU #{index + 1}
                      </span>

                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {brand.name}
                        </strong>
                        <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                          {brand.category} • {brand.url}
                        </small>
                      </div>

                      {brand.active === false ? (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                          Đã ẩn
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                          Active
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveBrand(index, "up")}
                        title="Di chuyển lên"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={index === (content.brands || []).length - 1}
                        onClick={() => moveBrand(index, "down")}
                        title="Di chuyển xuống"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === (content.brands || []).length - 1 ? "not-allowed" : "pointer",
                          opacity: index === (content.brands || []).length - 1 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateBrand(index, "active", brand.active === false)}
                        title={brand.active === false ? "Bật hiển thị" : "Tắt (Ẩn)"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {brand.active === false ? <EyeOff size={14} color="#64748b" /> : <Eye size={14} color="#166534" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCollapseBrand(brandId)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        {isCollapsed ? "Mở rộng" : "Thu gọn"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeBrand(index)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(220,38,38,0.1)",
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div style={{ padding: "20px", display: "grid", gap: "14px" }}>
                      <div className="field-row">
                        <Field
                          label="Tên thương hiệu / Ấn phẩm"
                          value={brand.name}
                          onChange={(val) => updateBrand(index, "name", val)}
                        />
                        <Field
                          label="Phân loại (Ví dụ: Tạp chí in, Cổng thông tin, Bảng xếp hạng)"
                          value={brand.category}
                          onChange={(val) => updateBrand(index, "category", val)}
                        />
                      </div>
                      <Field
                        label="Mô tả ấn phẩm / Thương hiệu"
                        value={brand.description}
                        onChange={(val) => updateBrand(index, "description", val)}
                        multiline
                      />
                      <Field
                        label="Đường dẫn website (URL)"
                        value={brand.url}
                        onChange={(val) => updateBrand(index, "url", val)}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          onClick={() => toggleCollapseBrand(brandId)}
                          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}
                        >
                          Thu gọn lại
                        </button>
                        <button
                          type="button"
                          onClick={() => save(`Đã lưu thương hiệu "${brand.name}" thành công!`)}
                          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#d42027", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Save size={15} /> Lưu Thương hiệu này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* ========================================================
            09. ĐÁNH GIÁ CỦA KHÁCH HÀNG & LỜI CHỨNG THỰC
            ======================================================== */}
        <EditorSection
          id="danh-gia-admin"
          number="09"
          title="Đánh Giá Của Khách Hàng (Lời Chứng Thực)"
          description="Quản lý đánh giá, nhận xét của các lãnh đạo doanh nghiệp, đối tác lớn về dịch vụ của công ty."
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                Tổng số: {(content.testimonials || []).length} đánh giá
              </span>
              <button
                type="button"
                onClick={() => setAllTestimonialCollapse(true)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Thu gọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setAllTestimonialCollapse(false)}
                style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Mở rộng tất cả
              </button>
            </div>

            <button
              type="button"
              onClick={addTestimonial}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 800,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Thêm Lời Đánh Giá Mới
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {(content.testimonials || []).map((testi, index) => {
              const testiId = testi.id || `testi-${index}`;
              const isCollapsed = collapsedTestimonials[testiId] ?? true;

              return (
                <div
                  key={testiId}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    background: testi.active !== false ? "#ffffff" : "#f8fafc",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "#fafbfd",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCollapseTestimonial(testiId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#d42027",
                          background: "rgba(212,32,39,0.1)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        ĐÁNH GIÁ #{index + 1}
                      </span>

                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {testi.name}
                        </strong>
                        <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                          {testi.title} • {testi.company}
                        </small>
                      </div>

                      {testi.active === false ? (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                          Đã ẩn
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                          Active
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveTestimonial(index, "up")}
                        title="Di chuyển lên"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={index === (content.testimonials || []).length - 1}
                        onClick={() => moveTestimonial(index, "down")}
                        title="Di chuyển xuống"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          cursor: index === (content.testimonials || []).length - 1 ? "not-allowed" : "pointer",
                          opacity: index === (content.testimonials || []).length - 1 ? 0.3 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateTestimonial(index, "active", testi.active === false)}
                        title={testi.active === false ? "Bật hiển thị" : "Tắt (Ẩn)"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {testi.active === false ? <EyeOff size={14} color="#64748b" /> : <Eye size={14} color="#166534" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCollapseTestimonial(testiId)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        {isCollapsed ? "Mở rộng" : "Thu gọn"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(220,38,38,0.1)",
                          color: "#dc2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div style={{ padding: "20px", display: "grid", gap: "14px" }}>
                      <div className="field-row">
                        <Field
                          label="Tên khách hàng / Chuyên gia (Ví dụ: Ông Hoàng Đức Huy)"
                          value={testi.name}
                          onChange={(val) => updateTestimonial(index, "name", val)}
                        />
                        <Field
                          label="Ký tự đại diện Avatar (Ví dụ: HĐH)"
                          value={testi.avatarText}
                          onChange={(val) => updateTestimonial(index, "avatarText", val)}
                        />
                      </div>
                      <div className="field-row">
                        <Field
                          label="Chức vụ"
                          value={testi.title}
                          onChange={(val) => updateTestimonial(index, "title", val)}
                        />
                        <Field
                          label="Công ty / Tổ chức"
                          value={testi.company}
                          onChange={(val) => updateTestimonial(index, "company", val)}
                        />
                      </div>
                      <Field
                        label="Nội dung lời nhận xét / Đánh giá (Quote)"
                        value={testi.quote}
                        onChange={(val) => updateTestimonial(index, "quote", val)}
                        multiline
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          onClick={() => toggleCollapseTestimonial(testiId)}
                          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}
                        >
                          Thu gọn lại
                        </button>
                        <button
                          type="button"
                          onClick={() => save(`Đã lưu đánh giá của "${testi.name}" thành công!`)}
                          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#d42027", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Save size={15} /> Lưu Đánh giá này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* ========================================================
            10. ĐỐI TÁC TRUYỀN THÔNG & KHÁCH HÀNG TIÊU BIỂU
            ======================================================== */}
        <EditorSection
          id="doi-tac-admin"
          number="10"
          title="Đối Tác Truyền Thông & Khách Hàng Tiêu Biểu"
          description="Quản lý và tải lên ảnh logo của các đài truyền hình, cơ quan báo chí đối tác và các thương hiệu, doanh nghiệp lớn đồng hành."
        >
          {/* PHẦN 1: ĐỐI TÁC TRUYỀN THÔNG */}
          <div style={{ marginBottom: "36px" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#0f172a", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Handshake size={20} color="#d42027" /> 1. Đối Tác Truyền Thông (Báo chí & Đài truyền hình)
                </h4>
                <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                  Hiện có {(content.partners || []).length} đối tác truyền thông
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setAllPartnerCollapse(true)}
                  style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                >
                  Thu gọn
                </button>
                <button
                  type="button"
                  onClick={() => setAllPartnerCollapse(false)}
                  style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                >
                  Mở rộng
                </button>
                <button
                  type="button"
                  onClick={addPartner}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "#0f172a",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Plus size={16} /> Thêm Đối Tác Mới
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              {(content.partners || []).map((partner, index) => {
                const partnerId = partner.id || `partner-${index}`;
                const isCollapsed = collapsedPartners[partnerId] ?? true;

                return (
                  <div
                    key={partnerId}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "14px",
                      background: partner.active !== false ? "#ffffff" : "#f8fafc",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#fafbfd",
                        borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleCollapsePartner(partnerId)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                        {partner.logo ? (
                          <div
                            style={{
                              width: "64px",
                              height: "42px",
                              borderRadius: "8px",
                              background: "#fff",
                              border: "1px solid var(--line)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "3px 6px",
                              overflow: "hidden",
                              flexShrink: 0,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            }}
                          >
                            <img src={partner.logo} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "64px",
                              height: "42px",
                              borderRadius: "8px",
                              background: "#f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#64748b",
                              flexShrink: 0,
                            }}
                          >
                            <Handshake size={18} />
                          </div>
                        )}

                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 900,
                            color: "#d42027",
                            background: "rgba(212,32,39,0.1)",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            flexShrink: 0,
                          }}
                        >
                          #{index + 1}
                        </span>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {partner.name || "Chưa đặt tên đối tác"}
                          </strong>
                        </div>

                        {partner.active === false ? (
                          <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                            Đã ẩn
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                            Active
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => movePartner(index, "up")}
                          title="Di chuyển lên"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            border: "1px solid var(--line)",
                            background: "#fff",
                            cursor: index === 0 ? "not-allowed" : "pointer",
                            opacity: index === 0 ? 0.3 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ArrowUp size={14} />
                        </button>

                        <button
                          type="button"
                          disabled={index === (content.partners || []).length - 1}
                          onClick={() => movePartner(index, "down")}
                          title="Di chuyển xuống"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            border: "1px solid var(--line)",
                            background: "#fff",
                            cursor: index === (content.partners || []).length - 1 ? "not-allowed" : "pointer",
                            opacity: index === (content.partners || []).length - 1 ? 0.3 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ArrowDown size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => updatePartner(index, "active", partner.active === false)}
                          title={partner.active === false ? "Bật hiển thị" : "Tắt (Ẩn)"}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--line)",
                            background: partner.active !== false ? "#edfff4" : "#f1f5f9",
                            color: partner.active !== false ? "#166534" : "#64748b",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {partner.active !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => removePartner(index)}
                          title="Xóa đối tác"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            border: "1px solid #fee2e2",
                            background: "#fff5f5",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleCollapsePartner(partnerId)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            border: "1px solid var(--line)",
                            background: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div style={{ padding: "16px 20px", display: "grid", gap: "14px" }}>
                        <ImageUploadField
                          label="Upload ảnh Logo Đối Tác (Chọn ảnh từ máy hoặc dán link URL)"
                          value={partner.logo || ""}
                          onChange={(val) => updatePartner(index, "logo", val)}
                          placeholder="Chọn file logo từ máy tính (PNG, JPG, SVG, WebP) hoặc dán link URL..."
                        />

                        <div className="field-row">
                          <Field
                            label="Tên Đối Tác Truyền Thông (ví dụ: Đài Truyền hình Việt Nam (VTV))"
                            value={partner.name || ""}
                            onChange={(val) => updatePartner(index, "name", val)}
                          />
                          <Field
                            label="Đường dẫn liên kết (Link website nếu có, ví dụ: https://vtv.vn)"
                            value={partner.url || ""}
                            onChange={(val) => updatePartner(index, "url", val)}
                          />
                        </div>

                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "#334155", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={partner.active !== false}
                            onChange={(e) => updatePartner(index, "active", e.target.checked)}
                            style={{ width: "16px", height: "16px", accentColor: "#d42027" }}
                          />
                          Hiển thị đối tác này trên trang chủ (Active)
                        </label>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px", borderTop: "1px solid var(--line)", paddingTop: "10px" }}>
                          <button
                            type="button"
                            onClick={() => save("Đã lưu thông tin đối tác thành công.")}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 14px",
                              borderRadius: "8px",
                              background: "#d42027",
                              color: "#fff",
                              border: "none",
                              fontWeight: 800,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            <Save size={14} /> Lưu thay đổi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PHẦN 2: KHÁCH HÀNG & THƯƠNG HIỆU TIÊU BIỂU */}
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#0f172a", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Building2 size={20} color="#d42027" /> 2. Khách Hàng & Thương Hiệu Tiêu Biểu Đồng Hành
                </h4>
                <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700 }}>
                  Hiện có {(content.clients || []).length} thương hiệu / khách hàng
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setAllClientCollapse(true)}
                  style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                >
                  Thu gọn
                </button>
                <button
                  type="button"
                  onClick={() => setAllClientCollapse(false)}
                  style={{ padding: "4px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                >
                  Mở rộng
                </button>
                <button
                  type="button"
                  onClick={addClient}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "#d42027",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Plus size={16} /> Thêm Thương Hiệu Mới
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              {(content.clients || []).map((client, index) => {
                const clientId = client.id || `client-${index}`;
                const isCollapsed = collapsedClients[clientId] ?? true;

                return (
                  <div
                    key={clientId}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "14px",
                      background: client.active !== false ? "#ffffff" : "#f8fafc",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#fafbfd",
                        borderBottom: isCollapsed ? "none" : "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleCollapseClient(clientId)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                        {client.logo ? (
                          <div
                            style={{
                              width: "64px",
                              height: "42px",
                              borderRadius: "8px",
                              background: "#fff",
                              border: "1px solid var(--line)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "3px 6px",
                              overflow: "hidden",
                              flexShrink: 0,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            }}
                          >
                            <img src={client.logo} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "64px",
                              height: "42px",
                              borderRadius: "8px",
                              background: "rgba(212,32,39,0.08)",
                              color: "#d42027",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 900,
                              fontSize: "14px",
                              flexShrink: 0,
                            }}
                          >
                            {(client.name || "C").charAt(0)}
                          </div>
                        )}

                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 900,
                            color: "#d42027",
                            background: "rgba(212,32,39,0.1)",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            flexShrink: 0,
                          }}
                        >
                          #{index + 1}
                        </span>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {client.name || "Chưa đặt tên thương hiệu"}
                          </strong>
                        </div>

                        {client.active === false ? (
                          <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 700 }}>
                            Đã ẩn
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: "#edfff4", color: "#166534", fontWeight: 700 }}>
                            Active
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveClient(index, "up")}
                          title="Di chuyển lên"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            border: "1px solid var(--line)",
                            background: "#fff",
                            cursor: index === 0 ? "not-allowed" : "pointer",
                            opacity: index === 0 ? 0.3 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ArrowUp size={14} />
                        </button>

                        <button
                          type="button"
                          disabled={index === (content.clients || []).length - 1}
                          onClick={() => moveClient(index, "down")}
                          title="Di chuyển xuống"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            border: "1px solid var(--line)",
                            background: "#fff",
                            cursor: index === (content.clients || []).length - 1 ? "not-allowed" : "pointer",
                            opacity: index === (content.clients || []).length - 1 ? 0.3 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ArrowDown size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => updateClient(index, "active", client.active === false)}
                          title={client.active === false ? "Bật hiển thị" : "Tắt (Ẩn)"}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--line)",
                            background: client.active !== false ? "#edfff4" : "#f1f5f9",
                            color: client.active !== false ? "#166534" : "#64748b",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {client.active !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeClient(index)}
                          title="Xóa thương hiệu"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            border: "1px solid #fee2e2",
                            background: "#fff5f5",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleCollapseClient(clientId)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            border: "1px solid var(--line)",
                            background: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div style={{ padding: "16px 20px", display: "grid", gap: "14px" }}>
                        <ImageUploadField
                          label="Upload ảnh Logo Thương Hiệu / Doanh Nghiệp (Chọn ảnh từ máy hoặc dán link URL)"
                          value={client.logo || ""}
                          onChange={(val) => updateClient(index, "logo", val)}
                          placeholder="Chọn file logo từ máy tính (PNG, JPG, SVG, WebP) hoặc dán link URL..."
                        />

                        <div className="field-row">
                          <Field
                            label="Tên Thương Hiệu / Khách Hàng (ví dụ: Tập đoàn Hoa Sen, CMC Telecom)"
                            value={client.name || ""}
                            onChange={(val) => updateClient(index, "name", val)}
                          />
                          <Field
                            label="Đường dẫn liên kết (Link website nếu có, ví dụ: https://hoasengroup.vn)"
                            value={client.url || ""}
                            onChange={(val) => updateClient(index, "url", val)}
                          />
                        </div>

                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "#334155", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={client.active !== false}
                            onChange={(e) => updateClient(index, "active", e.target.checked)}
                            style={{ width: "16px", height: "16px", accentColor: "#d42027" }}
                          />
                          Hiển thị thương hiệu này trên trang chủ (Active)
                        </label>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px", borderTop: "1px solid var(--line)", paddingTop: "10px" }}>
                          <button
                            type="button"
                            onClick={() => save("Đã lưu thông tin đối tác thành công.")}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 14px",
                              borderRadius: "8px",
                              background: "#d42027",
                              color: "#fff",
                              border: "none",
                              fontWeight: 800,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            <Save size={14} /> Lưu thay đổi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </EditorSection>

        {/* ========================================================
            11. QUY TRÌNH 4 BƯỚC & KÊU GỌI CTA
            ======================================================== */}
        <EditorSection
          id="quy-trinh-cta-admin"
          number="11"
          title="Quy Trình 4 Bước & Khối Kêu Gọi Hợp Tác (CTA)"
          description="Tùy chỉnh tiêu đề, nội dung 4 bước quy trình triển khai và khối kêu gọi hành động ở cuối trang chủ."
        >
          <div className="field-row">
            <Field
              label="Dòng nhấn Quy trình (Eyebrow)"
              value={content.processEyebrow || "QUY TRÌNH CHUẨN MỰC"}
              onChange={(val) => update("processEyebrow", val)}
            />
            <Field
              label="Tiêu đề khối Quy trình"
              value={content.processTitle || "Đơn Giản, Minh Bạch & Đúng Tiến Độ Phát Sóng"}
              onChange={(val) => update("processTitle", val)}
            />
          </div>

          <div style={{ display: "grid", gap: "12px", margin: "10px 0 20px" }}>
            <strong style={{ fontSize: "14px", color: "#0f172a" }}>Chi tiết 4 bước quy trình:</strong>
            {(content.processSteps || []).map((step, index) => (
              <div
                key={index}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid var(--line)",
                  background: "#fafbfd",
                  display: "grid",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#d42027" }}>
                  BƯỚC {index + 1}
                </span>
                <Field
                  label="Tiêu đề bước"
                  value={step.title}
                  onChange={(val) => updateProcessStep(index, "title", val)}
                />
                <Field
                  label="Mô tả chi tiết bước"
                  value={step.desc}
                  onChange={(val) => updateProcessStep(index, "desc", val)}
                  multiline
                />
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "18px", marginTop: "18px", display: "grid", gap: "12px" }}>
            <strong style={{ fontSize: "14px", color: "#0f172a" }}>Khối kêu gọi hợp tác (CTA Banner):</strong>
            <div className="field-row">
              <Field
                label="Dòng nhấn CTA (Eyebrow)"
                value={content.ctaEyebrow || "BẮT ĐẦU CHIẾN DỊCH TRUYỀN THÔNG MỚI"}
                onChange={(val) => update("ctaEyebrow", val)}
              />
              <Field
                label="Chữ trên nút bấm CTA"
                value={content.ctaButtonText || "Liên hệ tư vấn ngay"}
                onChange={(val) => update("ctaButtonText", val)}
              />
            </div>
            <div className="field-row">
              <Field
                label="Tiêu đề kêu gọi CTA"
                value={content.ctaTitle || "Đưa thương hiệu của bạn tỏa sáng trên sóng truyền hình quốc gia và báo chí hàng đầu."}
                onChange={(val) => update("ctaTitle", val)}
                multiline
              />
              <Field
                label="Đường dẫn nút bấm CTA"
                value={content.ctaButtonHref || "/lien-he"}
                onChange={(val) => update("ctaButtonHref", val)}
              />
            </div>
          </div>
        </EditorSection>

        {/* ========================================================
            12. THÔNG TIN THƯƠNG HIỆU
            ======================================================== */}
        <EditorSection
          id="thuong-hieu"
          number="01"
          title="Thông tin thương hiệu"
          description="Tên và câu mô tả ngắn hiển thị tại đầu và chân trang."
        >
          <Field
            label="Tên thương hiệu"
            value={content.brandName}
            onChange={(value) => update("brandName", value)}
          />
          <Field
            label="Dòng giới thiệu (Slogan)"
            value={content.brandKicker}
            onChange={(value) => update("brandKicker", value)}
          />
          <Field
            label="Ghi chú chân trang (Footer note)"
            value={content.footerNote}
            onChange={(value) => update("footerNote", value)}
            multiline
          />
        </EditorSection>

        {/* ========================================================
            SEO & THẺ CHIA SẺ LINK (ZALO, FACEBOOK, GOOGLE)
            ======================================================== */}
        <EditorSection
          id="seo-chia-se"
          number="02"
          title="Cấu hình SEO & Thẻ Chia sẻ Link (Zalo, Facebook, Google)"
          description="Chỉnh sửa tiêu đề, đoạn mô tả ngắn và hình ảnh thu nhỏ hiển thị khi gửi link website qua Zalo, Messenger, Facebook hoặc tìm kiếm Google."
        >
          <Field
            label="Tiêu đề hiển thị khi chia sẻ link (Meta / OG Title)"
            value={content.seoTitle || "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu"}
            onChange={(value) => update("seoTitle", value)}
            placeholder="Ví dụ: THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu"
          />

          <Field
            label="Mô tả ngắn khi chia sẻ link trên Zalo / Facebook / Google (Meta / OG Description)"
            value={
              content.seoDescription ||
              "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn) - Tư vấn chiến lược truyền thông, sản xuất TVC phát sóng VTV và kết nối doanh nghiệp với báo chí hàng đầu."
            }
            onChange={(value) => update("seoDescription", value)}
            multiline
            placeholder="Nhập đoạn giới thiệu ngắn hiển thị bên dưới tiêu đề khi gửi link..."
          />

          <ImageUploadField
            label="Ảnh thu nhỏ khi chia sẻ link (Thumbnail / OG Image)"
            value={content.seoImage || "/images/logo.png"}
            onChange={(value) => update("seoImage", value)}
            placeholder="Chọn ảnh từ máy tính hoặc dán link ảnh (mặc định: /images/logo.png)"
          />

          <Field
            label="Từ khóa SEO (Keywords - cách nhau bằng dấu phẩy)"
            value={
              content.seoKeywords ||
              "thuonghieuhangdauvn, thương hiệu hàng đầu việt nam, thương hiệu hàng đầu vn, truyền thông thương hiệu, sản xuất tvc vtv, booking báo chí pr, vinh danh thương hiệu"
            }
            onChange={(value) => update("seoKeywords", value)}
          />
          <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: "#475569" }}>
            Lưu ý: Mục này chỉ khai báo thẻ meta keywords. Google không sử dụng thẻ này
            để xếp hạng hoặc lập chỉ mục; nhập thêm từ khóa không giúp website tăng hạng.
            Hãy ưu tiên tiêu đề, mô tả và nội dung hữu ích của từng trang.
          </p>

          {/* Bản xem trước trực tiếp (Zalo / Facebook Link Preview) */}
          <div style={{ marginTop: "12px" }}>
            <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Xem trước hiển thị khi gửi link trên Zalo / Facebook:
            </span>
            <div
              style={{
                maxWidth: "420px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #cbd5e1",
                background: "#e9f2fd",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              <div style={{ width: "100%", height: "210px", background: "#fff", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={content.seoImage || "/images/logo.png"}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  HD
                </span>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {content.seoTitle || "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM | Truyền thông & Thương hiệu"}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#475569",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    marginBottom: "6px",
                  }}
                >
                  {content.seoDescription ||
                    "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn) - Tư vấn chiến lược truyền thông, sản xuất TVC phát sóng VTV và kết nối doanh nghiệp với báo chí hàng đầu."}
                </div>
                <div style={{ fontSize: "12px", color: "#2563eb" }}>thuonghieuhangdauvn.com</div>
              </div>
            </div>
          </div>
        </EditorSection>

        {/* ========================================================
            13. TIÊU ĐỀ & GIỚI THIỆU CHUNG
            ======================================================== */}
        <EditorSection
          id="trang-chu"
          number="13"
          title="Nội dung giới thiệu công ty"
          description="Khu vực tiêu đề, nút bấm CTA và phần giới thiệu công ty."
        >
          <Field
            label="Dòng nhấn đầu trang (Eyebrow)"
            value={content.heroEyebrow}
            onChange={(value) => update("heroEyebrow", value)}
          />
          <Field
            label="Tiêu đề chính"
            value={content.heroTitle}
            onChange={(value) => update("heroTitle", value)}
            multiline
          />
          <Field
            label="Mô tả chính"
            value={content.heroDescription}
            onChange={(value) => update("heroDescription", value)}
            multiline
          />
          <div className="field-row">
            <Field
              label="Nút chính (Primary CTA)"
              value={content.primaryCta}
              onChange={(value) => update("primaryCta", value)}
            />
            <Field
              label="Nút phụ (Secondary CTA)"
              value={content.secondaryCta}
              onChange={(value) => update("secondaryCta", value)}
            />
          </div>
          <div className="field-row">
            <Field
              label="Tiêu đề phần Giới thiệu"
              value={content.aboutTitle}
              onChange={(value) => update("aboutTitle", value)}
            />
            <Field
              label="Tiêu đề phần Cam kết niềm tin"
              value={content.trustTitle}
              onChange={(value) => update("trustTitle", value)}
            />
          </div>
          <Field
            label="Nội dung giới thiệu chi tiết"
            value={content.aboutBody}
            onChange={(value) => update("aboutBody", value)}
            multiline
          />
          <Field
            label="Nội dung cam kết niềm tin"
            value={content.trustBody}
            onChange={(value) => update("trustBody", value)}
            multiline
          />
        </EditorSection>

        {/* ========================================================
            14. DỊCH VỤ CHỦ LỰC
            ======================================================== */}
        <EditorSection
          id="dich-vu"
          number="14"
          title="Danh sách dịch vụ & Sản phẩm"
          description="Sáu dịch vụ chính hiển thị trên website."
        >
          <div className="repeat-grid">
            {content.services.map((item, index) => (
              <div className="repeat-card" key={index}>
                <span>Dịch vụ 0{index + 1}</span>
                <Field
                  label="Tên dịch vụ"
                  value={item.title}
                  onChange={(value) => updateService(index, "title", value)}
                />
                <Field
                  label="Mô tả"
                  value={item.description}
                  onChange={(value) => updateService(index, "description", value)}
                  multiline
                />
              </div>
            ))}
          </div>
        </EditorSection>

        {/* ========================================================
            15. THÔNG TIN LIÊN HỆ
            ======================================================== */}
        <EditorSection
          id="lien-he"
          number="15"
          title="Thông tin liên hệ"
          description="Các số điện thoại, email, địa chỉ và đường link mạng xã hội."
        >
          <div className="field-row">
            <Field
              label="Hotline hiển thị"
              value={content.hotline}
              onChange={(value) => update("hotline", value)}
            />
            <Field
              label="Số gọi dạng +84 (Hotline Href)"
              value={content.hotlineHref}
              onChange={(value) => update("hotlineHref", value)}
            />
          </div>
          <Field
            label="Email"
            value={content.email}
            onChange={(value) => update("email", value)}
          />
          <Field
            label="Địa chỉ trụ sở & chi nhánh"
            value={content.address}
            onChange={(value) => update("address", value)}
            multiline
          />
          <div className="field-row">
            <Field
              label="Đường dẫn Zalo"
              value={content.zaloUrl}
              onChange={(value) => update("zaloUrl", value)}
            />
            <Field
              label="Đường dẫn Fanpage"
              value={content.facebookUrl}
              onChange={(value) => update("facebookUrl", value)}
            />
          </div>
          <Field
            label="Đường dẫn Google Maps"
            value={content.mapUrl}
            onChange={(value) => update("mapUrl", value)}
          />
        </EditorSection>

              </div>
            )}

            {/* Footer Navigation: Mục Trước / Mục Tiếp Theo */}
            {(prevScreenMeta || nextScreenMeta) && (
              <div
                className="admin-screen-footer-v2"
                style={{
                  marginTop: "auto",
                  paddingTop: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  maxWidth: "1100px",
                  width: "100%",
                  margin: "auto auto 0",
                }}
              >
                {prevScreenMeta ? (
                  <button
                    type="button"
                    onClick={() => handleSelectScreen(prevScreenMeta.id, prevScreenMeta.groupLabel, prevScreenMeta.itemLabel)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      color: "#334155",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <ArrowLeft size={16} /> Mục trước: {prevScreenMeta.itemLabel}
                  </button>
                ) : <div />}

                {nextScreenMeta ? (
                  <button
                    type="button"
                    onClick={() => handleSelectScreen(nextScreenMeta.id, nextScreenMeta.groupLabel, nextScreenMeta.itemLabel)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      background: "#0f172a",
                      border: "1px solid #0f172a",
                      color: "#ffffff",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      marginLeft: "auto",
                      boxShadow: "0 2px 6px rgba(15,23,42,0.25)",
                    }}
                  >
                    Mục tiếp theo: {nextScreenMeta.itemLabel} <ArrowRight size={16} />
                  </button>
                ) : <div />}
              </div>
            )}
          </div>
        </main>
      </div>
    </ActiveScreenContext.Provider>
  );
}

function EditorSection({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { activeScreenId } = React.useContext(ActiveScreenContext);
  // Nếu activeScreenId được đặt và không khớp với id của section này thì không render (Single-Screen View)
  if (activeScreenId && activeScreenId !== id) {
    return null;
  }

  return (
    <section
      id={id}
      className="editor-section admin-screen-card-v2"
      style={{
        maxWidth: "1100px",
        width: "100%",
        margin: "0 auto 24px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "32px 36px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
      }}
    >
      <div
        className="editor-heading"
        style={{
          marginBottom: "24px",
          paddingBottom: "20px",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <span>{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="editor-fields">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}
