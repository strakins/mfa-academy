"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Assignment } from "@/models/Assignment";

async function requireInstructor() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    throw new Error("Instructor only");
  }
  return session;
}

const schema = z.object({
  title: z.string().min(2),
  cohortId: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  assetsJson: z.string().optional(), // stringified array
});

function toDateOrUndefined(v?: string) {
  const s = (v ?? "").trim();
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function createAssignment(formData: FormData) {
  const session = await requireInstructor();

  const raw = {
    title: String(formData.get("title") ?? ""),
    cohortId: String(formData.get("cohortId") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    dueDate: String(formData.get("dueDate") ?? "") || undefined,
    assetsJson: String(formData.get("assetsJson") ?? "") || "[]",
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please fill required fields." };

  let assets: any[] = [];
  try {
    assets = JSON.parse(parsed.data.assetsJson || "[]");
    if (!Array.isArray(assets)) assets = [];
  } catch {
    assets = [];
  }

  await connectDB();

  await Assignment.create({
    title: parsed.data.title,
    cohortId: parsed.data.cohortId,
    createdBy: session.user.id,
    description: parsed.data.description,
    dueDate: toDateOrUndefined(parsed.data.dueDate),
    assets: assets.map((a) => ({
      url: String(a.url),
      publicId: a.publicId ? String(a.publicId) : undefined,
      type: a.type === "pdf" ? "pdf" : a.type === "image" ? "image" : "other",
    })),
  });

  return { ok: true, message: "Assignment created." };
}

export async function deleteAssignment(id: string) {
  await requireInstructor();
  await connectDB();
  await Assignment.findByIdAndDelete(id);
  return { ok: true, message: "Assignment deleted." };
}
