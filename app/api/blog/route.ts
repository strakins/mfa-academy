import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

export async function GET() {
  await connectDB();

  const posts = await BlogPost.find({ status: "PUBLISHED" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select("title slug excerpt coverImage tags publishedAt readCount likeCount createdAt")
    .lean();

  return NextResponse.json(posts);
}