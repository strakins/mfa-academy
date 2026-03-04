"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
// import { Feedback } from "@/models/Feedback";
import {Review } from "@/models/Review";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

export async function deleteFeedback(reviewId: string) {
  await requireAdmin();
  await connectDB();
  await Review.findByIdAndDelete(reviewId);
  return { ok: true, message: "Review deleted." };
}

export async function approveReview(reviewId: string) {
  await requireAdmin();
  await connectDB();

  const updated = await Review.findByIdAndUpdate(
    reviewId,
    { $set: { approved: true } },
    { new: true }
  );

  if (!updated) {
    return { ok: false, message: "Review not found." };
  }

  return { ok: true, message: "Review approved." };
}