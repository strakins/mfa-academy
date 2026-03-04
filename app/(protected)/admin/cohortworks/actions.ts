"use server";

import { connectDB } from "@/lib/db";
import { Cohort } from "@/models/CohortsWorks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
}

export async function setCohortCover(cohortId: string, cover: { url: string; publicId: string }) {
  await requireAdmin();
  await connectDB();
  await Cohort.updateOne({ _id: cohortId }, { $set: { coverImage: cover } });
  return { ok: true, message: "Cover updated." };
}

export async function createCohort(formData: FormData) {
  await requireAdmin();
  await connectDB();

  const title = String(formData.get("title") ?? "");
  const year = Number(formData.get("year") ?? 0);
  const batch = String(formData.get("batch") ?? "Q1");
  const description = String(formData.get("description") ?? "");
  const isPublished = String(formData.get("isPublished") ?? "true") === "true";

  if (!title || !year || !batch) return { ok: false, message: "Title, year and batch are required." };

  const slug = `${year}-${batch.toLowerCase()}-${slugify(title)}`;

  await Cohort.create({ title, year, batch, slug, description, isPublished });

  return { ok: true, message: "Cohort created." };
}

export async function updateCohort(cohortId: string, formData: FormData) {
  await requireAdmin();
  await connectDB();

  const patch: any = {
    title: String(formData.get("title") ?? ""),
    year: Number(formData.get("year") ?? 0),
    batch: String(formData.get("batch") ?? "Q1"),
    description: String(formData.get("description") ?? ""),
    isPublished: String(formData.get("isPublished") ?? "true") === "true",
  };

  // regenerate slug when edited
  patch.slug = `${patch.year}-${patch.batch.toLowerCase()}-${slugify(patch.title)}`;

  await Cohort.updateOne({ _id: cohortId }, { $set: patch });

  return { ok: true, message: "Cohort updated." };
}

export async function deleteCohort(cohortId: string) {
  await requireAdmin();
  await connectDB();

  // (optional) you can also delete all Works belonging to this cohort here
  await Cohort.deleteOne({ _id: cohortId });
  return { ok: true, message: "Cohort deleted." };
}