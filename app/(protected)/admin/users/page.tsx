import { getAllUsers } from "@/lib/admin-users";
import AdminUsersClient from "./ui";

export default async function AdminUsersPage() {
  const users = await getAllUsers();
  return <AdminUsersClient initialUsers={users as any[]} />;
}
