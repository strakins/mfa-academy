import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/Cohort";
// import AdminWorkUploader from "./ui";

export default async function AdminCohortWorksPage({ params }: { params: { id: string } }) {
  await connectDB();
  const cohort = await Cohort.findById(params.id).lean();
  if (!cohort) return <div className="text-white">Cohort not found.</div>;

  // return <AdminWorkUploader cohortId={String(cohort._id)} cohortTitle={cohort.title} />;
}