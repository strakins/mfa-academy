"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitApplication } from "./actions";

type Cohort = { _id: string; name: string; year: number; batch: number; status: "OPEN"|"ONGOING"|"ENDED" };
type Course = { _id: string; title: string; durationMonths: number; tuitionNgn: number; registrationFeeNgn: number; active: boolean };

function formatNgn(n: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

export default function ApplyClient({ cohorts, courses }: { cohorts: Cohort[]; courses: Course[] }) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const openCohorts = cohorts.filter((c) => c.status === "OPEN");
  const activeCourses = courses.filter((c) => c.active);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitApplication(formData);
      showToast(res.message);
      if (res.ok) setTimeout(() => (window.location.href = "/payments"), 700);
    });
  }

  return (
    <div className="grid gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Apply for next cohort</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Pick an open cohort and your preferred course track. Then upload payment proof.
        </p>
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

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Application form</h2>
          <p className="text-sm text-neutral-600">Mobile friendly • fast • clean</p>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-neutral-700">Cohort (OPEN)</label>
                <select
                  name="cohortId"
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select cohort</option>
                  {openCohorts.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} (Year {c.year}, Batch {c.batch})
                    </option>
                  ))}
                </select>
                {!openCohorts.length && (
                  <p className="mt-2 text-xs text-neutral-500">No OPEN cohorts yet. Admin should create one.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">Course</label>
                <select
                  name="courseId"
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select course</option>
                  {activeCourses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} • {c.durationMonths} months • {formatNgn(c.tuitionNgn)}
                    </option>
                  ))}
                </select>
                {!activeCourses.length && (
                  <p className="mt-2 text-xs text-neutral-500">No active courses. Admin should create/activate courses.</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Submitting..." : "Submit application"}
              </Button>
              <Link href="/profile" className="text-sm text-neutral-600 underline">
                Back to profile
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
