import { NextResponse } from "next/server";
import { incrementArticleViews } from "@/lib/enterprises";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body?.slug;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const views = await incrementArticleViews(slug);
    return NextResponse.json({ success: true, views });
  } catch (error) {
    console.error("Failed to increment views:", error);
    return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 });
  }
}
