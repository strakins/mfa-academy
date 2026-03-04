import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const reviews = await Review.find({ approved: true })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const rating = Number(body?.rating);
  const text = String(body?.text ?? "").trim();

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Invalid rating" },
      { status: 400 }
    );
  }

  if (text.length < 10) {
    return NextResponse.json(
      { error: "Review must be at least 10 characters" },
      { status: 400 }
    );
  }

  await connectDB();

  const displayName =
    (session.user as any)?.name ||
    (session.user as any)?.email?.split("@")?.[0] ||
    "Student";

  const userId =
    String((session.user as any)?.id ?? (session.user as any)?.email);

  const created = await Review.create({
    userId,
    displayName,
    rating,
    text,
    approved: false, // pending admin approval
  });

  return NextResponse.json(
    {
      ok: true,
      message: "Submitted for approval",
      id: String(created._id),
    },
    { status: 201 }
  );
}