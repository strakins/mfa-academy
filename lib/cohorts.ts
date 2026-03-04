// src/lib/cohorts.ts
import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/Cohort";

export async function getCohorts() {
  await connectDB();
  // populate course titles for display
  return Cohort.find({})
    .sort({ year: -1, batch: 1 })
    .populate("availableCourseIds", "title slug")
    .lean();
}
