import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";

export async function getCourses() {
  await connectDB();
  return Course.find({}).sort({ createdAt: -1 }).lean();
}

export async function getCourseById(id: string) {
  await connectDB();
  return Course.findById(id).lean();
}
