"use client";

import Image from "next/image";
import { CalendarDays, Users, Award, Heart, MapPin, Scissors, Ruler, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import FinalCTABAnner from "@/components/FinalCTABAnner";

const heroImages = ["/mfa_ceo1.jpeg", "/mfa_ceo2.jpeg", "/mfa_ceo.jpeg"];

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ash-700 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="mb-4 inline-flex rounded-full bg-white/20 p-3">{icon}</div>
        <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-ash-100">{desc}</p>
    </div>
  );
}

function TimelineItem({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 rounded-full bg-navy-100 p-2 ">
        <div className="h-2 w-2 rounded-full bg-navy-700 " />
      </div>
      <div>
        <h3 className="font-semibold text-black">{title}</h3>
        <p className="mt-1 text-ash-600 ">{desc}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [index, setIndex] = useState(0);

  // simple, clean autoplay
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);

  const hero = useMemo(() => heroImages[index], [index]);

  return (
    <div className="min-h-screen bg-white text-black ">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] md:h-[78vh]">
          {/* Background image */}
          <Image
            key={hero}
            src={hero}
            alt="Michelle Fashion Academy"
            fill
            priority
            sizes="100vw" 
            className="object-cover"
            style={{ opacity: 0.7 }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/35 to-navy-900/20" />

          {/* Content */}
          <div className="relative mx-auto flex h-full max-w-6xl items-center px-4">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-semibold text-white ring-1 ring-white/15">
                <Sparkles className="h-3 w-3 md:h-4 md:h-4 text-gold-300" />
                Creativity • Excellence • Transformation
              </span>

              <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-white md:text-6xl">
                Welcome to Michelle Fashion Academy
              </h1>
              <p className="mt-4 text-sm text-ash-100 md:text-xl">
                A home of creativity, excellence, and transformation.
              </p>

              <div className="mt-7 flex gap-3">
                <Button className="w-28 text-center" href="/apply" >Apply</Button>
                <Button href="/courses" variant="secondary" >View Courses</Button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-10 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:gap-12">
          <div>
            <div className="sticky top-24">
              <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
                A Message from CEO
              </h2>

              <div className="mb-8 flex items-center gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-ash-200 bg-ash-100 ">
                  <Image
                    src="/mfa_ceo.jpeg"
                    alt="Kehinde Akpobome"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 md:text-xl">
                    Kehinde Akpobome
                  </h3>
                  <p className="text-sm text-ash-600  md:text-base">
                    Founder & Lead Instructor
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-ash-200 bg-ash-50 p-6 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm italic leading-relaxed text-ash-700  md:text-base">
                  “We believe that fashion is more than fabric and thread - it’s art, expression, and identity.”
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-justify">
            <p className="text-base leading-relaxed text-ash-700  md:text-lg">
              Welcome to Michelle Fashion Academy — a home of creativity, excellence, and transformation. We&apos;re
              thrilled to have you join our growing family of passionate, purpose-driven designers.
            </p>
            <p className="text-base leading-relaxed text-ash-700  md:text-lg">
              At MFA, we believe that fashion is more than fabric and thread — it&apos;s art, expression, and identity.
              Whether you&apos;re starting as a beginner or building on existing skills, you&apos;re in the right place
              to grow, explore, and refine your craft.
            </p>
            <p className="text-base leading-relaxed text-ash-700  md:text-lg">
              This handbook has been thoughtfully prepared to guide you through your journey here. Inside, you&apos;ll
              find everything you need to succeed — from our core values and class expectations to practical tips that
              will help you get the best out of your training.
            </p>

            <div className="rounded-2xl border border-ash-200 bg-ash-100 p-7 ">
              <p className="leading-relaxed text-black text-sm md:text-lg">
                “As you take this exciting step, remember: consistency, curiosity, and commitment are the keys to
                mastery. Stay open to learning, challenge yourself, and never stop creating.”
              </p>
            </div>

            <p className="text-base leading-relaxed text-ash-700  md:text-lg">
              We can&apos;t wait to see the magic you&apos;ll bring to life through your hands and imagination.
            </p>

            <p className="pt-4 text-sm italic text-black md:text-lg">
              With love and best wishes,
              <br />
              <span className="font-semibold">KEHINDE Akpobome</span>
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-8 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-3xl font-extrabold tracking-tight text-black md:text-4xl">
            Our Core Values
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <ValueCard
              icon={<Heart className="h-8 w-8 text-white" />}
              title="Creativity"
              desc="Nurturing original thinking and innovative design solutions."
            />
            <ValueCard
              icon={<Award className="h-8 w-8 text-white" />}
              title="Excellence"
              desc="Striving for the highest standards in craftsmanship and design."
            />
            <ValueCard
              icon={<Users className="h-8 w-8 text-white" />}
              title="Community"
              desc="Building a supportive network of passionate designers."
            />
            <ValueCard
              icon={<CalendarDays className="h-8 w-8 text-white" />}
              title="Transformation"
              desc="Empowering personal and professional growth through fashion."
            />
          </div>
        </div>
      </section>

      {/* Studio / Journey */}
      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
              Your Journey with Us
            </h2>

            <div className="space-y-5">
              <TimelineItem
                title="Beginner-Friendly"
                desc="Start from scratch with our comprehensive foundation courses."
              />
              <TimelineItem
                title="Expert Guidance"
                desc="Learn from industry professionals with years of experience."
              />
              <TimelineItem
                title="Practical Training"
                desc="Hands-on experience with professional tools and techniques."
              />
              <TimelineItem
                title="Portfolio Development"
                desc="Build a professional portfolio to launch your career."
              />
            </div>

            {/* Extra info (requested: “show more information”) */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-ash-200 bg-ash-100 p-4 ">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gold-600" />
                  <p className="text-sm font-semibold">Location</p>
                </div>
                <p className="mt-1 text-sm text-ash-600 ">Ile-Ife (and more)</p>
              </div>

              <div className="rounded-2xl border border-ash-200 bg-ash-100 p-4 ">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gold-600" />
                  <p className="text-sm font-semibold">Batches</p>
                </div>
                <p className="mt-1 text-sm text-ash-600 ">4 per year (Q1–Q4)</p>
              </div>

              <div className="rounded-2xl border border-ash-200 bg-ash-100 p-4 ">
                <div className="flex items-center gap-3">
                  <Scissors className="h-5 w-5 text-gold-600 " />
                  <p className="text-sm font-semibold">Hands-On</p>
                </div>
                <p className="mt-1 text-sm text-ash-600 ">Cutting, sewing & finishing</p>
              </div>

              <div className="rounded-2xl border border-ash-200 bg-ash-100 p-4 ">
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-gold-600" />
                  <p className="text-sm font-semibold">Skill Growth</p>
                </div>
                <p className="mt-1 text-sm text-ash-600 ">From basics to advanced mastery</p>
              </div>
            </div>
          </div>

          {/* Studio image improved */}
          <div className="relative overflow-hidden rounded-3xl border border-ash-200 bg-ash-100 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="relative aspect-[4/3]">
              <Image
                src="/mfa_studio.jpeg"
                alt="MFA Studio"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="object-cover"
                priority={false}
              />
              {/* subtle overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/35 via-transparent to-transparent" />

              {/* Overlay “more information” */}
              <div className="hidden md:block">
                <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-2 ">
                  <div className="rounded-2xl bg-white/85 p-4 backdrop-blur ">
                    <p className="text-xs font-semibold text-black ">Studio Focus</p>
                    <p className="mt-1 text-sm font-bold text-black ">
                      Practical Learning
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/85 p-4 backdrop-blur">
                    <p className="text-xs font-semibold text-navy-900 ">Outcome</p>
                    <p className="mt-1 text-sm font-bold text-navy-900" >
                      Portfolio-Ready Projects
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2 border-t border-ash-200 p-5 ">
              <p className="text-sm font-semibold text-black">Inside the Studio</p>
              <p className="text-sm text-ash-600 ">
                Students learn with guided practice sessions and structured projects designed to build confidence and
                mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <FinalCTABAnner />
    </div>
  );
}
