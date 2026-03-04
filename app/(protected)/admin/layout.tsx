import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSubNav from "./subnav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/profile");

  return (
    <div className="min-h-screen grid gap-6 p-2.5">
      <AdminSubNav />
      <div>{children}</div>
    </div>
  );
}
