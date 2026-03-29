// lib/getRandomWorksImages.ts
import { connectDB } from "@/lib/db";
import { Work } from "@/models/Work";

/**
 * Returns `count` random image URLs from published works.
 * Called server-side so every page load gets a fresh set.
 */
export async function getRandomWorkImages(count = 12): Promise<string[]> {
  await connectDB();

  const works = await Work.aggregate([
    { $match: { "image.url": { $exists: true, $ne: "" } } },
    { $sample: { size: count } },
    { $project: { url: "$image.url", _id: 0 } },
  ]);

  return works.map((w: { url: string }) => w.url);
}
