"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";

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
  fileUrl: z.string().url(),
  filePublicId: z.string().optional(),
  fileType: z.enum(["pdf", "image", "other"]).default("other"),
  visibility: z.enum(["STUDENTS_ONLY", "PUBLIC"]).default("STUDENTS_ONLY"),
});

export async function createNote(formData: FormData) {
  const session = await requireInstructor();

  const raw = {
    title: String(formData.get("title") ?? ""),
    cohortId: String(formData.get("cohortId") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    fileUrl: String(formData.get("fileUrl") ?? ""),
    filePublicId: String(formData.get("filePublicId") ?? "") || undefined,
    fileType: String(formData.get("fileType") ?? "other"),
    visibility: String(formData.get("visibility") ?? "STUDENTS_ONLY"),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please fill fields correctly and upload a file." };

  await connectDB();

  await Note.create({
    title: parsed.data.title,
    cohortId: parsed.data.cohortId,
    uploadedBy: session.user.id,
    description: parsed.data.description,
    fileUrl: parsed.data.fileUrl,
    filePublicId: parsed.data.filePublicId,
    fileType: parsed.data.fileType,
    visibility: parsed.data.visibility,
  });

  return { ok: true, message: "Note uploaded." };
}

export async function deleteNote(noteId: string) {
  await requireInstructor();
  await connectDB();
  await Note.findByIdAndDelete(noteId);
  return { ok: true, message: "Note deleted." };
}
