import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function isAdmin() {
  const session = await getServerSession(authOptions)

  if(!session || session.user.role !=="ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } 

  await connectDB();
  const posts = await BlogPost.find({})
    .sort({ createdAt: -1 })
    .select("title slug status publishedAt readCount likeCount createdAt updatedAt")
    .lean();

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } 

  const body = await req.json().catch(() => null);

  const title = String(body?.title ?? "").trim();
  const excerpt = String(body?.excerpt ?? "").trim();
  const contentMd = String(body?.contentMd ?? "").trim();
  const status = (body?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as "DRAFT" | "PUBLISHED";
  const tags = Array.isArray(body?.tags) ? body.tags.map((t: any) => String(t)) : [];
  const coverImage = body?.coverImage ?? null;

  if (!title || contentMd.length < 30) {
    return NextResponse.json({ error: "Title and content are required (min 30 chars)." }, { status: 400 });
  }

  await connectDB();

  const baseSlug = slugify(title);
  let slug = baseSlug || `post-${Date.now()}`;
  // ensure unique
  const exists = await BlogPost.findOne({ slug }).lean();
  if (exists) slug = `${slug}-${Date.now()}`;

  const authorId = String((session?.user)?.id ?? (session?.user)?.email);
  const authorName = String((session?.user)?.name ?? "Admin");

  const created = await BlogPost.create({
    title,
    slug,
    excerpt,
    contentMd,
    tags,
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    authorId,
    authorName,
    coverImage: coverImage ?? undefined,
  });

  return NextResponse.json({ ok: true, id: String(created._id), slug: created.slug }, { status: 201 });
}