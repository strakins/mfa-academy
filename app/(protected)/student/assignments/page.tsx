import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentCohortId } from "@/lib/student";
import { getAssignmentsForCohort } from "@/lib/assignments";
import StudentAssignmentsClient from "./ui";

export default async function StudentAssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "STUDENT" && session.user.role !== "ADMIN") redirect("/profile");

  const cohortId = await getStudentCohortId(session.user.id);
  if (!cohortId) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6">
        <h1 className="text-xl font-semibold">Assignments</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Your student enrollment is not active yet. Submit payment and wait for admin approval.
        </p>
      </div>
    );
  }

  const assignments = await getAssignmentsForCohort(cohortId);
  return <StudentAssignmentsClient assignments={assignments as any[]} />;
}
