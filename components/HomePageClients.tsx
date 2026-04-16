"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles, ArrowRight, ArrowUpRight,
  CheckCircle2, Star, ChevronRight,
  Eye,
} from "lucide-react";
import Container from "@/components/Container";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { faqs } from "@/data/faqs";
import { outcomes } from "@/data/outcomes";
import { steps } from "@/data/steps";
import FinalCTABAnner from "./FinalCTABAnner";

// ─── tiny animation helpers ──────────────────────────────────────────────────

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

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="" />
      <span className="text-[11px] uppercase tracking-[0.3em] text-gold-400 font-semibold">
        {text}
      </span>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function HomePageClient({ 
  heroImage,
  galleryImages,
}: {
  heroImage: string;
  galleryImages: string[];
}) {
  return (
    <div
      className="bg-navy-900 text-white"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >

      <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">

        {/* Left pane */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-20 lg:w-[52%] lg:px-16 xl:px-24">

          {/* Subtle grain overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/8 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-[#C9A84C]">
                <Sparkles className="h-3 w-3" />
                Since 2020 · 100+ Graduates
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="mt-6 text-5xl font-black leading-[1.0] tracking-tight text-white md:text-6xl xl:text-7xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Turn Your
              <br />
              <em className="text-[#C9A84C] not-italic">Fashion</em>
              <br />
              Vision Into
              <br />
              <em className="italic font-light text-white/60">Reality.</em>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="mt-6 max-w-md text-base font-light leading-relaxed text-white"
            >
              Nigeria's premier fashion academy with focus on hands-on training from complete
              beginner to industry ready professional. Build your portfolio, find
              your voice, launch your career.
            </motion.p>

            {/* Stats row */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="mt-8 flex gap-8"
            >
              {[
                { n: "4", label: "Cohorts" },
                { n: "100+", label: "Graduates" },
                { n: "5★", label: "Avg. rating" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-2xl font-black text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.n}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-widest text-white/70">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link
                href="/courses"
                className="group inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-semibold text-[#0C0B09] transition-all hover:bg-gold-500 hover:text-white active:scale-[0.98]"
              >
                Apply Now
                <ArrowRight className="h-4 w-4 transition-transform  group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/works"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-gold-300 hover:text-white active:scale-[0.98]"
              >
                View Gallery
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom left decoration */}
          <div className="absolute bottom-8 left-8 hidden lg:flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-white">
            <div className="h-px w-5 bg-white" />
            Michelle Fashion Academy
          </div>
        </div>

        {/* Right pane — full-bleed hero image, changes every load */}
        <div className="relative lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[52%] h-72 sm:h-96">
          <Image
            src={heroImage}
            alt="Michelle Fashion Academy student work"
            fill
            priority
            className="object-cover object-top"
          />
          {/* Left fade into dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-ash-500/40 via-gold-600/20 to-transparent lg:block hidden" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0C0B09] to-transparent lg:hidden" />

          {/* Floating badge on image */}
          <div className="absolute bottom-8 right-8 hidden lg:block">
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-xs text-white max-w-[140px] leading-snug">
                "Best decision I ever made for my career."
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-widest text-white/60">
                — MFA Graduate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          OUTCOMES — what you'll learn
      ════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <Container>
          <FadeUp>
            <SectionLabel text="The Curriculum" />
            <h2
              className="text-4xl font-black text-white md:text-5xl max-w-xl leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Journey to Fashion Excellence
            </h2>
            <p className="mt-4 max-w-lg text-base font-light text-white/70 leading-relaxed">
              A comprehensive curriculum that builds both creative vision and the technical skills the industry demands.
            </p>
          </FadeUp>

          <div className="mt-14 grid gap-px bg-ash-300 rounded-3xl overflow-hidden sm:grid-cols-2">
            {outcomes.map((outcome, idx) => (
              <FadeUp key={outcome.title} delay={idx * 0.07}>
                <div className="group bg-ash-600 p-8 transition-colors hover:bg-ash-700 h-full">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-gold-200">
                    <CheckCircle2 className="h-5 w-5 text-gold-300" />
                  </div>
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {outcome.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-white/60">
                    {outcome.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* CTA band */}
          <FadeUp delay={0.2} className="mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-gold-300 px-8 py-6">
              <div>
                <p className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Ready to Start Your Fashion Journey?
                </p>
                <p className="text-sm text-white/45 mt-1">Apply in under 2 minutes. Our team guides every step.</p>
              </div>
              <Link
                href="/apply"
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-gold-300 px-6 py-3 text-sm font-semibold text-[#0C0B09] transition hover:bg-[#e0bc5a]"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════
          GALLERY — masonry grid, random DB images
      ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-ash-600 border-t border-white/95">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
            <FadeUp>
              <SectionLabel text="Student Works" />
              <h2
                className="text-4xl font-black text-white md:text-5xl leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                See What Our
                <br />
                <em className="italic font-light text-white/70">Students Create</em>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link
                href="/works"
                className="inline-flex items-center gap-2 rounded-full bg-gold-300 text-navy-900 px-5 py-2.5 text-sm font-medium transition hover:border-white/25 hover:text-white"
              >
                Explore all galleries <ChevronRight className="h-4 w-4" />
              </Link>
            </FadeUp>
          </div>

          {/* Masonry-style columns — images from DB */}
          {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {galleryImages.map((src, i) => (
                    <FadeUp key={`${src}-${i}`} delay={i * 0.04}>
                        <Link
                        href="/works"
                        className="group relative block aspect-[3/4] overflow-hidden rounded-2xl
                            border border-white/10 bg-white/4
                            transition-all duration-350 ease-out
                            hover:-translate-y-1 hover:border-[#C9A84C]/40
                            hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                        >
                        {/* Image */}
                        <Image
                            src={src}
                            alt={`Student work ${i + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
                        />

                        {/* Bottom gradient + glass label — reveal on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0906]/80 via-[#0a0906]/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="absolute bottom-0 left-0 right-0 translate-y-1.5 p-3.5 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/10 px-2.5 py-1 text-[11px] tracking-wide text-white/85 backdrop-blur-md">
                            <Eye className="h-2.5 w-2.5" />
                            View detail
                            </span>
                        </div>

                        </Link>
                    </FadeUp>
                    ))}
                </div>
                ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="aspect-[3/4] animate-pulse rounded-2xl bg-white/5"
                    />
                    ))}
                </div>
            )}
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS — numbered steps
      ════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <Container>
          <FadeUp>
            <SectionLabel text="The Process" />
            <h2
              className="text-4xl font-black text-white md:text-5xl leading-tight max-w-md"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Path to Fashion Success
            </h2>
          </FadeUp>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {steps.map((step, idx) => (
              <FadeUp key={step.title} delay={idx * 0.08}>
                <div className="group relative rounded-3xl border border-white/8 bg-[#0F0E0B] p-8 transition hover:border-[#C9A84C]/20 hover:bg-[#141210]">
                  {/* Step number — large ghost text */}
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-gold-400 text-gold-400">
                      <span className="text-sm font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {idx + 1}
                      </span>
                    </div>

                    <h3
                      className="text-md md:text-xl font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[12px] md:text-sm font-light leading-relaxed text-white/70">
                    {step.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════
          REVIEWS
      ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#0F0E0B] border-t border-white/5">
        <Container>
          <FadeUp>
            <SectionLabel text="Testimonials" />
            <h2
              className="text-4xl font-black text-white md:text-5xl leading-tight max-w-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Success Stories from
              <br />
              <em className="italic font-light text-white/50">Our Graduates</em>
            </h2>
          </FadeUp>
          <div className="mt-12">
            <ReviewsCarousel />
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr]">
            {/* Left sticky label */}
            <FadeUp>
              <SectionLabel text="FAQ" />
              <h2
                className="text-4xl font-black text-white md:text-5xl leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Got Questions?
                <br />
                <em className="italic font-light text-white/50">We've Got Answers.</em>
              </h2>
              <p className="mt-4 text-sm font-light text-white/40 leading-relaxed max-w-xs">
                Everything you need to know before starting your fashion education at MFA.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:underline"
              >
                Still have questions? Contact us <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </FadeUp>

            {/* Right accordion */}
            <div className="divide-y divide-white/8">
              {faqs.map((faq, idx) => (
                <FaqAccordion key={faq.q} question={faq.q} answer={faq.a} delay={idx * 0.04} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════ */}
      <FinalCTABAnner />

      
    </div>
  );
}

// ─── Simple accordion for FAQ ────────────────────────────────────────────────
function FaqAccordion({
  question,
  answer,
  delay,
}: {
  question: string;
  answer: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.details
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="group py-5 cursor-pointer"
    >
      <summary className="flex items-center justify-between list-none text-base font-semibold text-white/85 hover:text-white transition-colors">
        <span style={{ fontFamily: "'Playfair Display', serif" }}>{question}</span>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#C9A84C] transition-transform duration-200 group-open:rotate-90 ml-4" />
      </summary>
      <p className="mt-3 text-sm font-light leading-relaxed text-white/45 pr-8">{answer}</p>
    </motion.details>
  );
}
