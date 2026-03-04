"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/Application";

const schema = z.object({
  cohortId: z.string().min(1),
  courseId: z.string().min(1),
});

export async function submitApplication(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { ok: false, message: "Please sign in." };

  const raw = {
    cohortId: String(formData.get("cohortId") ?? ""),
    courseId: String(formData.get("courseId") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please select a cohort and course." };

  await connectDB();

  try {
    await Application.create({
      userId: session.user.id,
      cohortId: parsed.data.cohortId,
      courseId: parsed.data.courseId,
      status: "SUBMITTED",
    });
    return { ok: true, message: "Application submitted. Upload your payment proof next." };
  } catch (e: any) {
    if (String(e?.code) === "11000") {
      return { ok: false, message: "You already applied for this cohort. Go to Payments to upload proof." };
    }
    return { ok: false, message: "Failed to submit application." };
  }
}
