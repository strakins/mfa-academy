import Reveal from "@/components/Reveal";
import { ArrowBigLeft, ArrowRight, ArrowRightCircle, ArrowRightIcon } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  delay: number;
}



export function FAQItem({ question, answer, delay }: FAQItemProps) {
  return (
    <Reveal delay={delay}>
      <details className="group rounded-3xl border border-ash-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer flex justify-between list-none text-[12px] md:text-base font-bold text-navy-900">
          {question}
          <span className="float-right text-ash-500 w-3 h-3 transition group-open:rotate-90">< ArrowRightCircle /></span>
        </summary>
        <p className="mt-3 text-sm text-ash-600">{answer}</p>
      </details>
    </Reveal>
  );
}