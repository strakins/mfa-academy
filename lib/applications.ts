import { connectDB } from "@/lib/db";
import { Application } from "@/models/Application";

export async function getMyApplications(userId: string) {
  await connectDB();
  return Application.find({ userId })
    .sort({ createdAt: -1 })
    .populate("cohortId", "name year batch status")
    .populate("courseId", "title tuitionNgn registrationFeeNgn durationMonths")
    .lean();
}
