import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Work } from "@/models/Work";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message || String(message).trim().length < 2) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }

  await connectDB();
  const userId = (session.user as any).id;

  const work = await Work.findById(params.id);
  if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });

  work.comments.push({
    userId,
    name: (session.user as any).name || "User",
    message: String(message).trim(),
  });

  await work.save();
  return NextResponse.json({ ok: true });
}