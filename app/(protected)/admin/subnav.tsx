"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/cohorts", label: "Cohorts" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/cohortworks", label: "Upload Works" },
];

export default function AdminSubNav() {
  const pathname = usePathname();

  return (
    <div className="rounded-3xl h-fit border border-black/10 bg-white p-3 m-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative rounded-2xl px-4 py-2 text-sm font-medium transition ${
                active ? "text-black bg-gold-400" : "text-neutral-600 hover:text-black"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="adminTab"
                  className="absolute inset-0 -z-10 rounded-2xl bg-neutral-100"
                  transition={{ duration: 0.2 }}
                />
              )}
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
