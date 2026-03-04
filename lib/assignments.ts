import { connectDB } from "@/lib/db";
import { Assignment } from "@/models/Assignment";

export async function getAssignmentsForCohort(cohortId: string) {
  await connectDB();
  return Assignment.find({ cohortId }).sort({ createdAt: -1 }).lean();
}

export async function getAssignmentsForInstructor(instructorId: string) {
  await connectDB();
  return Assignment.find({ createdBy: instructorId }).sort({ createdAt: -1 }).populate("cohortId", "name").lean();
}
