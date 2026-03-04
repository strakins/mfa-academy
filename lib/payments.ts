import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payments";

export async function getMyPayments(userId: string) {
  await connectDB();
  return Payment.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "applicationId",
      populate: [
        { path: "cohortId", select: "name year batch" },
        { path: "courseId", select: "title tuitionNgn" },
      ],
    })
    .lean();
}

export async function getAllPayments() {
  await connectDB();
  return Payment.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email role")
    .populate({
      path: "applicationId",
      populate: [
        { path: "cohortId", select: "name year batch" },
        { path: "courseId", select: "title tuitionNgn" },
      ],
    })
    .lean();
}
