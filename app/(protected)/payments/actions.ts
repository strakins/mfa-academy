"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payments";
import { Application } from "@/models/Application";

const schema = z.object({
  applicationId: z.string().min(1),
  amountNgn: z.coerce.number().min(0),
  proofUrl: z.string().url(),
  proofPublicId: z.string().optional(),
});

export async function submitPayment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { ok: false, message: "Please sign in." };

  const raw = {
    applicationId: String(formData.get("applicationId") ?? ""),
    amountNgn: formData.get("amountNgn"),
    proofUrl: String(formData.get("proofUrl") ?? ""),
    proofPublicId: String(formData.get("proofPublicId") ?? "") || undefined,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please provide amount and proof upload." };

  await connectDB();

  // Ensure application belongs to user
  const app = await Application.findOne({ _id: parsed.data.applicationId, userId: session.user.id });
  if (!app) return { ok: false, message: "Application not found." };

  try {
    await Payment.create({
      applicationId: app._id,
      userId: session.user.id,
      amountNgn: parsed.data.amountNgn,
      proofUrl: parsed.data.proofUrl,
      proofPublicId: parsed.data.proofPublicId,
      status: "PENDING",
    });

    return { ok: true, message: "Payment submitted. Awaiting admin approval." };
  } catch (e: any) {
    if (String(e?.code) === "11000") {
      return { ok: false, message: "You already submitted payment proof for this application." };
    }
    return { ok: false, message: "Failed to submit payment." };
  }
}
