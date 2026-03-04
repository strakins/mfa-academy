import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  await connectDB();

  const posts = await BlogPost.find({ status: "PUBLISHED" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select("title slug excerpt coverImage tags publishedAt readCount likeCount")
    .lean();

  return (
    <div className="bg-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h1 className="text-2xl font-extrabold">Blog</h1>
          <p className="mt-2 text-sm text-ash-200">
            Fashion tips, academy updates, and training insights — written for Nigeria & diaspora.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p: any) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10">
              <div className="relative aspect-[16/10]">
                <Image
                  src={p.coverImage?.url || "/placeholder.jpg"}
                  alt={p.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-sm font-extrabold line-clamp-2">{p.title}</p>
                <p className="mt-2 text-sm text-ash-200 line-clamp-3">{p.excerpt || "Read more..."}</p>

                <div className="mt-4 flex items-center justify-between text-xs text-ash-200">
                  <span>{p.readCount || 0} reads</span>
                  <span>{p.likeCount || 0} likes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-ash-200">
            No posts yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}