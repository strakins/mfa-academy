"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

function pickDifferent(current: string, arr: string[]) {
  if (arr.length <= 1) return arr[0] || current;
  let next = current;
  let tries = 0;
  while (next === current && tries < 8) {
    next = arr[Math.floor(Math.random() * arr.length)];
    tries++;
  }
  return next;
}

export default function CohortCard({
  cohortId,
  title,
  subtitle,
  description,
  images,
  index,
}: {
  cohortId: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  index: number;
}) {
  const safeImages = useMemo(() => images.filter(Boolean).slice(0, 6), [images]);
  const [bg, setBg] = useState(safeImages[0] || "");

  useEffect(() => {
    if (!safeImages.length) return;
    setBg(safeImages[0]);

    const intervalMs = 4200 + Math.floor(Math.random() * 1800); // 4.2s - 6s
    const t = setInterval(() => {
      setBg((cur) => pickDifferent(cur, safeImages));
    }, intervalMs);

    return () => clearInterval(t);
  }, [safeImages]);

  return (
    <Reveal delay={index * 0.03}>
      <Link
        href={`/works/${cohortId}`}
        className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm backdrop-blur focus:outline-none focus:ring-2 focus:ring-gold-400/40"
      >
        {/* Background image */}
        <div className="relative h-[230px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={bg}
              className="absolute inset-0"
              initial={{ opacity: 0.2, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2, scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={bg}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority={index < 2}
              />
            </motion.div>
          </AnimatePresence>

          {/* Luxury overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/35 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(240,180,41,0.22),transparent_50%)]" />

          {/* Content overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur"
            >
              <p className="text-sm font-extrabold text-white line-clamp-1">{title}</p>
              <p className="mt-1 text-xs text-ash-200 line-clamp-1">{subtitle}</p>
              <p className="mt-3 text-sm text-ash-200 line-clamp-2">{description}</p>

              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-gold-300">
                View cohort <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hover polish */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute inset-0 ring-1 ring-white/10" />
        </div>
      </Link>
    </Reveal>
  );
}