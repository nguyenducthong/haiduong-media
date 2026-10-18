import { NextResponse } from "next/server";
import {
  scanList,
  scanArticleDetail,
  enrichArticle,
  saveEnterprises,
  loadCurrentEnterprises,
} from "@/lib/crawler";
import { localizeArticleImages } from "@/lib/image-downloader";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action = "scan-list", url, article, articles, mode = "merge" } = body;

    // 1. Quét danh sách bài viết từ link
    if (action === "scan-list") {
      if (!url) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập đường dẫn URL hợp lệ." },
          { status: 400 }
        );
      }
      const list = await scanList(url);
      return NextResponse.json({
        success: true,
        count: list.length,
        articles: list,
      });
    }

    // 2. Quét chi tiết cho 1 bài viết và làm giàu dữ liệu
    if (action === "scan-detail") {
      if (!article || !article.sourceUrl) {
        return NextResponse.json(
          { success: false, error: "Thiếu thông tin bài viết hoặc sourceUrl." },
          { status: 400 }
        );
      }
      const content = await scanArticleDetail(article.sourceUrl);
      const enriched = enrichArticle(article, content);
      const localized = await localizeArticleImages(enriched);
      return NextResponse.json({
        success: true,
        article: localized,
      });
    }

    // 3. Quét chi tiết hàng loạt các bài đã chọn và làm giàu dữ liệu
    if (action === "batch-details") {
      if (!Array.isArray(articles) || articles.length === 0) {
        return NextResponse.json(
          { success: false, error: "Danh sách bài viết trống." },
          { status: 400 }
        );
      }
      const enrichedArticles = [];
      for (const item of articles) {
        try {
          const content = await scanArticleDetail(item.sourceUrl);
          const enriched = enrichArticle(item, content);
          const localized = await localizeArticleImages(enriched);
          enrichedArticles.push(localized);
        } catch (err: any) {
          console.warn(`Lỗi quét bài ${item.title}:`, err.message);
          const fallback = enrichArticle(item, "");
          const localizedFallback = await localizeArticleImages(fallback);
          enrichedArticles.push(localizedFallback);
        }
      }
      return NextResponse.json({
        success: true,
        count: enrichedArticles.length,
        articles: enrichedArticles,
      });
    }

    // 4. Lưu danh sách bài viết vào hệ thống với cơ chế hash & chống trùng lặp
    if (action === "save") {
      if (!Array.isArray(articles) || articles.length === 0) {
        return NextResponse.json(
          { success: false, error: "Không có dữ liệu bài viết để lưu." },
          { status: 400 }
        );
      }
      const preparedArticles = articles.map((art: any) => {
        const slug =
          art.slug ||
          (art.title
            ? art.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[đĐ]/g, "d")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-")
            : `art-${Date.now()}`);
        return {
          ...art,
          id: art.id || slug,
          slug,
        };
      });
      const localizedArticles = await Promise.all(
        preparedArticles.map((item: any) => localizeArticleImages(item))
      );
      const result = await saveEnterprises(localizedArticles, mode);
      const msg =
        mode === "overwrite"
          ? `Đã ghi đè toàn bộ ${result.added} bài viết vào hệ thống!`
          : `Đã lưu: Thêm mới ${result.added} bài, Cập nhật ${result.updated} bài, Bỏ qua ${result.skipped} bài trùng lặp!`;

      return NextResponse.json({
        success: true,
        message: msg,
        added: result.added,
        updated: result.updated,
        skipped: result.skipped,
        totalCount: result.total,
      });
    }

    // 5. Xóa bài viết
    if (action === "delete") {
      const { slug } = body;
      const current = await loadCurrentEnterprises();
      const updated = current.filter((a: any) => a.slug !== slug && a.id !== slug);
      await saveEnterprises(updated, "overwrite");
      return NextResponse.json({
        success: true,
        message: "Đã xóa bài viết thành công khỏi database.",
        totalCount: updated.length,
      });
    }

    // 5b. Xóa nhiều bài viết (Bulk delete)
    if (action === "delete-multiple") {
      const { slugs } = body;
      if (!Array.isArray(slugs) || slugs.length === 0) {
        return NextResponse.json(
          { success: false, error: "Vui lòng chọn ít nhất 1 bài viết cần xóa." },
          { status: 400 }
        );
      }
      const slugSet = new Set(slugs);
      const current = await loadCurrentEnterprises();
      const updated = current.filter((a: any) => !slugSet.has(a.slug) && !slugSet.has(a.id));
      const deletedCount = current.length - updated.length;
      await saveEnterprises(updated, "overwrite");
      return NextResponse.json({
        success: true,
        message: `Đã xóa thành công ${deletedCount} bài viết khỏi database.`,
        deletedCount,
        totalCount: updated.length,
      });
    }

    // 6. Lưu/cập nhật 1 bài viết đơn lẻ (chỉnh sửa hoặc thêm mới)
    if (action === "save-single") {
      const { article } = body;
      if (!article || !article.title) {
        return NextResponse.json(
          { success: false, error: "Thiếu thông tin bài viết hoặc tiêu đề." },
          { status: 400 }
        );
      }

      const current = await loadCurrentEnterprises();
      const slug =
        article.slug ||
        article.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

      const type = Array.isArray(article.type)
        ? article.type
        : article.type
        ? [article.type]
        : ["doanh-nghiep"];

      const enrichedArticle = {
        id: article.id || slug,
        slug,
        title: article.title.trim(),
        type,
        category: article.category || "Doanh nghiệp tiêu biểu",
        excerpt: article.excerpt || "",
        content: article.content || "",
        image: article.image || "/images/news-placeholder.jpg",
        date: article.date || new Date().toLocaleDateString("vi-VN"),
        views: article.views || "1",
        author: article.author || "Ban biên tập",
        sourceUrl: article.sourceUrl || "",
        active: article.active !== false,
      };

      const localizedArticle = await localizeArticleImages(enrichedArticle);

      const existingIndex = current.findIndex(
        (a: any) => a.slug === slug || (article.id && a.id === article.id)
      );

      let updatedList = [...current];
      if (existingIndex >= 0) {
        updatedList[existingIndex] = { ...current[existingIndex], ...localizedArticle };
      } else {
        updatedList = [localizedArticle, ...current];
      }

      await saveEnterprises(updatedList, "overwrite");
      return NextResponse.json({
        success: true,
        message: existingIndex >= 0 ? "Đã cập nhật bài viết thành công!" : "Đã tạo bài viết mới thành công!",
        article: localizedArticle,
        totalCount: updatedList.length,
      });
    }

    // 7. Bật / Tắt trạng thái hiển thị nhanh
    if (action === "toggle-active") {
      const { slug } = body;
      const current = await loadCurrentEnterprises();
      const article = current.find((a: any) => a.slug === slug || a.id === slug);
      if (!article) {
        return NextResponse.json({ success: false, error: "Không tìm thấy bài viết." }, { status: 404 });
      }
      article.active = !article.active;
      await saveEnterprises(current, "overwrite");
      return NextResponse.json({
        success: true,
        active: article.active,
        message: `Đã ${article.active ? "bật" : "ẩn"} bài viết.`,
      });
    }

    return NextResponse.json(
      { success: false, error: `Action '${action}' không hợp lệ.` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Đã xảy ra lỗi máy chủ." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "list-saved";

    if (action === "list-saved") {
      const typeFilter = searchParams.get("type");
      let list = await loadCurrentEnterprises();
      if (typeFilter && typeFilter !== "all") {
        list = list.filter((a: any) => {
          const t = Array.isArray(a.type)
            ? a.type
            : a.type
            ? [a.type]
            : ["doanh-nghiep"];
          return t.includes(typeFilter);
        });
      }
      return NextResponse.json({
        success: true,
        count: list.length,
        articles: list,
      });
    }

    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        { success: false, error: "Thiếu tham số url." },
        { status: 400 }
      );
    }

    const list = await scanList(url);
    return NextResponse.json({
      success: true,
      count: list.length,
      articles: list,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
