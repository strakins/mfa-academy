"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/utils";

function Stars({ v }: { v: number }) {
  const n = Math.max(0, Math.min(5, Math.round(v)));
  return <span className="text-gold-400 text-sm">{Array.from({ length: n }).map(() => "★").join("")}</span>;
}

export default function ReviewsCarousel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const r = await apiGet<any[]>("/api/reviews");
      setItems(Array.isArray(r) ? r : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const doubled = useMemo(() => (items.length ? [...items, ...items] : []), [items]);

  if (loading) {
    return <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-ash-200">Loading reviews…</div>;
  }

  if (!items.length) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-lg font-extrabold text-white">What people are saying</p>
          <p className="text-sm text-ash-200">Approved reviews from students & clients</p>
        </div>
      </div>
 
      <motion.div
        className="flex gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((r, idx) => (
          <div
            key={`${r._id}-${idx}`}
            className="min-w-[280px] max-w-[280px] rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-white">{r.displayName || "Student"}</p>
              <Stars v={Number(r.rating || 0)} />
            </div>
            <p className="mt-2 line-clamp-4 text-sm text-ash-200">{r.text}</p>
          </div>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-navy-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-navy-900 to-transparent" />
    </div>
  );
}