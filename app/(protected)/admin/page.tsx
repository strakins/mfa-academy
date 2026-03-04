import { getAdminStats } from "@/lib/admin-stats";
import { getAllFeedback, getAllReviews } from "@/lib/feedback";
import AdminDashboardClient from "./ui";

export default async function AdminDashboardPage() {
  const [stats, reviews] = await Promise.all([getAdminStats(), getAllFeedback(), getAllReviews()]);
  return <AdminDashboardClient stats={stats} reviews={reviews as any[]}  />;
}
