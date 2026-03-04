"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  GraduationCap,
  Shield,
  BookOpen,
  Images,
  Info,
  LogOut,
  LayoutDashboard,
  ArrowRight,
  Home,
} from "lucide-react";
import Image from "next/image";

const MFA_LOGO = "/mfa_logo.png";

const navItemBase =
  "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const { data } = useSession();
  const role = ((data?.user as any)?.role ?? "USER") as
    | "USER"
    | "ADMIN"
    | "INSTRUCTOR"
    | "STUDENT";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const baseLinks = useMemo(
    () => [
      { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
      { href: "/about", label: "About", icon: <Info className="h-4 w-4" /> },
      { href: "/works", label: "Works", icon: <Images className="h-4 w-4" /> },
      { href: "/courses", label: "Courses", icon: <BookOpen className="h-4 w-4" /> },
      { href: "/contact", label: "Contact Us", icon: <BookOpen className="h-4 w-4" /> },
      { href: "/blog", label: "Blog", icon: <BookOpen className="h-4 w-4" /> },
    ],
    []
  );

  const authedLinks = useMemo(() => {
    const links: { href: string; label: string; icon: React.ReactNode }[] = [
      { href: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    ];

    if (role === "ADMIN")
      links.push({ href: "/admin", label: "Admin", icon: <Shield className="h-4 w-4" /> });

    if (role === "INSTRUCTOR")
      links.push({
        href: "/instructor",
        label: "Instructor",
        icon: <LayoutDashboard className="h-4 w-4" />,
      });

    if (role === "STUDENT")
      links.push({
        href: "/student",
        label: "Student",
        icon: <GraduationCap className="h-4 w-4" />,
      });

    return links;
  }, [role]);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-900/20 bg-navy-800 backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-blue-950/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-2 py-1 font-semibold tracking-tight text-white/90 hover:text-white transition-colors"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <Image 
              src={MFA_LOGO}
              fill
              className="object-cover"
              alt="mfa-logo"
            />
          </div>
          <span className="hidden sm:inline text-white/90">MFA Portal</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 text-sm md:flex">
          {baseLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  navItemBase,
                  active
                    ? "bg-gold-400 text-black border-l-2 border-blue-100"
                    : "text-white hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}

          <div className="mx-2 h-5 w-px bg-white" />

          {data?.user ? (
            <>
              {authedLinks.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={[
                      navItemBase,
                      active
                       ? "bg-gold-400 text-black border-l-2 border-blue-100"
                       : "text-white hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}

              <Button
                variant="ghost"
                className="ml-2 border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className={[
                "ml-2 inline-flex items-center gap-2 rounded-lg bg-gold-400 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-black border border-blue-400/30 transition-all hover:bg-blue-500/30 hover:border-blue-400/50 active:scale-[0.98]",
                isActive(pathname, "/sign-in") ? "ring-2 ring-blue-400/50 bg-blue-500/30" : "",
              ].join(" ")}
            >
              Sign-in 
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-blue-950/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.aside
              className="fixed right-0 top-0 z-50 h-dvh w-[86%] max-w-sm border-l border-white/10 bg-navy-800 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl shadow-blue-950/50 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex h-full flex-col p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <Image 
                        src={MFA_LOGO}
                        fill
                        className="object-cover"
                        alt="mfa-logo"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">MFA Portal</p>
                      <p className="text-xs text-white/60">
                        {data?.user ? `Signed in • ${role}` : "Welcome"}
                      </p>
                    </div>
                  </div>

                  <button
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-6">
                    {/* Explore Section */}
                    <div>
                      <div className="space-y-1">
                        {baseLinks.map((l) => (
                          <MobileNavLink 
                            key={l.href} 
                            href={l.href} 
                            pathname={pathname} 
                            icon={l.icon}
                          >
                            {l.label}
                          </MobileNavLink>
                        ))}
                      </div>
                    </div>

                    {/* Account Section */}
                    {data?.user && (
                      <div>
                        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                          Account
                        </p>
                        <div className="space-y-1">
                          {authedLinks.map((l) => (
                            <MobileNavLink 
                              key={l.href} 
                              href={l.href} 
                              pathname={pathname} 
                              icon={l.icon}
                            >
                              {l.label}
                            </MobileNavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="pt-6 border-t border-white/10 space-y-3">
                  {data?.user ? (
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/sign-in"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-400 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-black border border-blue-400/30 transition-all hover:bg-blue-500/30 hover:border-blue-400/50"
                      onClick={() => setOpen(false)}
                    >
                      Sign-in
                    </Link>
                  )}
                  
                  <Link
                    href="/apply"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-white border border-white/20 transition-all hover:bg-white/20"
                    onClick={() => setOpen(false)}
                  >
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNavLink({
  href,
  pathname,
  children,
  icon,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      className={[
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-gold-400 text-black border-l-2 border-blue-100"
          : "text-white hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <span className={active ? "text-black" : "text-white"}>{icon}</span>
      <span>{children}</span>
      <span className="ml-auto text-white">›</span>
    </Link>
  );
}