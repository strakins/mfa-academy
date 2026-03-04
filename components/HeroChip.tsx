import { ReactNode } from "react";

interface HeroChipProps {
  icon: ReactNode;
  text: string;
}

export function HeroChip({ icon, text }: HeroChipProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-ash-100 backdrop-blur">
      <span className="text-gold-300">{icon}</span>
      {text}
    </span>
  );
}