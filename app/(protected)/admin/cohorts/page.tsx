import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCohorts } from "@/lib/cohorts";
import { getCourses } from "@/lib/courses";
import AdminCohortsClient from "./ui";

export default async function AdminCohortsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/profile");

  const [cohorts, courses] = await Promise.all([getCohorts(), getCourses()]);

  return <AdminCohortsClient initialCohorts={cohorts as any[]} courses={courses as any[]} />;
}
