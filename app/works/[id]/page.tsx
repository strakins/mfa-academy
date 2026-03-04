import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/Cohort";
import { Work } from "@/models/Work";
import { Types } from "mongoose";
import CohortGalleryClient from "./ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CohortWorksByIdPage({ params }: { params: { id: string } }) {
  await connectDB();

  if (!Types.ObjectId.isValid(params.id)) {
    return <div className="p-10 text-white">Invalid cohort ID.</div>;
  }

  const cohort = await Cohort.findById(params.id).lean();
  if (!cohort) return <div className="p-10 text-white">Cohort not found.</div>;

  const works = await Work.find({ cohortId: (cohort as any)._id }).sort({ createdAt: -1 }).lean();

  return (
    <CohortGalleryClient
      cohort={{
        id: String((cohort as any)._id),
        title: (cohort as any).title,
        year: (cohort as any).year,
        batch: (cohort as any).batch,
        description: (cohort as any).description || "",
      }}
      works={(works as any[]).map((w) => ({
        id: String(w._id),
        title: w.title || "Student Work",
        category: w.category || "",
        studentName: w.studentName || "",
        description: w.description || "",
        imageUrl: w.image?.url,
      }))}
    />
  );
}