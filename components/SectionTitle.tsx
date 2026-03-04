import React from "react";

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl text-navy-900 font-bold tracking-tight">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm md:text-base text-neutral-700 italic">{subtitle}</p> : null}
    </div>
  );
}
