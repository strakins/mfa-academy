import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import Image from "next/image";
import { notFound } from "next/navigation";
import BlogActions from "./ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  await connectDB();

  const post = await BlogPost.findOne({ slug: params.slug, status: "PUBLISHED" }).lean();
  if (!post) return notFound();

  return (
    <div className="bg-navy-900 text-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="relative aspect-[16/9]">
            <Image
              src={(post as any).coverImage?.url || "/placeholder.jpg"}
              alt={(post as any).title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/35 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <h1 className="text-2xl font-extrabold">{(post as any).title}</h1>
              <p className="mt-2 text-sm text-ash-200">
                {(post as any).readCount || 0} reads • {(post as any).likeCount || 0} likes
              </p>
            </div>
          </div>

          <div className="p-6">
            <BlogActions postId={String((post as any)._id)} />

            <article className="prose prose-invert max-w-none prose-p:text-ash-200 prose-headings:text-white prose-a:text-gold-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {(post as any).contentMd}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}