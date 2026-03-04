import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCourses } from "@/lib/courses";
import AdminCoursesClient from "./ui";

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/profile");

  const courses = await getCourses();

  return <AdminCoursesClient initialCourses={courses as any[]} />;
}
