import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
console.log("MONGODB_URI loaded?", Boolean(process.env.MONGODB_URI));


import { connectDB } from "../lib/db";
import { Course } from "../models/Course";
import { Cohort } from "../models/Cohort";
import { DEFAULT_BATCHES, DEFAULT_COURSES, REGISTRATION_FEE_NGN } from "../lib/constants";

function getYear() {
  const now = new Date();
  return now.getFullYear();
}

async function seedCourses() {
  const upserts = DEFAULT_COURSES.map((c) =>
    Course.updateOne(
      { slug: c.slug },
      {
        $set: {
          slug: c.slug,
          title: c.title,
          durationMonths: c.durationMonths,
          tuitionNgn: c.tuitionNgn,
          registrationFeeNgn: REGISTRATION_FEE_NGN,
          audience: c.audience,
          trackTags: [...c.trackTags],
          outlines: [...c.outlines],
          active: c.active,
        },
      },
      { upsert: true }
    )
  );

  await Promise.all(upserts);
  const courses = await Course.find({ slug: { $in: DEFAULT_COURSES.map((x) => x.slug) } });
  return courses;
}

async function seedCohorts(courseIds: string[]) {
  const year = getYear();

  await Promise.all(
    DEFAULT_BATCHES.map((b) =>
      Cohort.updateOne(
        { year, batch: b.batch },
        {
          $set: {
            year,
            batch: b.batch,
            name: `${year} • ${b.label}`,
            status: "OPEN",
            availableCourseIds: courseIds,
          },
        },
        { upsert: true }
      )
    )
  );
}

async function main() {
  await connectDB();

  const courses = await seedCourses();
  await seedCohorts(courses.map((c) => String(c._id)));

  const courseCount = await Course.countDocuments();
  const cohortCount = await Cohort.countDocuments();

  console.log("✅ Seed complete");
  console.log({ courseCount, cohortCount });
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
