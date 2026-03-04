import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  await connectDB();

  const post = await BlogPost.findOne({ slug: params.slug, status: "PUBLISHED" }).lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const tags = (post as any).tags || [];
  const category = (post as any).category || "general";

  const related = await BlogPost.find({
    status: "PUBLISHED",
    slug: { $ne: params.slug },
    $or: [{ category }, { tags: { $in: tags } }],
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(6)
    .select("title slug excerpt coverImage category tags readCount likeCount publishedAt")
    .lean();

  return NextResponse.json({ post, related });
}