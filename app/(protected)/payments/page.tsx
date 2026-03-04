import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyApplications } from "@/lib/applications";
import { getMyPayments } from "@/lib/payments";
import PaymentsClient from "./ui";

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");

  const [apps, payments] = await Promise.all([
    getMyApplications(session.user.id),
    getMyPayments(session.user.id),
  ]);

  return <PaymentsClient applications={apps as any[]} payments={payments as any[]} />;
}
