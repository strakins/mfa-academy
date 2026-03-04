"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { apiGet, apiSend } from "@/lib/utils";
import { UploadCloud, X, Plus, Trash2 } from "lucide-react";

type Post = {
  _id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  readCount?: number;
  likeCount?: number;
  createdAt?: string;
};

const MAX_MB = 8;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function AdminBlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // create form state
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => {
    if (busy) return false;
    if (!title.trim()) return false;
    if (contentMd.trim().length < 30) return false;
    return true;
  }, [busy, title, contentMd]);

  // preview
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function load() {
    setLoading(true);
    try {
      const r = await apiGet<Post[]>("/api/admin/blog");
      setPosts(Array.isArray(r) ? r : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setTitle("");
    setExcerpt("");
    setContentMd("");
    setTags([]);
    setTagInput("");
    setStatus("DRAFT");
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validateFile(f: File) {
    if (!ACCEPTED.includes(f.type)) {
      alert("Unsupported image type. Use JPG/PNG/WebP.");
      return false;
    }
    const sizeMb = f.size / (1024 * 1024);
    if (sizeMb > MAX_MB) {
      alert(`Image too large. Max ${MAX_MB}MB.`);
      return false;
    }
    return true;
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  function removeTag(t: string) {
    setTags((prev) => prev.filter((x) => x !== t));
  }

  async function getSignature(folder: string) {
    const signRes = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    if (!signRes.ok) throw new Error("Failed to sign upload");
    return signRes.json();
  }

  async function uploadToCloudinary(f: File) {
    const folder = "mfa/blog";
    const { cloudName, apiKey, timestamp, signature } = await getSignature(folder);

    const form = new FormData();
    form.append("file", f);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("folder", folder);

    const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });

    if (!upRes.ok) throw new Error("Cloudinary upload failed");
    return upRes.json();
  }

  async function createPost() {
    if (!canSubmit) return;

    setBusy(true);
    try {
      let coverImage = undefined as any;

      if (file) {
        const uploaded = await uploadToCloudinary(file);
        coverImage = {
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
        };
      }

      const res = await apiSend<{ ok: boolean; id: string; slug: string }>(
        "/api/admin/blog",
        "POST",
        {
          title: title.trim(),
          excerpt: excerpt.trim(),
          contentMd: contentMd.trim(),
          tags,
          status,
          coverImage,
        }
      );

      // ✅ refresh list so admin sees it immediately
      await load();

      // ✅ if published, you can route to public post later; for now keep admin list
      alert(status === "PUBLISHED" ? "Published successfully" : "Saved as draft");

      resetForm();
      setShowCreate(false);
    } catch (e: any) {
      alert(e?.message ?? "Failed to create post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold">Admin • Blog</h1>
              <p className="mt-1 text-sm text-ash-200">
                Create, edit, and publish posts. Published posts appear on the public blog.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowCreate((s) => !s)}
                className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-900 hover:bg-gold-400"
              >
                {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {showCreate ? "Close" : "Create Post"}
              </button>

              {/* Optional: still allow dedicated page edit/create */}
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Advanced Editor
              </Link>
            </div>
          </div>
        </div>

        {/* Create form (hidden by default) */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold">New Blog Post</h2>
                    <p className="mt-1 text-sm text-ash-200">
                      Draft first or publish immediately.
                    </p>
                  </div>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Publish</option>
                  </select>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-5">
                  {/* Cover preview */}
                  <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                      <div className="relative aspect-[16/10]">
                        {preview ? (
                          <>
                            <Image src={preview} alt="Cover preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                              <span className="truncate text-xs text-ash-200">
                                {file?.name ? (
                                  <>
                                    {file.name} • {(file.size / (1024 * 1024)).toFixed(1)}MB
                                  </>
                                ) : null}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFile(null);
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                              >
                                <Trash2 className="h-4 w-4 text-gold-300" />
                                Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center p-6 text-center text-ash-200">
                            Upload a cover image (optional)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          if (!f) return;
                          if (!validateFile(f)) {
                            e.currentTarget.value = "";
                            return;
                          }
                          setFile(f);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ash-200"
                      />
                      <p className="mt-2 text-xs text-ash-300">
                        Best: landscape image. Max {MAX_MB}MB.
                      </p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="lg:col-span-3 grid gap-4">
                    <label className="grid gap-2 text-sm text-ash-200">
                      Title *
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold-400/40"
                        placeholder="e.g. How to Start Fashion Design in Nigeria"
                      />
                    </label>

                    <label className="grid gap-2 text-sm text-ash-200">
                      Excerpt (optional)
                      <input
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold-400/40"
                        placeholder="Short summary shown on blog cards..."
                      />
                    </label>

                    <label className="grid gap-2 text-sm text-ash-200">
                      Content (Markdown) *
                      <textarea
                        value={contentMd}
                        onChange={(e) => setContentMd(e.target.value)}
                        className="min-h-[200px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold-400/40"
                        placeholder="Write your post..."
                      />
                      <p className="text-xs text-ash-300">Min 30 characters.</p>
                    </label>

                    {/* Tags */}
                    <div className="grid gap-2">
                      <p className="text-sm text-ash-200">Tags (optional)</p>

                      <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-navy-900"
                          >
                            {t}
                            <button type="button" onClick={() => removeTag(t)} className="leading-none">
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold-400/40"
                          placeholder="e.g. fashion school"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={createPost}
                        disabled={!canSubmit}
                        className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 hover:bg-gold-400 disabled:opacity-60"
                      >
                        <UploadCloud className="h-4 w-4" />
                        {busy ? "Saving..." : status === "PUBLISHED" ? "Publish Post" : "Save Draft"}
                      </button>

                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={busy}
                        className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts list */}
        <div className="mt-6 grid gap-3">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-ash-200">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-ash-200">No posts yet.</div>
          ) : (
            posts.map((p) => (
              <Link
                key={p._id}
                href={`/admin/blog/${p._id}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-extrabold line-clamp-1">{p.title}</p>
                    <p className="mt-1 text-xs text-ash-200">
                      {p.status} • {p.likeCount || 0} likes • {p.readCount || 0} reads
                    </p>
                  </div>
                  <span className="text-xs text-gold-300">Edit →</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}