"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/Cohort";
import mongoose from "mongoose";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin only");
  }
  return session;
}

const cohortSchema = z.object({
  year: z.coerce.number().min(2000).max(2100),
  batch: z.coerce.number().min(1).max(4),
  name: z.string().min(3),
  status: z.enum(["OPEN", "ONGOING", "ENDED"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  courseIds: z.array(z.string()).default([]),
});

function toDateOrUndefined(v?: string) {
  const s = (v ?? "").trim();
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function createCohort(formData: FormData) {
  await requireAdmin();

  const raw = {
    year: formData.get("year"),
    batch: formData.get("batch"),
    name: String(formData.get("name") ?? ""),
    status: String(formData.get("status") ?? "OPEN"),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    courseIds: formData.getAll("courseIds").map(String),
  };

  const parsed = cohortSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please fill cohort fields correctly." };
  }

  await connectDB();

  try {
    await Cohort.create({
      year: parsed.data.year,
      batch: parsed.data.batch,
      name: parsed.data.name,
      status: parsed.data.status,
      startDate: toDateOrUndefined(parsed.data.startDate),
      endDate: toDateOrUndefined(parsed.data.endDate),
      availableCourseIds: parsed.data.courseIds
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id)),
    });

    return { ok: true, message: "Cohort created." };
  } catch (e: any) {
    // unique index violation year+batch
    if (String(e?.code) === "11000") {
      return { ok: false, message: "A cohort already exists for that year and batch." };
    }
    return { ok: false, message: "Failed to create cohort." };
  }
}

export async function updateCohort(cohortId: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    year: formData.get("year"),
    batch: formData.get("batch"),
    name: String(formData.get("name") ?? ""),
    status: String(formData.get("status") ?? "OPEN"),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    courseIds: formData.getAll("courseIds").map(String),
  };

  const parsed = cohortSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please fill cohort fields correctly." };
  }

  await connectDB();

  const cohort = await Cohort.findById(cohortId);
  if (!cohort) return { ok: false, message: "Cohort not found." };

  cohort.year = parsed.data.year;
  cohort.batch = parsed.data.batch;
  cohort.name = parsed.data.name;
  cohort.status = parsed.data.status;
  cohort.startDate = toDateOrUndefined(parsed.data.startDate);
  cohort.endDate = toDateOrUndefined(parsed.data.endDate);
  cohort.availableCourseIds = parsed.data.courseIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  try {
    await cohort.save();
    return { ok: true, message: "Cohort updated." };
  } catch (e: any) {
    if (String(e?.code) === "11000") {
      return { ok: false, message: "Another cohort already exists for that year and batch." };
    }
    return { ok: false, message: "Failed to update cohort." };
  }
}

export async function deleteCohort(cohortId: string) {
  await requireAdmin();
  await connectDB();
  await Cohort.findByIdAndDelete(cohortId);
  return { ok: true, message: "Cohort deleted." };
}
