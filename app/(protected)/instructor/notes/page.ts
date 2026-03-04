import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCohorts } from "@/lib/cohorts";
import { getNotesForInstructor } from "@/lib/notes";
import InstructorNotesClient from "./ui";

export default async function InstructorNotesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") redirect("/profile");

  const [cohorts, notes] = await Promise.all([getCohorts(), getNotesForInstructor(session.user.id)]);
  return <InstructorNotesClient cohorts={cohorts as any[]} notes={notes as any[]} />;
}
