import Reveal from "@/components/Reveal";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  delay: number;
}

export function StepCard({ stepNumber, title, description, delay }: StepCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="rounded-3xl border border-ash-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500 text-sm font-extrabold text-navy-900">
            {stepNumber}
          </span>
          <p className="text-lg font-bold text-navy-900">{title}</p>
        </div>
        <p className="mt-3 text-sm text-ash-600">{description}</p>
      </div>
    </Reveal>
  );
}