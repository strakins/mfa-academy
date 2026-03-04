import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function getStudentCohortId(userId: string): Promise<string | null> {
  await connectDB();
  const u = await User.findById(userId).select("role student").lean();
  const cohortId = (u as any)?.student?.cohortId;
  return cohortId ? String(cohortId) : null;
}
