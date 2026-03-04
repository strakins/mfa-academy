"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

type CohortInfo = {
  id: string;
  title: string;
  year: number;
  batch: string;
  description: string;
};

type WorkItem = {
  id: string;
  title: string;
  category: string;
  studentName: string;
  description: string;
  imageUrl: string;
};

export default function CohortGalleryClient({
  cohort,
  works,
}: {
  cohort: CohortInfo;
  works: WorkItem[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(1);

  const hasWorks = works.length > 0;
  const current = works[active];

  const openAt = (idx: number) => {
    setActive(idx);
    setZoom(1);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const next = () => setActive((i) => (i + 1) % works.length);
  const prev = () => setActive((i) => (i - 1 + works.length) % works.length);

  // Keyboard support
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, works.length]);

  // Lock scroll when lightbox open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Swipe handling (drag left/right)
  const onDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -80 || velocity < -600) next();
    if (offset > 80 || velocity > 600) prev();
  };

  // Wheel zoom (desktop)
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!open) return;
    if (Math.abs(e.deltaY) < 2) return;
    setZoom((z) => {
      const nz = e.deltaY > 0 ? z - 0.08 : z + 0.08;
      return Math.min(2.2, Math.max(1, +nz.toFixed(2)));
    });
  };

  const subtitle = useMemo(() => {
    if (!current) return "";
    return [current.category, current.studentName].filter(Boolean).join(" • ");
  }, [current]);

  return (
    <div className=" text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold">{cohort.title}</h1>
              <p className="mt-2 text-sm text-ash-200">
                {cohort.year} • {cohort.batch} • {works.length} works
              </p>
              {cohort.description ? (
                <p className="mt-3 max-w-3xl text-sm text-ash-200">{cohort.description}</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-ash-200">
              Click a design to view fullscreen • Use ← → to navigate
            </div>
          </div>
        </div>

        {/* Empty */}
        {!hasWorks ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-ash-200">
            No works uploaded for this cohort yet.
          </div>
        ) : (
          <>
            {/* Masonry-style Gallery */}
            <div className="mt-8  gap-4 grid md:grid-cols-2 lg:grid-cols-3">
              {works.map((w, i) => (
                <motion.button
                  key={w.id}
                  onClick={() => openAt(i)}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-sm backdrop-blur focus:outline-none focus:ring-2 focus:ring-gold-400/40"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={w.imageUrl}
                      alt={w.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Elegant overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/15 to-transparent opacity-0 transition group-hover:opacity-100" />
                    {/* Overlay caption (no text below card) */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur">
                        <p className="line-clamp-1 text-sm font-semibold text-white">{w.title}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-ash-200">
                          {[w.category, w.studentName].filter(Boolean).join(" • ") || "Tap to view details"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
              {open && current && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                  />

                  {/* Modal */}
                  <motion.div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-2xl">
                      {/* Top bar */}
                      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">{current.title}</p>
                          <p className="truncate text-xs text-ash-200">{subtitle || "Student work"}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.2).toFixed(2)))}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
                            aria-label="Zoom in"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
                            aria-label="Zoom out"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </button>
                          <button
                            onClick={close}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
                            aria-label="Close"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="grid md:grid-cols-4">
                        {/* Image */}
                        <div className="relative bg-black md:col-span-3" onWheel={onWheel}>
                          <motion.div
                            className="relative h-[70vh] w-full"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.12}
                            onDragEnd={onDragEnd}
                          >
                            <div
                              className="absolute inset-0"
                              style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: "center",
                                transition: "transform 120ms ease",
                              }}
                            >
                              <Image src={current.imageUrl} alt={current.title} fill className="object-contain" />
                            </div>
                          </motion.div>

                          {/* Arrows */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prev();
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              next();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20"
                            aria-label="Next"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-ash-200 backdrop-blur">
                            Drag left/right • Scroll to zoom • ESC to close
                          </div>
                        </div>

                        {/* Details */}
                        <div className="border-t border-white/10 p-5 md:border-l md:border-t-0">
                          <p className="text-sm font-bold text-white">Details</p>
                          <div className="mt-3 space-y-2 text-sm text-ash-200">
                            <p>
                              <span className="text-white">Category:</span> {current.category || "—"}
                            </p>
                            <p>
                              <span className="text-white">Student:</span> {current.studentName || "—"}
                            </p>
                            {current.description ? (
                              <>
                                <p className="pt-2 text-white">Description</p>
                                <p className="text-ash-200">{current.description}</p>
                              </>
                            ) : null}
                          </div>

                          {/* Thumbnails */}
                          <div className="mt-5">
                            <p className="text-xs font-semibold text-ash-200">More from this cohort</p>
                            <div className="mt-3 grid grid-cols-4 gap-2">
                              {works.slice(0, 8).map((t, idx) => (
                                <button
                                  key={t.id}
                                  onClick={() => openAt(idx)}
                                  className={[
                                    "relative aspect-square overflow-hidden rounded-xl border transition",
                                    idx === active
                                      ? "border-gold-400"
                                      : "border-white/10 hover:border-white/20",
                                  ].join(" ")}
                                  aria-label={`Open ${t.title}`}
                                >
                                  <Image src={t.imageUrl} alt={t.title} fill className="object-cover" />
                                </button>
                              ))}
                            </div>
                            {works.length > 8 ? (
                              <p className="mt-2 text-xs text-ash-200">
                                Showing 8 thumbnails • Use arrows to browse all ({works.length})
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}