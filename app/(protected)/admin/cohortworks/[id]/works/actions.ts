"use server";

import { connectDB } from "@/lib/db";
import { Work } from "@/models/Work";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createWork(cohortId: string, payload: {
  title?: string;
  studentName?: string;
  category?: string;
  description?: string;
  imageUrl: string;
  publicId?: string;
  width?: number;
  height?: number;
}) {
  await requireAdmin();
  await connectDB();

  await Work.create({
    cohortId,
    title: payload.title ?? "",
    studentName: payload.studentName ?? "",
    category: payload.category ?? "",
    description: payload.description ?? "",
    image: {
      url: payload.imageUrl,
      publicId: payload.publicId ?? "",
      width: payload.width,
      height: payload.height,
    },
  });

  return { ok: true, message: "Work uploaded." };
}