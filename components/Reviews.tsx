"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { apiGet, apiSend } from "@/lib/utils";
import { Button } from "./Button";

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange?: (v: number) => void;
  disabled?: boolean;
}) {
  const interactive = typeof onChange === "function" && !disabled;

  return (
    <div className="flex items-center gap-1" role={interactive ? "radiogroup" : undefined}>
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const active = v <= value;
        return (
          <button
            key={v}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(v)}
            className={[
              "text-lg transition",
              interactive ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default",
              active ? "text-gold-500" : "text-ash-300 dark:text-white/20",
            ].join(" ")}
            aria-label={`${v} star`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function SurfaceCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-ash-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h3 className="text-lg font-extrabold text-navy-900 dark:text-white">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-ash-600 dark:text-ash-200">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function Reviews() {
  const { data } = useSession();

  const [items, setItems] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isLoggedIn = !!data?.user;

  const canSubmit = useMemo(() => {
    if (!isLoggedIn) return false;
    if (busy) return false;
    return text.trim().length >= 10;
  }, [isLoggedIn, busy, text]);

  async function refresh() {
    setError(null);
    try {
      const r = await apiGet<any[]>("/api/reviews");
      setItems(Array.isArray(r) ? r : []);
    } catch (e: any) {
      setError("Could not load reviews. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit() {
    setNotice(null);
    setError(null);

    if (!isLoggedIn) {
      signIn(undefined, { callbackUrl: "/#reviews" });
      return;
    }

    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setError("Please write at least 10 characters.");
      return;
    }

    setBusy(true);
    try {
      await apiSend("/api/reviews", "POST", { rating, text: trimmed });
      setText("");
      setRating(5);
      setNotice("Thanks! Your review was submitted and is pending admin approval.");
      await refresh();
    } catch (e: any) {
      setError("Could not submit review. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id="reviews" className="grid gap-6 md:grid-cols-2">
      {/* Approved reviews */}
      <SurfaceCard
        title="Amazing Feedback from our students and customers"
        subtitle="Read Feedback from our Clients"
      >
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl border border-ash-200 bg-ash-50 animate-pulse dark:border-white/10 dark:bg-white/5"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-ash-600 dark:text-ash-200">No approved reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((r) => (
              <div
                key={r._id}
                className="rounded-2xl border border-ash-200 bg-ash-50 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">
                    {r.displayName || "Student"}
                  </p>
                  <StarRating value={Number(r.rating) || 0} />
                </div>
                <p className="mt-2 text-sm text-ash-700 dark:text-ash-200">{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </p>
        ) : null}
      </SurfaceCard>

      {/* Submit review */}
      <SurfaceCard
        title="Leave a review"
        subtitle={isLoggedIn ? "Your review will be visible after approval." : "Login to write a review."}
      >
        <div className="space-y-4">
          {/* Rating */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-navy-900 dark:text-white">Rating</span>
            <StarRating value={rating} onChange={setRating} disabled={busy} />
          </div>

          {/* Text */}
          <div>
            <textarea
              className="h-28 w-full rounded-2xl border border-ash-200 bg-white p-3 text-sm text-navy-900 placeholder:text-ash-400 focus:outline-none focus:ring-2 focus:ring-gold-400/60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
              placeholder="Tell us about your experience…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={busy}
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-ash-600 dark:text-ash-300">
                Minimum 10 characters.
              </span>
              <span className={text.trim().length >= 10 ? "text-gold-600 dark:text-gold-300" : "text-ash-500 dark:text-ash-400"}>
                {text.trim().length}/10
              </span>
            </div>
          </div>

          {/* Notice / Error */}
          {notice ? (
            <p className="rounded-xl border border-ash-200 bg-ash-50 p-3 text-sm text-ash-700 dark:border-white/10 dark:bg-white/5 dark:text-ash-200">
              {notice}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </p>
          ) : null}

          {/* Action */}
          {!isLoggedIn ? (
            <Button variant="secondary" onClick={() => signIn(undefined, { callbackUrl: "/#reviews" })}>
              Login to Review
            </Button>
          ) : (
            <Button onClick={submit} disabled={!canSubmit}>
              {busy ? "Posting..." : "Post Review"}
            </Button>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
