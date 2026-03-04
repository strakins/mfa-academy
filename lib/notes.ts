import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";

export async function getNotesForCohort(cohortId: string) {
  await connectDB();
  return Note.find({ cohortId }).sort({ createdAt: -1 }).lean();
}

export async function getNotesForInstructor(instructorId: string) {
  await connectDB();
  return Note.find({ uploadedBy: instructorId }).sort({ createdAt: -1 }).populate("cohortId", "name").lean();
}
