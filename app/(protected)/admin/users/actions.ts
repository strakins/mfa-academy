"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

const roleSchema = z.enum(["USER", "STUDENT", "INSTRUCTOR", "ADMIN"]);

export async function setUserRole(userId: string, formData: FormData) {
  const session = await requireAdmin();
  const role = String(formData.get("role") ?? "");

  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) return { ok: false, message: "Invalid role." };

  // Prevent admin from demoting themselves accidentally
  if (session.user.id === userId && parsed.data !== "ADMIN") {
    return { ok: false, message: "You cannot remove your own ADMIN role." };
  }

  await connectDB();

  // If role becomes USER/INSTRUCTOR/ADMIN, you may optionally clear student enrollment
  // We'll only clear student enrollment when changing to USER or INSTRUCTOR.
  const update: any = { role: parsed.data };

  if (parsed.data === "USER" || parsed.data === "INSTRUCTOR" || parsed.data === "ADMIN") {
    // keep student data for audit? If you prefer to clear, uncomment:
    // update.student = undefined;
  }

  await User.updateOne({ _id: userId }, { $set: update });

  return { ok: true, message: `Role updated to ${parsed.data}.` };
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  // Prevent admin from deleting themselves
  if (session.user.id === userId) {
    return { ok: false, message: "You cannot delete your own account." };
  }

  await connectDB();
  await User.findByIdAndDelete(userId);

  // Optional cleanup you can add later:
  // - delete their applications/payments/feedback/likes
  // - anonymize references
  // For now keep it simple.

  return { ok: true, message: "User deleted." };
}
