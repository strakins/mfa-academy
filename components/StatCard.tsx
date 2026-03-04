import { ReactNode } from "react";
import Reveal from "@/components/Reveal";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  delay?: number;
}

export function StatCard({ label, value, icon, delay = 0 }: StatCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 text-xs text-ash-200">
          <span className="text-gold-300">{icon}</span>
          {label}
        </div>
        <div className="mt-1 text-sm font-extrabold">{value}</div>
      </div>
    </Reveal>
  );
}