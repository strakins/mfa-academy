"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { approvePayment, declinePayment } from "./action";

export default function AdminPaymentsClient({ payments }: { payments: any[] }) {
  const [q, setQ] = useState("");
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return payments;
    return payments.filter((p) => {
      const user = p.userId;
      const course = p.applicationId?.courseId?.title ?? "";
      const cohort = p.applicationId?.cohortId?.name ?? "";
      return (
        String(user?.name ?? "").toLowerCase().includes(s) ||
        String(user?.email ?? "").toLowerCase().includes(s) ||
        String(course).toLowerCase().includes(s) ||
        String(cohort).toLowerCase().includes(s) ||
        String(p.status).toLowerCase().includes(s)
      );
    });
  }, [payments, q]);

  return (
    <div className="grid gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin • Payments</h1>
            <p className="mt-1 text-sm text-neutral-600">Approve payment to unlock student access automatically.</p>
          </div>
          <div className="w-full md:w-[360px]">
            <Input placeholder="Search name/email/course/cohort/status..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
      </motion.div>

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
        {filtered.map((p: any) => {
          const status = p.status;
          const pill =
            status === "APPROVED"
              ? "bg-green-50 text-green-700"
              : status === "DECLINED"
              ? "bg-red-50 text-red-700"
              : "bg-neutral-100 text-neutral-700";

          const user = p.userId;
          const cohortName = p.applicationId?.cohortId?.name ?? "—";
          const courseTitle = p.applicationId?.courseId?.title ?? "—";

          return (
            <motion.div key={String(p._id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold">{user?.name ?? "Unknown user"}</h3>
                      <p className="text-xs text-neutral-500">{user?.email ?? ""}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs ${pill}`}>{status}</span>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div className="rounded-2xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Course</p>
                    <p className="font-medium">{courseTitle}</p>
                    <p className="mt-1 text-xs text-neutral-500">Cohort: {cohortName}</p>
                  </div>

                  <a className="underline" href={p.proofUrl} target="_blank" rel="noreferrer">
                    View proof
                  </a>

                  <form
                    action={(fd) =>
                      startTransition(async () => {
                        const res =
                          status === "PENDING"
                            ? await approvePayment(String(p._id), fd)
                            : await approvePayment(String(p._id), fd);
                        showToast(res.message);
                        if (res.ok) window.location.reload();
                      })
                    }
                    className="grid gap-2"
                  >
                    <Input name="note" placeholder="Optional admin note..." />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        disabled={pending || status !== "PENDING"}
                        onClick={() =>
                          startTransition(async () => {
                            const fd = new FormData();
                            const res = await approvePayment(String(p._id), fd);
                            showToast(res.message);
                            if (res.ok) window.location.reload();
                          })
                        }
                      >
                        Approve
                      </Button>

                      <Button
                        type="button"
                        disabled={pending || status !== "PENDING"}
                        onClick={() =>
                          startTransition(async () => {
                            const fd = new FormData();
                            const res = await declinePayment(String(p._id), fd);
                            showToast(res.message);
                            if (res.ok) window.location.reload();
                          })
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  </form>

                  {p.reviewNote ? <p className="text-sm text-neutral-600">Note: {p.reviewNote}</p> : null}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
