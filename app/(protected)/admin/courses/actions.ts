"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";

const courseSchema = z.object({
  title: z.string().min(2),
  durationMonths: z.coerce.number().min(1),
  tuitionNgn: z.coerce.number().min(0),
  registrationFeeNgn: z.coerce.number().min(0),
  audience: z.string().min(10),
  trackTags: z.string().optional(),   // comma-separated
  outlines: z.string().optional(),    // newline-separated
  active: z.coerce.boolean().optional(),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user || role !== "ADMIN") {
    throw new Error("Unauthorized: Admin only");
  }
  return session;
}

function parseCommaList(v?: string) {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseLineList(v?: string) {
  if (!v) return [];
  return v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createCourse(formData: FormData) {
  await requireAdmin();

  const raw = {
    title: String(formData.get("title") ?? ""),
    durationMonths: formData.get("durationMonths"),
    tuitionNgn: formData.get("tuitionNgn"),
    registrationFeeNgn: formData.get("registrationFeeNgn"),
    audience: String(formData.get("audience") ?? ""),
    trackTags: String(formData.get("trackTags") ?? ""),
    outlines: String(formData.get("outlines") ?? ""),
    active: formData.get("active") === "on",
  };

  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please fill all fields correctly." };
  }

  await connectDB();

  const slugBase = slugify(parsed.data.title);
  let slug = slugBase;
  let i = 1;

  // ensure unique slug
  while (await Course.exists({ slug })) {
    i += 1;
    slug = `${slugBase}-${i}`;
  }

  await Course.create({
    slug,
    title: parsed.data.title,
    durationMonths: parsed.data.durationMonths,
    tuitionNgn: parsed.data.tuitionNgn,
    registrationFeeNgn: parsed.data.registrationFeeNgn,
    audience: parsed.data.audience,
    trackTags: parseCommaList(parsed.data.trackTags),
    outlines: parseLineList(parsed.data.outlines),
    active: parsed.data.active ?? true,
  });

  return { ok: true, message: "Course created successfully." };
}

export async function updateCourse(courseId: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    title: String(formData.get("title") ?? ""),
    durationMonths: formData.get("durationMonths"),
    tuitionNgn: formData.get("tuitionNgn"),
    registrationFeeNgn: formData.get("registrationFeeNgn"),
    audience: String(formData.get("audience") ?? ""),
    trackTags: String(formData.get("trackTags") ?? ""),
    outlines: String(formData.get("outlines") ?? ""),
    active: formData.get("active") === "on",
  };

  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please fill all fields correctly." };
  }

  await connectDB();

  const existing = await Course.findById(courseId);
  if (!existing) return { ok: false, message: "Course not found." };

  existing.title = parsed.data.title;
  existing.durationMonths = parsed.data.durationMonths;
  existing.tuitionNgn = parsed.data.tuitionNgn;
  existing.registrationFeeNgn = parsed.data.registrationFeeNgn;
  existing.audience = parsed.data.audience;
  existing.trackTags = parseCommaList(parsed.data.trackTags);
  existing.outlines = parseLineList(parsed.data.outlines);
  existing.active = parsed.data.active ?? existing.active;

  await existing.save();

  return { ok: true, message: "Course updated." };
}

export async function deleteCourse(courseId: string) {
  await requireAdmin();
  await connectDB();
  await Course.findByIdAndDelete(courseId);
  return { ok: true, message: "Course deleted." };
}

export async function toggleCourseActive(courseId: string) {
  await requireAdmin();
  await connectDB();
  const c = await Course.findById(courseId);
  if (!c) return { ok: false, message: "Course not found." };
  c.active = !c.active;
  await c.save();
  return { ok: true, message: c.active ? "Course activated." : "Course deactivated." };
}
