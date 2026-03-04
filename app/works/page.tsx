import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/Cohort";
import { Work } from "@/models/Work";
import CohortCard from "./ui/CohortCard";

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

  // ✅ Only cohorts that have works + collect a few images for each cohort card background
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
        images: { $slice: ["$images", 6] }, // keep it small for performance
      },
    },
    { $sort: { worksCount: -1 } },
  ]);

  const cohortIds = rows.map((r) => r._id);

  // fetch cohort details
  const cohorts = await Cohort.find({ _id: { $in: cohortIds } })
    .select("title year batch description")
    .lean();

  // map cohortId -> images/count
  const map = new Map<string, { images: string[]; worksCount: number }>();
  for (const r of rows) {
    map.set(String(r._id), { images: r.images || [], worksCount: r.worksCount || 0 });
  }

  // merge
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

  // group by year
  const grouped: Record<string, CohortWithImages[]> = {};
  for (const c of merged) {
    const key = String(c.year);
    grouped[key] = grouped[key] || [];
    grouped[key].push(c);
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="bg-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h1 className="text-2xl font-extrabold">Student Works</h1>
          <p className="mt-2 text-sm text-ash-200">
            Explore published cohort works by year. Click a cohort to view all designs in full screen.
          </p>
          <p className="mt-3 text-xs text-ash-300">
            Showing {merged.length} cohorts with uploaded works.
          </p>
        </div>

        {merged.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-ash-200">
            No cohort works have been uploaded yet.
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {years.map((year) => (
              <section key={year}>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-xl font-extrabold">{year}</h2>
                  <span className="text-xs text-ash-200">{grouped[year].length} cohorts</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[year].map((c, idx) => (
                    <CohortCard
                      key={c._id}
                      cohortId={c._id}
                      title={c.title}
                      subtitle={`${c.batch} • ${c.year} • ${c.worksCount} works`}
                      description={c.description || "View designs from this cohort."}
                      images={c.images}
                      index={idx}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}