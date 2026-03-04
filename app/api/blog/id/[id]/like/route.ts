import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const userId = String((session.user as any)?.id ?? (session.user as any)?.email);

  await connectDB();
  const post = await BlogPost.findById(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const liked = post.likedBy?.includes(userId);

  if (liked) {
    post.likedBy = post.likedBy.filter((x: string) => x !== userId);
    post.likeCount = Math.max(0, (post.likeCount || 0) - 1);
  } else {
    post.likedBy = [...(post.likedBy || []), userId];
    post.likeCount = (post.likeCount || 0) + 1;
  }

  await post.save();

  return NextResponse.json({ ok: true, liked: !liked, likeCount: post.likeCount });
}