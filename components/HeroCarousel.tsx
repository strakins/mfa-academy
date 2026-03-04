

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Slide =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string };

const demoSlides: Slide[] = [
  { type: "video", src: "/demo-hero.mp4", poster: "/mfa_ceo1.jpeg", alt: "MFA hero video" },
  { type: "image", src: "/mfa_ceo2.jpeg", alt: "MFA students" },
  { type: "image", src: "/mfa_ceo.jpeg", alt: "MFA studio" },
];

export default function HeroCarousel({
  slides = demoSlides,
  intervalMs = 7000,
}: {
  slides?: Slide[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  const active = useMemo(() => slides[index], [slides, index]);

  return (
    <div className="relative h-[72vh] min-h-[560px] overflow-hidden rounded-3xl border border-ash-00 dark:border-white/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${active.type}-${"src" in active ? active.src : index}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {active.type === "image" ? (
            <Image
              src={active.src}
              alt={active.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={active.poster}
            >
              <source src={active.src} />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/35 to-navy-900/10" />
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "w-7 bg-white" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
