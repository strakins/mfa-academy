import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";

function isAdmin(session: any) {
  return (session?.user as any)?.role === "ADMIN";
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  const post = await BlogPost.findById(params.id).lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  await connectDB();

  const update: any = {};
  if (body?.title != null) update.title = String(body.title).trim();
  if (body?.excerpt != null) update.excerpt = String(body.excerpt).trim();
  if (body?.contentMd != null) update.contentMd = String(body.contentMd);
  if (body?.tags != null) update.tags = Array.isArray(body.tags) ? body.tags.map((t: any) => String(t)) : [];
  if (body?.coverImage != null) update.coverImage = body.coverImage;

  if (body?.status === "PUBLISHED") {
    update.status = "PUBLISHED";
    update.publishedAt = new Date();
  }
  if (body?.status === "DRAFT") {
    update.status = "DRAFT";
    update.publishedAt = null;
  }

  const post = await BlogPost.findByIdAndUpdate(params.id, update, { new: true }).lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  await BlogPost.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}