import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllPayments } from "@/lib/payments";
import AdminPaymentsClient from "./ui";

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/profile");

  const payments = await getAllPayments();
  return <AdminPaymentsClient payments={payments as any[]} />;
}
