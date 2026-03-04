import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function getAllUsers() {
  await connectDB();
  return User.find({})
    .sort({ createdAt: -1 })
    .populate("student.cohortId", "name year batch status")
    .populate("student.courseId", "title durationMonths tuitionNgn")
    .lean();
}
