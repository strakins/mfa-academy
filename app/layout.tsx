import "./globals.css";
import type { Metadata } from "next";
import {Navbar}  from "@/components/Navbar";
import  {Providers}  from "@/app/providers";
import Footer from "@/components/Footer";
import {Toaster} from "react-hot-toast"

export const metadata: Metadata = {
  title: "MFA Portal",
  description: "Fashion School in Ile-Ife",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-neutral-900">
        <Providers>
          <Navbar />
            <main className="mx-auto w-full max-w-6xl md:px-4 md:py-4 ">
              {children}
              <Toaster position="top-right" />
            </main>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}
