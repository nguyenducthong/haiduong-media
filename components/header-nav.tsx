"use client";

import React, { useEffect, useState } from "react";
import Link from "@/components/link";
import { usePathname } from "next/navigation";

interface HeaderNavProps {
  links: readonly (readonly [string, string])[];
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPath = mounted ? pathname || (typeof window !== "undefined" ? window.location.pathname : "/") : "/";

  return (
    <nav className={className} aria-label="Điều hướng chính">
      {links.map(([label, href]) => {
        const isActive =
          href === "/"
            ? currentPath === "/"
            : currentPath === href || currentPath.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={`nav-link ${isActive ? "active" : ""}`}
            onClick={onItemClick}
          >
            <span>{label}</span>
            {isActive && <span className="active-indicator" />}
          </Link>
        );
      })}
    </nav>
  );
}
