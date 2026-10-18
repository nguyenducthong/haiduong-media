"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCounterProps {
  slug: string;
  initialViews?: string | number;
  className?: string;
  iconSize?: number;
}

export function ViewCounter({ slug, initialViews, className, iconSize = 14 }: ViewCounterProps) {
  const [views, setViews] = useState<string>(
    initialViews !== undefined && initialViews !== null && initialViews !== ""
      ? String(initialViews)
      : "1"
  );

  useEffect(() => {
    if (!slug) return;
    const storageKey = `art_viewed_${slug}`;
    const alreadyViewed = sessionStorage.getItem(storageKey);

    if (!alreadyViewed) {
      sessionStorage.setItem(storageKey, "1");
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.views) {
            setViews(data.views);
          }
        })
        .catch((err) => {
          console.error("View increment error:", err);
        });
    }
  }, [slug]);

  return (
    <span className={className || "inline-flex items-center gap-1.5 text-xs text-gray-500"}>
      <Eye size={iconSize} />
      <span>{views} lượt xem</span>
    </span>
  );
}
