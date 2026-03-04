import { connectDB } from "@/lib/db";
import { Feedback } from "@/models/Feedback";
import { Review } from "@/models/Review";

export async function getAllFeedback() {
  await connectDB();
  return Feedback.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email role")
    .lean();
}

export async function getAllReviews() {
  await connectDB();
  return Review.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email role")
    .lean();
}
