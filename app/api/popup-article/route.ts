import { NextRequest, NextResponse } from "next/server";
import { getPopupArticle, getArticleViewUrl } from "@/lib/enterprises";
import { createHash } from "node:crypto";

export async function GET(request: NextRequest) {
  try {
    const forceFresh =
      request.nextUrl.searchParams.has("fresh") ||
      request.nextUrl.searchParams.has("t");

    const article = await getPopupArticle(forceFresh);

    const payload = {
      success: true,
      article: article
        ? {
            id: article.id,
            slug: article.slug,
            title: article.title,
            image: article.image || "/images/news-placeholder.jpg",
            excerpt: article.excerpt || "",
            category: article.category || "",
            url: getArticleViewUrl(article),
          }
        : null,
    };

    const payloadStr = JSON.stringify(payload);
    const hash = createHash("md5").update(payloadStr).digest("hex").slice(0, 16);
    const etag = `"popup_${hash}"`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "ETag": etag,
      "Vary": "Accept-Encoding",
    };

    if (forceFresh) {
      headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
    } else {
      // Cache at browser & edge for 60s, stale-while-revalidate for 5 minutes
      headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300";
    }

    // 304 Not Modified if unchanged
    const ifNoneMatch = request.headers.get("if-none-match");
    if (!forceFresh && ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers,
      });
    }

    return new Response(payloadStr, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Error fetching popup article:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi tải bài viết popup", article: null },
      { status: 500 }
    );
  }
}

