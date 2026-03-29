"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

type Cohort = {
  _id: string;
  title: string;
  year: number;
  batch: string;
  description?: string;
  images: string[];
  worksCount: number;
};

export default function CohortSection({ cohort }: { cohort: Cohort }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // On large: 4 visible; on small: 1. We scroll by 1 item at a time.
  const total = cohort.images.length;

  function scroll(dir: "prev" | "next") {
    const track = trackRef.current;
    if (!track) return;
    // item width = 100% / visibleCount — we use CSS, so just scroll by one item width
    const itemWidth = track.scrollWidth / total;
    track.scrollBy({ left: dir === "next" ? itemWidth : -itemWidth, behavior: "smooth" });

    setActiveIdx((prev) =>
      dir === "next" ? Math.min(prev + 1, total - 1) : Math.max(prev - 1, 0)
    );
  }

  // Update active dot on scroll
  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const itemWidth = track.scrollWidth / total;
    const idx = Math.round(track.scrollLeft / itemWidth);
    setActiveIdx(idx);
  }

  return (
    <div className="group/section">
      {/* Cohort header row */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-['Playfair_Display',serif] text-2xl font-bold leading-tight md:text-3xl">
            {cohort.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/40 uppercase tracking-widest">
            <span>{cohort.batch}</span>
            <span className="text-white/20">·</span>
            <span>{cohort.worksCount} works</span>
          </div>
        </div>

        <Link
          href={`/works/${cohort._id}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs uppercase tracking-widest text-white/70 transition-all hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("prev")}
          disabled={activeIdx === 0}
          aria-label="Previous"
          className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0a0a0f]/90 text-white/60 shadow-xl backdrop-blur transition hover:border-amber-400/50 hover:text-amber-400 disabled:pointer-events-none disabled:opacity-20"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="
            flex gap-3 overflow-x-auto scroll-smooth
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            snap-x snap-mandatory
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {cohort.images.map((src, i) => (
            <ImageCard
              key={i}
              src={src}
              index={i}
              cohortId={cohort._id}
              cohortTitle={cohort.title}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("next")}
          disabled={activeIdx >= total - 1}
          aria-label="Next"
          className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0a0a0f]/90 text-white/60 shadow-xl backdrop-blur transition hover:border-amber-400/50 hover:text-amber-400 disabled:pointer-events-none disabled:opacity-20"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {cohort.images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const track = trackRef.current;
              if (!track) return;
              const itemWidth = track.scrollWidth / total;
              track.scrollTo({ left: i * itemWidth, behavior: "smooth" });
              setActiveIdx(i);
            }}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === activeIdx
                ? "w-6 bg-amber-400"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ImageCard({
  src,
  index,
  cohortId,
  cohortTitle,
}: {
  src: string;
  index: number;
  cohortId: string;
  cohortTitle: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      href={`/works/${cohortId}?img=${index}`}
      className="
        group/card relative block flex-shrink-0 overflow-hidden rounded-2xl
        snap-start
        /* Small: 1 visible → 100% − gap */
        w-[calc(100%-1rem)]
        /* Medium: 2 visible */
        sm:w-[calc(50%-0.75rem)]
        /* Large: 4 visible */
        lg:w-[calc(25%-0.75rem)]
        aspect-[3/4]
        border border-white/10
        bg-white/5
        transition-all duration-500
        hover:border-amber-400/30
        hover:shadow-[0_0_40px_rgba(251,191,36,0.08)]
      "
    >
      {/* Image */}
      <img
        src={src}
        alt={`${cohortTitle} work ${index + 1}`}
        onLoad={() => setLoaded(true)}
        className={`
          absolute inset-0 h-full w-full object-cover object-top
          transition-all duration-700
          group-hover/card:scale-105
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 to-white/10" />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

      {/* Bottom label on hover */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-white/70">
            View detail
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>

      {/* Corner index badge */}
      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
        <span className="text-[10px] font-semibold text-white/60">{index + 1}</span>
      </div>
    </Link>
  );
}
