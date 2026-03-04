import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/CohortsWorks";
import { Work } from "@/models/Work";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const year = searchParams.get("year");
  const batch = searchParams.get("batch");
  const category = searchParams.get("category");
  const cohortSlug = searchParams.get("cohort");

  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(24, Math.max(6, Number(searchParams.get("limit") || 12)));
  const skip = (page - 1) * limit;

  let cohortId: any = null;

  if (cohortSlug) {
    const cohort = await Cohort.findOne({ slug: cohortSlug, isPublished: true }).lean();
    if (!cohort) return NextResponse.json({ items: [], total: 0 });
    cohortId = (cohort as any)._id;
  }

  const query: any = {};
  if (cohortId) query.cohortId = cohortId;
  if (category) query.category = category;

  // year/batch filtering happens via cohort lookup
  if (!cohortId && (year || batch)) {
    const cohortQuery: any = { isPublished: true };
    if (year) cohortQuery.year = Number(year);
    if (batch) cohortQuery.batch = batch;
    const cohorts = await Cohort.find(cohortQuery).select("_id").lean();
    query.cohortId = { $in: cohorts.map((c: any) => c._id) };
  }

  const [items, total] = await Promise.all([
    Work.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Work.countDocuments(query),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}