import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Work } from "@/models/Work";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const userId = (session.user as any).id;

  const work = await Work.findById(params.id);
  if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const already = work.likedBy.some((x: any) => String(x) === String(userId));
  if (already) {
    work.likedBy = work.likedBy.filter((x: any) => String(x) !== String(userId));
  } else {
    work.likedBy.push(userId);
  }
  await work.save();

  return NextResponse.json({ liked: !already, likes: work.likedBy.length });
}