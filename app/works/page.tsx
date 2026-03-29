import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/Cohort";
import { Work } from "@/models/Work";
import CohortSection from "./ui/CohortSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CohortWithImages = {
  _id: string;
  title: string;
  year: number;
  batch: string;
  description?: string;
  images: string[];
  worksCount: number;
};

export default async function WorksPage() {
  await connectDB();

  const rows = await Work.aggregate([
    { $match: { "image.url": { $exists: true, $ne: "" } } },
    {
      $group: {
        _id: "$cohortId",
        worksCount: { $sum: 1 },
        images: { $push: "$image.url" },
      },
    },
    {
      $project: {
        worksCount: 1,
        images: { $slice: ["$images", 20] },
      },
    },
    { $sort: { worksCount: -1 } },
  ]);

  const cohortIds = rows.map((r) => r._id);

  const cohorts = await Cohort.find({ _id: { $in: cohortIds } })
    .select("title year batch description")
    .lean();

  const map = new Map<string, { images: string[]; worksCount: number }>();
  for (const r of rows) {
    map.set(String(r._id), { images: r.images || [], worksCount: r.worksCount || 0 });
  }

  const merged: CohortWithImages[] = cohorts
    .map((c: any) => {
      const extra = map.get(String(c._id));
      if (!extra || !extra.images?.length) return null;
      return {
        _id: String(c._id),
        title: c.title,
        year: Number(c.year),
        batch: c.batch,
        description: c.description || "",
        images: extra.images,
        worksCount: extra.worksCount,
      };
    })
    .filter(Boolean) as CohortWithImages[];

  // Pick a random hero image from all available images
  const allImages = merged.flatMap((c) => c.images);
  const heroImage = allImages.length > 0
    ? allImages[Math.floor(Math.random() * allImages.length)]
    : null;

  const grouped: Record<string, CohortWithImages[]> = {};
  for (const c of merged) {
    const key = String(c.year);
    grouped[key] = grouped[key] || [];
    grouped[key].push(c);
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-['Cormorant_Garamond',serif]">

      {/* ── HERO ── */}
      <div className="relative h-[75vh] min-h-[520px] overflow-hidden">
        {/* Static background — changes on each server render */}
        {heroImage ? (
          <img
            src={heroImage}
            alt="Featured work"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 to-black" />
        )}

        {/* Dark overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-transparent" />

        {/* Academy logo mark */}
        <div className="absolute left-6 top-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
            <span className="font-['Playfair_Display',serif] text-lg font-black tracking-tight">M</span>
          </div>
          <span className="text-xs font-light uppercase tracking-[0.25em] text-white/70">
            Michelle Fashion Academy
          </span>
        </div>

        {/* Hero text — bottom-left */}
        <div className="absolute bottom-0 left-0 px-6 pb-12 md:px-12">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.3em] text-amber-400/90">
            Student Portfolio
          </p>
          <h1 className="font-['Playfair_Display',serif] text-5xl font-black leading-none md:text-7xl lg:text-8xl">
            Works
            <br />
            <em className="font-light italic text-white/60">Gallery</em>
          </h1>
          <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-white/60">
            Designs crafted by our graduates — each stitch a story, each cohort a chapter.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px w-10 bg-amber-400/60" />
            <span className="text-xs text-white/40 uppercase tracking-widest">
              {merged.length} cohorts · {allImages.length}+ works
            </span>
          </div>
        </div>

        {/* Decorative side label */}
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 -rotate-90 items-center gap-2 lg:flex">
          <div className="h-px w-8 bg-white/20" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">
            {new Date().getFullYear()}
          </span>
          <div className="h-px w-8 bg-white/20" />
        </div>
      </div>

      {/* ── COHORT SECTIONS ── */}
      <div className="px-4 py-14 md:px-8 lg:px-12">
        {merged.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/40">
            <p className="font-['Playfair_Display',serif] text-2xl italic">No works uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {years.map((year) => (
              <div key={year}>
                {/* Year heading */}
                <div className="mb-8 flex items-center gap-6">
                  <span className="font-['Playfair_Display',serif] text-6xl font-black leading-none text-white/10 md:text-8xl">
                    {year}
                  </span>
                  <div>
                    <div className="h-px w-16 bg-amber-400/60 mb-2" />
                    <p className="text-xs uppercase tracking-widest text-white/40">
                      {grouped[year].length} {grouped[year].length === 1 ? "cohort" : "cohorts"}
                    </p>
                  </div>
                </div>

                {/* Cohorts for this year */}
                <div className="space-y-14">
                  {grouped[year].map((cohort) => (
                    <CohortSection key={cohort._id} cohort={cohort} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
