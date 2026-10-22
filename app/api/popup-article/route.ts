import { NextResponse } from "next/server";
import { getPopupArticle, getArticleViewUrl } from "@/lib/enterprises";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const article = await getPopupArticle();
    if (!article) {
      return NextResponse.json({ success: true, article: null });
    }

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        image: article.image || "/images/news-placeholder.jpg",
        excerpt: article.excerpt || "",
        category: article.category || "",
        url: getArticleViewUrl(article),
      },
    });
  } catch (error: any) {
    console.error("Error fetching popup article:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi tải bài viết popup", article: null },
      { status: 500 }
    );
  }
}
