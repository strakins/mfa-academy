"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setUserRole, deleteUser } from "./actions";

type UserItem = any;

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function AdminUsersClient({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users] = useState<UserItem[]>(initialUsers);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "STUDENT" | "INSTRUCTOR" | "ADMIN">("ALL");
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users
      .filter((u) => (roleFilter === "ALL" ? true : u.role === roleFilter))
      .filter((u) => {
        if (!s) return true;
        return (
          String(u.name ?? "").toLowerCase().includes(s) ||
          String(u.email ?? "").toLowerCase().includes(s) ||
          String(u.role ?? "").toLowerCase().includes(s)
        );
      });
  }, [users, q, roleFilter]);

  async function onSetRole(userId: string, role: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("role", role);
      const res = await setUserRole(userId, fd);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  async function onDelete(userId: string, email?: string) {
    const ok = confirm(`Delete user ${email ?? ""}? This cannot be undone.`);
    if (!ok) return;

    startTransition(async () => {
      const res = await deleteUser(userId);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  return (
    <div className="grid gap-6">
      <motion.div initial="hidden" animate="show" variants={fadeUp}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin • Users</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Search users, update roles, and view student enrollment details.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <div className="w-full md:w-[320px]">
              <Input placeholder="Search by name/email/role..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            <select
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 md:w-[160px]"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
            >
              <option value="ALL">All roles</option>
              <option value="USER">USER</option>
              <option value="STUDENT">STUDENT</option>
              <option value="INSTRUCTOR">INSTRUCTOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-5 right-5 z-50 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((u) => {
          const cohortName = u.student?.cohortId?.name ?? null;
          const courseTitle = u.student?.courseId?.title ?? null;

          return (
            <motion.div key={String(u._id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold">{u.name ?? "Unknown"}</p>
                      <p className="truncate text-xs text-neutral-500">{u.email ?? ""}</p>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                      {u.role}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-3 text-sm">
                  <div className="rounded-2xl bg-neutral-50 p-4">
                    <p className="text-xs text-neutral-500">Enrollment</p>
                    {cohortName || courseTitle ? (
                      <div className="mt-2 grid gap-1">
                        <p className="text-sm">
                          <span className="text-neutral-500">Cohort:</span>{" "}
                          <span className="font-medium">{cohortName ?? "—"}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-neutral-500">Course:</span>{" "}
                          <span className="font-medium">{courseTitle ?? "—"}</span>
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-neutral-600">Not enrolled</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-white p-3">
                    <p className="text-xs font-medium text-neutral-700">Change role</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(["USER", "STUDENT", "INSTRUCTOR", "ADMIN"] as const).map((r) => (
                        <Button
                          key={r}
                          type="button"
                          variant={u.role === r ? "default" : "outline"}
                          disabled={pending}
                          onClick={() => onSetRole(String(u._id), r)}
                        >
                          {r}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-neutral-500">
                      Joined: {u.createdAt ? String(u.createdAt).slice(0, 10) : ""}
                    </p>
                    <Button type="button" disabled={pending} onClick={() => onDelete(String(u._id), u.email)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-neutral-600">
            No users match your search/filter.
          </div>
        )}
      </div>
    </div>
  );
}
