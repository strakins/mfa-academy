import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCohorts } from "@/lib/cohorts";
import { getAssignmentsForInstructor } from "@/lib/assignments";
import InstructorAssignmentsClient from "./ui";

export default async function InstructorAssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") redirect("/profile");

  const [cohorts, assignments] = await Promise.all([
    getCohorts(),
    getAssignmentsForInstructor(session.user.id),
  ]);

  return <InstructorAssignmentsClient cohorts={cohorts as any[]} assignments={assignments as any[]} />;
}
