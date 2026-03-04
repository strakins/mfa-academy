import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/password";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        await connectDB();
        const user = await User.findOne({ email }).lean();
        if (!user?.passwordHash) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatarUrl ?? null,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Ensure user exists in MongoDB for Google sign-ins
      if (account?.provider === "google") {
        await connectDB();
        const email = user.email?.toLowerCase();
        if (!email) return false;

        const existing = await User.findOne({ email });
        if (!existing) {
          await User.create({
            name: user.name ?? "New User",
            email,
            role: "USER",
            avatarUrl: user.image ?? undefined,
            likedWorks: [],
          });
        } else if (!existing.avatarUrl && user.image) {
          existing.avatarUrl = user.image;
          await existing.save();
        }
      }
      return true;
    },
    async jwt({ token }) {
      // Always attach role by reading from DB (keeps role changes effective after admin updates)
      if (token?.email) {
        await connectDB();
        const u = await User.findOne({ email: String(token.email).toLowerCase() }).lean();
        if (u) {
          token.sub = String(u._id);
          (token as any).role = u.role;
          (token as any).name = u.name;
          (token as any).picture = u.avatarUrl ?? token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role ?? "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
