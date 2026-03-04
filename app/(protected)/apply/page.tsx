import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCohorts } from "@/lib/cohorts";
import { getCourses } from "@/lib/courses";
import ApplyClient from "./ui";

export default async function ApplyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");

  const [cohorts, courses] = await Promise.all([getCohorts(), getCourses()]);

  return <ApplyClient cohorts={cohorts as any[]} courses={courses as any[]} />;
}
