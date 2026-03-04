"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { apiSend } from "@/lib/utils";
import { Heart } from "lucide-react";

export default function BlogActions({ postId }: { postId: string }) {
  const { data } = useSession();
  const isLoggedIn = !!data?.user;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  // ✅ count a read once per device per 6 hours
  useEffect(() => {
    const key = `blog_read_${postId}`;
    const last = Number(localStorage.getItem(key) || "0");
    const sixHours = 6 * 60 * 60 * 1000;
    if (Date.now() - last < sixHours) return;

    apiSend(`/api/blog/${postId}/read`, "POST")
      .then(() => localStorage.setItem(key, String(Date.now())))
      .catch(() => {});
  }, [postId]);

  async function toggleLike() {
    if (!isLoggedIn) {
      signIn(undefined, { callbackUrl: window.location.pathname });
      return;
    }

    setBusy(true);
    try {
      const res = await apiSend<{ liked: boolean; likeCount: number }>(`/api/blog/${postId}/like`, "POST");
      setLiked(res.liked);
      setLikeCount(res.likeCount);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <button
        onClick={toggleLike}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-gold-400 text-gold-400" : "text-ash-200"}`} />
        Like
      </button>

      {likeCount != null ? (
        <span className="text-xs text-ash-200">{likeCount} likes</span>
      ) : (
        <span className="text-xs text-ash-200"> </span>
      )}
    </div>
  );
}