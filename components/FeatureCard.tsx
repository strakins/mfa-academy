import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

interface FeatureCardProps {
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ title, description, index }: FeatureCardProps) {
  return (
    <Reveal delay={index * 0.05}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="rounded-3xl border border-ash-200 bg-white p-6 shadow-sm"
      >
        <p className="text-lg font-bold text-navy-900">{title}</p>
        <p className="mt-2 text-sm text-ash-600">{description}</p>
      </motion.div>
    </Reveal>
  );
}