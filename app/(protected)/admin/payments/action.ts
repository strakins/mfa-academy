"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payments";
import { Application } from "@/models/Application";
import { User } from "@/models/User";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

const reviewSchema = z.object({
  note: z.string().max(250).optional(),
});

export async function approvePayment(paymentId: string, formData: FormData) {
  const session = await requireAdmin();
  const parsed = reviewSchema.safeParse({ note: String(formData.get("note") ?? "") || undefined });
  if (!parsed.success) return { ok: false, message: "Invalid note." };

  await connectDB();

  const payment = await Payment.findById(paymentId);
  if (!payment) return { ok: false, message: "Payment not found." };

  payment.status = "APPROVED";
  payment.reviewedBy = session.user.id as any;
  payment.reviewNote = parsed.data.note;

  await payment.save();

  // Upgrade user to STUDENT and attach cohort/course
  const app = await Application.findById(payment.applicationId);
  if (app) {
    await User.updateOne(
      { _id: payment.userId },
      {
        $set: {
          role: "STUDENT",
          student: {
            cohortId: app.cohortId,
            courseId: app.courseId,
            enrolledAt: new Date(),
          },
        },
      }
    );

    // Optional: mark application accepted
    await Application.updateOne({ _id: app._id }, { $set: { status: "ACCEPTED" } });
  }

  return { ok: true, message: "Payment approved. User upgraded to STUDENT." };
}

export async function declinePayment(paymentId: string, formData: FormData) {
  const session = await requireAdmin();
  const parsed = reviewSchema.safeParse({ note: String(formData.get("note") ?? "") || undefined });
  if (!parsed.success) return { ok: false, message: "Invalid note." };

  await connectDB();

  const payment = await Payment.findById(paymentId);
  if (!payment) return { ok: false, message: "Payment not found." };

  payment.status = "DECLINED";
  payment.reviewedBy = session.user.id as any;
  payment.reviewNote = parsed.data.note;

  await payment.save();
  return { ok: true, message: "Payment declined." };
}
