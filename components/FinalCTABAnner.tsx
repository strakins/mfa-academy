import Link from "next/link"
import Reveal from "./Reveal"
import { ArrowRight } from "lucide-react"
import Container from "./Container";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FinalCTABAnner = () => {

  function SectionLabel({ text }: { text: string }) {
    return (
      <div className="flex items-center gap-3 mb-4">
        <div className="" />
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] font-semibold">
          {text}
        </span>
      </div>
    );
  }
  
  function FadeUp({
      children,
      delay = 0,
      className = "",
    }: {
      children: React.ReactNode;
      delay?: number;
      className?: string;
    }) {
      const ref = useRef(null);
      const inView = useInView(ref, { once: true, margin: "-60px" });
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
          className={className}
        >
          {children}
        </motion.div>
      );
  }
  return (
    <Reveal delay={0.2}>
      <section className="py-24 border-t border-white/5">
        <Container>
          <FadeUp>
            <div className="relative overflow-hidden rounded-3xl border border-[#C9A84C]/20 bg-gradient-to-br from-[#1A1710] to-[#0C0B09] px-8 py-16 text-center md:px-16">
              {/* Decorative rings */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                <div className="h-[400px] w-[400px] rounded-full border border-[#C9A84C]/5" />
                <div className="absolute h-[600px] w-[600px] rounded-full border border-[#C9A84C]/3" />
              </div>

              <SectionLabel text="Enroll Today" />
              <h2
                className="mt-4 text-4xl font-black text-white md:text-6xl leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                The April 2026
                <br />
                <span className="text-[#C9A84C]">Batch Is Open.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base font-light text-white/50 leading-relaxed">
                DM <span className="text-[#C9A84C] font-semibold">"FASHION"</span> or WhatsApp us to enroll.
                Registration fee: ₦10,000. Limited spots available.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-sm font-bold text-[#0C0B09] transition hover:bg-[#e0bc5a] active:scale-[0.98]"
                >
                  Apply Now — ₦10,000 <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/works"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  View Student Portfolios
                </Link>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>

    </Reveal>
  )
}

export default FinalCTABAnner
