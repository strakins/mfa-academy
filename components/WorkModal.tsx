"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn, ZoomOut, Share2, Copy } from "lucide-react";

type WorkItem = {
  _id: string;
  title?: string;
  category?: string;
  studentName?: string;
  description?: string;
  image: { url: string };
};

export default function WorkModal({
  open,
  onClose,
  work,
  shareUrl,
}: {
  open: boolean;
  onClose: () => void;
  work: WorkItem | null;
  shareUrl: string;
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (open) setScale(1);
  }, [open]);

  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  async function handleShare() {
    try {
      if (canShare) {
        await (navigator as any).share({ title: work?.title ?? "Student Work", url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
      }
    } catch {}
  }

  if (!work) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-navy-900 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{work.title || "Student Work"}</p>
                  <p className="truncate text-xs text-ash-200">
                    {work.category || "Design"} {work.studentName ? `• ${work.studentName}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScale((s) => Math.min(2, +(s + 0.2).toFixed(2)))}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setScale((s) => Math.max(1, +(s - 0.2).toFixed(2)))}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="rounded-xl bg-gold-500 p-2 text-navy-900 hover:bg-gold-400"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-3">
                <div className="relative md:col-span-2 bg-black">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-[70vh]">
                    <div
                      className="absolute inset-0"
                      style={{ transform: `scale(${scale})`, transformOrigin: "center", transition: "transform 120ms ease" }}
                    >
                      <Image src={work.image.url} alt={work.title || "Work"} fill className="object-contain" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 p-5 md:border-l md:border-t-0">
                  <p className="text-sm font-bold">Details</p>
                  <div className="mt-3 space-y-2 text-sm text-ash-200">
                    <p><span className="text-white">Category:</span> {work.category || "—"}</p>
                    <p><span className="text-white">Student:</span> {work.studentName || "—"}</p>
                    <p className="pt-2"><span className="text-white">Description:</span></p>
                    <p className="text-ash-200">{work.description || "—"}</p>
                  </div>

                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(shareUrl);
                      alert("Link copied!");
                    }}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 text-gold-300" />
                    Copy link
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}