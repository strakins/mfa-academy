// app/(auth)/sign-in/sign-in-form.tsx
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInForm() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/profile";
  const [loading, setLoading] = useState(false);

  async function onCredsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    await signIn("credentials", {
      email,
      password,
      callbackUrl,
    });

    setLoading(false);
  }

  return (
    <div className="mx-auto min-h-screen max-w-md">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm text-neutral-600">Use Google or your email.</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl })}
            type="button"
          >
            Continue with Google
          </Button>

          <div className="text-xs text-neutral-500">OR</div>

          <form onSubmit={onCredsSubmit} className="grid gap-3">
            <Input name="email" placeholder="Email" type="email" required />
            <Input name="password" placeholder="Password" type="password" required />
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-neutral-600">
            No account?{" "}
            <Link className="underline" href="/sign-up">Create one</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}