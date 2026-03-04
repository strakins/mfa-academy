
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { z } from "zod";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

async function signUpAction(formData: FormData) {
"use server";
  
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Please enter valid details.")
  }

  await connectDB();
  const email = parsed.data.email.toLowerCase();

  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("Account already exists. Please sign in.");
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await User.create({
    name: parsed.data.name,
    email,
    passwordHash,
    role: "USER",
    likedWorks: [],
  });

  redirect("/sign-in");
}

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Create account</h1>
          <p className="text-sm text-neutral-600">Sign up with email & password.</p>
        </CardHeader>
        <CardContent>
          <form action={signUpAction} className="grid gap-3">
            <Input name="name" placeholder="Full name" required />
            <Input name="email" placeholder="Email" type="email" required />
            <Input name="password" placeholder="Password (min 6 chars)" type="password" required />
            <Button type="submit">Create account</Button>
          </form>

          <p className="mt-4 text-sm text-neutral-600">
            Already have an account?{" "}
            <Link className="underline" href="/sign-in">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
