import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/Cohort";

export default async function AdminCohortsPage() {
  await connectDB();
  const cohorts = await Cohort.find({}).sort({ year: -1, batch: 1, createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 backdrop-blur">
        <h1 className="text-xl font-extrabold text-white">Admin • Cohorts</h1>
        <p className="mt-1 text-sm text-ash-200">
          Create cohorts (grouped by year) and upload student works per cohort.
        </p>
      </div>

      {/* Create form - you can wire it to createCohort action with a client component if you prefer */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 backdrop-blur">
        <h2 className="text-sm font-bold text-white">Create new cohort</h2>
        <p className="mt-1 text-xs text-ash-200">Use Q1–Q4 to represent the batch in a year.</p>

        {/* If you already use server actions in a client form, move this into a client component. */}
        <p className="mt-4 text-sm text-ash-200">
          (Next step) Use your existing admin form pattern to submit to <code>createCohort</code>.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 bg-slate-900">
        {cohorts.map((c: any) => (
          <div key={String(c._id)} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white">{c.title}</p>
                <p className="mt-1 text-xs text-ash-200">
                  {c.year} • {c.batch} • {c.isPublished ? "Published" : "Hidden"}
                </p>
              </div>
              <Link
                href={`/admin/cohortworks/${c._id}/works`}
                className="rounded-xl bg-gold-500 px-4 py-2 text-xs font-semibold text-navy-900 hover:bg-gold-400"
              >
                Upload Works
              </Link>
            </div>

            <p className="mt-3 text-sm text-ash-200 line-clamp-2">{c.description || "—"}</p>

            <div className="mt-4">
              <Link
                href={`/works/${c.slug}`}
                className="text-xs font-semibold text-gold-300 hover:underline"
              >
                View public cohort page →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}