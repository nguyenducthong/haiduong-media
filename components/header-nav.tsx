"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "@/components/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export type NavSubItem = {
  label: string;
  href: string;
  badge?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavSubItem[];
};

interface HeaderNavProps {
  links: readonly NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export function HeaderNav({
  links,
  className = "desktop-nav",
  onItemClick,
}: HeaderNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPath = mounted
    ? pathname || (typeof window !== "undefined" ? window.location.pathname : "/")
    : "/";

  return (
    <nav className={className} aria-label="Điều hướng chính" ref={dropdownRef}>
      {links.map((item) => {
        const hasChildren = Boolean(item.children && item.children.length > 0);
        const isChildActive = hasChildren && item.children!.some(
          (c) => currentPath === c.href || (c.href !== "/" && currentPath.startsWith(`${c.href}/`))
        );
        const isSelfActive =
          item.href === "/"
            ? currentPath === "/"
            : currentPath === item.href || currentPath.startsWith(`${item.href}/`);
        const isActive = isSelfActive || isChildActive;
        const isOpen = openDropdown === item.label;

        if (hasChildren) {
          return (
            <div
              key={item.label}
              className={`nav-dropdown-wrapper ${isActive ? "active" : ""} ${isOpen ? "open" : ""}`}
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`nav-link nav-dropdown-trigger ${isActive ? "active" : ""}`}
                onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                aria-expanded={isOpen}
              >
                <span>{item.label}</span>
                <ChevronDown
                  size={14}
                  className={`nav-chevron ${isOpen ? "rotate" : ""}`}
                  style={{ transition: "transform 0.2s ease" }}
                />
                {isActive && <span className="active-indicator" />}
              </button>

              <div className={`nav-dropdown-menu ${isOpen ? "show" : ""}`}>
                <div className="nav-dropdown-arrow" />
                {item.children!.map((child) => {
                  const isChildItemActive =
                    currentPath === child.href ||
                    (child.href !== "/" && currentPath.startsWith(`${child.href}/`));

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`nav-dropdown-item ${isChildItemActive ? "active" : ""}`}
                      onClick={() => {
                        setOpenDropdown(null);
                        onItemClick?.();
                      }}
                    >
                      <span className="nav-dropdown-item-title">{child.label}</span>
                      {child.badge && (
                        <span className="nav-dropdown-badge">{child.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${isActive ? "active" : ""}`}
            onClick={onItemClick}
          >
            <span>{item.label}</span>
            {isActive && <span className="active-indicator" />}
          </Link>
        );
      })}
    </nav>
  );
}
