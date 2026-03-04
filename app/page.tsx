
"use client";

import Container from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/FeatureCard";
import { StepCard } from "@/components/StepCard";
import { FAQItem } from "@/components/FAQItem";
import { GalleryCard } from "@/components/GalleryCard";
import { CTABanner } from "@/components/CTABanner";
import {faqs} from '../data/faqs'
import {outcomes} from '../data/outcomes'
import {steps} from '../data/steps'
import {galleryImages} from '../data/galleryImages'
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Head from "next/head";
import FinalCTABAnner from "@/components/FinalCTABAnner";
import ReviewsCarousel from "@/components/ReviewsCarousel";




const HERO_IMAGE = "/mfa_studio.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Michelle Fashion Academy | Learn Fashion Design & Build Your Portfolio</title>
        <meta name="description" content="Join Michelle Fashion Academy's 4 annual cohorts. Learn hands-on fashion design from beginner to advanced. Build a portfolio, get mentorship, and launch your fashion career. Registration: ₦10,000." />
        <meta name="keywords" content="fashion school, fashion design, sewing classes, portfolio development, fashion mentorship, Nigeria fashion school" />
        <meta property="og:title" content="Michelle Fashion Academy - Learn Fashion Design" />
        <meta property="og:description" content="Transform your passion for fashion into a career. Hands-on training, portfolio development, and mentorship." />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://michellefashionacademy.com" />
      </Head>

      <div className="text-black">
        {/* HERO SECTION - Enhanced with better SEO content */}
        <section className="relative overflow-hidden" aria-label="Hero section">
          {/* Background layers remain the same */}
          <div className="absolute inset-0 bg-navy-900 luxury-pattern opacity-100" />
          <div className="absolute inset-0">
            <Image
              src={HERO_IMAGE}
              alt="Michelle Fashion Academy - Professional fashion design training studio"
              fill
              priority
              className="object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/75 via-navy-900/55 to-navy-900/90" />
          </div>

          <Container>
            <div className="relative py-14 md:py-20">
              <div className="grid gap-10 md:grid-cols-2 md:items-center">
                {/* Left content - Enhanced with better copy */}
                <motion.div initial="hidden" animate="show" variants={fadeUp}>
                  <Reveal>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-ash-100 backdrop-blur">
                      <Sparkles className="h-4 w-4 text-gold-300" />
                      Since 2020 • 100+ Graduates
                    </span>
                  </Reveal>

                  <Reveal delay={0.05}>
                    <h1 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                      Transform Your Passion for{" "}
                      <span className="text-gold-300">Fashion</span> Into a 
                      <span className="text-gold-300"> Career</span>
                    </h1>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <p className="mt-4 max-w-xl text-ash-200 text-sm md:text-lg">
                      Join Nigeria's premier fashion academy. 
                      From complete beginner to industry ready professional learn hands-on 
                      techniques, build stunning portfolio and launch your fashion career 
                      with confidence.
                    </p>
                  </Reveal>
                  

                  {/* CTA Buttons */}
                  <Reveal delay={0.22}>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:bg-gold-400 active:scale-[0.98]"
                        aria-label="Apply to Michelle Fashion Academy"
                      >
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href="/works"
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 active:scale-[0.98]"
                      >
                        View Gallery
                      </Link>
                    </div>
                  </Reveal>
                  
                </motion.div>
               
              </div>
            </div>
          </Container>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-ash-30" />
        </section>

        {/* OUTCOMES SECTION - Enhanced */}
        <section className="py-14" aria-label="Learning outcomes">
          <Container>
            <SectionTitle
              title="Your Journey to Fashion Excellence"
              subtitle="Our comprehensive curriculum ensures you develop both creative and technical skills demanded by the fashion industry"
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {outcomes.map((outcome, idx) => (
                <FeatureCard key={outcome.title} {...outcome} index={idx} description={outcome.desc} />
              ))}
            </div>

            {/* CTA band - Using reusable component */}
            <Reveal delay={0.18}>
              <div className="mt-10">
                <CTABanner
                  title="Ready to Start Your Fashion Journey?"
                  description="Apply in under 2 minutes. Our team will guide you through every step."
                  buttonText="Apply Now"
                  buttonLink="/apply"
                  variant="dark"
                />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* GALLERY PREVIEW - Enhanced */}
        <section className="bg-ash-100 py-14" aria-label="Student work gallery">
          <Container>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 md:text-3xl">
                    See What Our Students Create
                  </h2>
                  <p className="mt-2 text-sm text-ash-600 md:text-base">
                    From first stitches to complete collections — explore the incredible 
                    work of our talented students across all cohorts.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <Link
                  href="/cohorts"
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 active:scale-[0.98]"
                  aria-label="View all student cohorts"
                >
                  Explore All Galleries <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {galleryImages.map((src, i) => (
                <GalleryCard key={`${src}-${i}`} src={src} index={i} />
              ))}
            </div>
          </Container>
        </section>

        {/* HOW IT WORKS - Enhanced */}
        <section className="py-14" aria-label="Admission process">
          <Container>
            <SectionTitle 
              title="Your Path to Fashion Success" 
              subtitle="A straightforward 4-step journey from application to launching your fashion career" 
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {steps.map((step, idx) => (
                <StepCard
                  key={step.title}
                  stepNumber={idx + 1}
                  title={step.title}
                  description={step.desc}
                  delay={idx * 0.05}
                />
              ))}
            </div>
          </Container>
        </section>

        {/* REVIEWS SECTION - Enhanced */}
        <section className="py-14" aria-label="Student reviews">
          <Container>
            <SectionTitle 
              title="Success Stories from Our Graduates" 
              subtitle="Hear from students who transformed their passion into thriving fashion careers" 
            />
            <div className="mt-6">
              <ReviewsCarousel />
            </div>
          </Container>
        </section>

        {/* FAQ SECTION - Enhanced with more questions */}
        <section className="py-14" aria-label="Frequently asked questions">
          <Container>
            <SectionTitle 
              title="Got Questions? We've Got Answers" 
              subtitle="Everything you need to know about starting your fashion education at MFA" 
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((faq, idx) => (
                <FAQItem
                  key={faq.q}
                  question={faq.q}
                  answer={faq.a}
                  delay={idx * 0.04}
                />
              ))}
            </div>

            {/* Final CTA */}
            <FinalCTABAnner />
          </Container>
        </section>
      </div>
    </>
  );
}

