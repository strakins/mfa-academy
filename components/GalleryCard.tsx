import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

interface GalleryCardProps {
  src: string;
  index: number;
  title?: string;
  subtitle?: string;
  href?: string;
}

export function GalleryCard({ src, index, title = "Student Work", subtitle = "Tap to view details", href }: GalleryCardProps) {
  const Card = (
    <Reveal delay={index * 0.03}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="group overflow-hidden rounded-3xl border border-ash-200 bg-gold-400 shadow-sm dark:border-white/10 dark:bg-ash-600 dark:backdrop-blur"
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" /> */}
        </div>
        <div className="p-4">
          <p className="text-sm font-semibold text-navy-900 dark:text-white">{title}</p>
          <p className="mt-1 text-xs text-ash-600 dark:text-ash-200">{subtitle}</p>
        </div>
      </motion.div>
    </Reveal>
  );

  return href ? (
    <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-gold-400/40 rounded-3xl">
      {Card}
    </Link>
  ) : (
    Card
  );
}