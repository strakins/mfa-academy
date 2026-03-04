import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role ?? "USER";

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-sm text-neutral-600">You are logged in.</p>
      </CardHeader>
      <CardContent className="text-sm">
        <div><b>Name:</b> {session?.user?.name}</div>
        <div><b>Email:</b> {session?.user?.email}</div>
        <div><b>Role:</b> {role}</div>
      </CardContent>
    </Card>
  );
}
