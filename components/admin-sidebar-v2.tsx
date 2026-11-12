"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  X,
  Layers,
  BookOpen,
  Sliders,
  Users,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  Award,
  ShieldCheck,
  Share2,
  FileText,
  SlidersHorizontal,
  Image as ImageIcon,
  Tv,
  Calendar,
  Sparkles,
  Newspaper,
  Quote,
  Building2,
  CheckCircle2,
} from "lucide-react";

export interface NavSubItem {
  id: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  icon?: any;
}

export interface NavParentItem {
  id: string;
  label: string;
  icon: any;
  subItems?: NavSubItem[];
  badge?: string;
  badgeColor?: string;
}

interface AdminSidebarV2Props {
  activeScreenId: string;
  onSelectScreen: (screenId: string, parentLabel: string, itemLabel: string) => void;
  currentUser?: {
    username?: string;
    fullName?: string;
    role?: string;
  } | null;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebarV2({
  activeScreenId,
  onSelectScreen,
  currentUser,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarV2Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "trang-chu": false,
    "menu-trang": true,
    "cau-hinh": false,
  });

  // Load collapse state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      try {
        localStorage.setItem("admin_sidebar_collapsed", "false");
      } catch {}
    }
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Danh mục menu phân tầng đầy đủ
  const menuStructure: NavParentItem[] = [
    {
      id: "trang-chu",
      label: "Trang Chủ",
      icon: Home,
      subItems: [
        { id: "homepage-sections", label: "01. Bật/Tắt & Thứ tự khối" },
        { id: "banner-slider", label: "02. Banner Slider" },
        { id: "vtv-commercials-admin", label: "03. Phim/TVC Trên VTV" },
        { id: "su-kien-admin", label: "04. Sự Kiện Sắp Diễn Ra" },
        { id: "trang-chu", label: "05. Giới Thiệu & Niềm Tin" },
        { id: "dich-vu", label: "06. Dịch Vụ Chủ Lực" },
        { id: "bao-chi-admin", label: "07. Báo Chí Đưa Tin" },
        { id: "thuong-hieu-admin", label: "08. Hệ Sinh Thái Đa Kênh" },
        { id: "danh-gia-admin", label: "09. Đánh Giá Khách Hàng" },
        { id: "doi-tac-admin", label: "10. Đối Tác Doanh Nghiệp" },
        { id: "quy-trinh-cta-admin", label: "11. Quy Trình & Kêu Gọi Hợp Tác" },
      ],
    },
    {
      id: "menu-trang",
      label: "Trang Menu",
      icon: Layers,
      subItems: [
        { id: "menu-gioi-thieu", label: "01. Trang Giới thiệu" },
        { id: "menu-tin-tuc", label: "02. Trang Hoạt động & Sự kiện" },
        { id: "menu-doanh-nghiep", label: "03. Trang Doanh nghiệp" },
        { id: "menu-doanh-nhan", label: "04. Trang Doanh nhân" },
        { id: "menu-san-pham", label: "05. Trang Sản phẩm" },
        { id: "menu-iso", label: "06. Tư Vấn ISO", badge: "Mới", badgeColor: "#10b981" },
        { id: "menu-nhan-hieu", label: "07. Đăng Ký Nhãn Hiệu" },
        { id: "menu-shtt", label: "08. Sở Hữu Trí Tuệ" },
        { id: "menu-fb", label: "09. Dịch Vụ Facebook", badge: "HOT", badgeColor: "#1877f2" },
      ],
    },
    {
      id: "bai-viet",
      label: "Quản Lý Bài Viết",
      icon: BookOpen,
      badge: "Doanh nghiệp & Sự kiện",
      badgeColor: "rgba(212,32,39,0.2)",
    },
    {
      id: "cau-hinh",
      label: "Cấu Hình Chung",
      icon: Sliders,
      subItems: [
        { id: "thuong-hieu", label: "01. Thông Tin Thương Hiệu" },
        { id: "seo-chia-se", label: "02. SEO & Thẻ Chia Sẻ Link" },
        { id: "lien-he", label: "03. Thông Tin Liên Hệ" },
      ],
    },
    {
      id: "tai-khoan",
      label: "Tài Khoản Quản Trị",
      icon: Users,
      badge: "Bảo mật",
      badgeColor: "#0f172a",
    },
  ];

  return (
    <aside
      className={`admin-sidebar-v2 ${isCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      style={{
        width: isCollapsed ? "72px" : "268px",
        height: "100vh",
        backgroundColor: "#0f172a",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "width 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        userSelect: "none",
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #1e293b",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #d42027 0%, #b91c1c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "16px",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(212, 32, 39, 0.35)",
            }}
          >
            HD
          </div>
          {!isCollapsed && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>
                HẢI DƯƠNG MEDIA
              </span>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Hệ thống CMS Quản Trị</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {onCloseMobile && (
            <button
              type="button"
              className="admin-sidebar-mobile-close-btn"
              onClick={onCloseMobile}
              title="Đóng Menu"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                color: "#cbd5e1",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          )}

          <button
            type="button"
            className="admin-sidebar-toggle-desktop"
            onClick={toggleSidebar}
            title={isCollapsed ? "Mở rộng Menu" : "Thu gọn Menu"}
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#94a3b8",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        </div>
      </div>

      {/* Sidebar Menu Scroll */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "14px 10px",
          scrollbarWidth: "thin",
          scrollbarColor: "#334155 transparent",
        }}
      >
        {menuStructure.map((group) => {
          const GroupIcon = group.icon;
          const hasSub = group.subItems && group.subItems.length > 0;
          const isOpen = openGroups[group.id];

          // Check if any sub-item is active
          const isChildActive = hasSub
            ? group.subItems?.some((sub) => sub.id === activeScreenId)
            : activeScreenId === group.id;

          return (
            <div key={group.id} style={{ position: "relative", marginBottom: "4px" }}>
              {/* Parent Nav Link */}
              <div
                onClick={() => {
                  if (hasSub) {
                    toggleGroup(group.id);
                  } else {
                    onSelectScreen(group.id, group.label, group.label);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  color: isChildActive ? "#fff" : "#94a3b8",
                  backgroundColor: !hasSub && isChildActive
                    ? "#2563eb"
                    : isChildActive
                    ? "rgba(255, 255, 255, 0.07)"
                    : "transparent",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
                className="nav-parent-btn"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden", whiteSpace: "nowrap" }}>
                  <span style={{ color: isChildActive ? "#fff" : "#94a3b8", display: "flex", flexShrink: 0 }}>
                    <GroupIcon size={18} />
                  </span>
                  {!isCollapsed && (
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {group.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && hasSub && (
                  <ChevronRight
                    size={15}
                    style={{
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.22s ease",
                      opacity: 0.7,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>

              {/* Accordion Submenu (When Expanded) */}
              {!isCollapsed && hasSub && (
                <div
                  style={{
                    maxHeight: isOpen ? "800px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    paddingLeft: "20px",
                    marginTop: "2px",
                  }}
                >
                  {group.subItems?.map((sub) => {
                    const isActive = activeScreenId === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => onSelectScreen(sub.id, group.label, sub.label)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          color: isActive ? "#60a5fa" : "#94a3b8",
                          backgroundColor: isActive ? "rgba(37, 99, 235, 0.2)" : "transparent",
                          borderLeft: isActive ? "2px solid #3b82f6" : "2px solid transparent",
                          fontSize: "13px",
                          fontWeight: isActive ? 700 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          marginBottom: "2px",
                        }}
                        className="submenu-link-item"
                      >
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {sub.label}
                        </span>
                        {sub.badge && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: "6px",
                              backgroundColor: sub.badgeColor || "rgba(255,255,255,0.1)",
                              color: "#fff",
                              marginLeft: "auto",
                            }}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Flyout Menu (When Collapsed) */}
              {isCollapsed && hasSub && (
                <div className="sidebar-flyout-menu">
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#f87171", textTransform: "uppercase", padding: "6px 10px 4px", borderBottom: "1px solid #334155", marginBottom: "6px" }}>
                    {group.label}
                  </div>
                  {group.subItems?.map((sub) => {
                    const isActive = activeScreenId === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => onSelectScreen(sub.id, group.label, sub.label)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          fontSize: "12.5px",
                          color: isActive ? "#60a5fa" : "#94a3b8",
                          background: isActive ? "rgba(37, 99, 235, 0.25)" : "transparent",
                          cursor: "pointer",
                          marginBottom: "2px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sub.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer (User info & Quick links) */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden", whiteSpace: "nowrap" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "13px",
              flexShrink: 0,
            }}
          >
            {currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : "AD"}
          </div>
          {!isCollapsed && (
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentUser?.fullName || currentUser?.username || "Ban Biên Tập"}
              </span>
              <span style={{ fontSize: "11px", color: "#38bdf8" }}>
                {currentUser?.role === "super_admin" ? "Quản trị tối cao" : "Quản trị viên"}
              </span>
            </div>
          )}
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          title="Xem trang chủ website ngoài"
          style={{ color: "#64748b", textDecoration: "none", display: "flex", flexShrink: 0 }}
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </aside>
  );
}

