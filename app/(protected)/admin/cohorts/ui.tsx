"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCohort, deleteCohort, updateCohort } from "./action";

type Course = { _id: string; title: string; slug: string };
type Cohort = {
  _id: string;
  year: number;
  batch: number;
  name: string;
  status: "OPEN" | "ONGOING" | "ENDED";
  startDate?: string | null;
  endDate?: string | null;
  availableCourseIds: Array<{ _id: string; title: string; slug: string }> | string[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function toDateInputValue(d?: string | null) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  // yyyy-mm-dd
  return dt.toISOString().slice(0, 10);
}

function statusPill(status: Cohort["status"]) {
  if (status === "OPEN") return "bg-green-50 text-green-700";
  if (status === "ONGOING") return "bg-blue-50 text-blue-700";
  return "bg-neutral-100 text-neutral-600";
}

export default function AdminCohortsClient({
  initialCohorts,
  courses,
}: {
  initialCohorts: Cohort[];
  courses: Course[];
}) {
  const [cohorts] = useState<Cohort[]>(initialCohorts);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cohorts;
    return cohorts.filter((c) => {
      const courseTitles =
        Array.isArray(c.availableCourseIds) && c.availableCourseIds.length > 0 && typeof c.availableCourseIds[0] === "object"
          ? (c.availableCourseIds as any[]).map((x) => x.title).join(", ")
          : "";
      return (
        String(c.year).includes(q) ||
        String(c.batch).includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        courseTitles.toLowerCase().includes(q)
      );
    });
  }, [cohorts, query]);

  const editingCohort = editingId ? cohorts.find((c) => c._id === editingId) : null;

  async function onCreate(formData: FormData) {
    startTransition(async () => {
      const res = await createCohort(formData);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  async function onUpdate(cohortId: string, formData: FormData) {
    startTransition(async () => {
      const res = await updateCohort(cohortId, formData);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  async function onDelete(cohortId: string) {
    const ok = confirm("Delete this cohort permanently?");
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteCohort(cohortId);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  return (
    <div className="grid gap-6">
      <motion.div initial="hidden" animate="show" variants={fadeUp}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin • Cohorts</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Manage batches per year, set status, dates, and attach available courses.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <Input placeholder="Search cohorts..." value={query} onChange={(e) => setQuery(e.target.value)} />
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

      {/* Create Cohort */}
      <motion.div initial="hidden" animate="show" variants={fadeUp}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Create cohort</h2>
                <p className="text-sm text-neutral-600">Tip: year + batch (1–4) must be unique.</p>
              </div>
              <span className="text-xs text-neutral-500">{pending ? "Saving..." : ""}</span>
            </div>
          </CardHeader>
          <CardContent>
            <form action={onCreate} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-neutral-700">Year</label>
                  <Input name="year" type="number" min={2000} max={2100} placeholder="2026" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700">Batch (1–4)</label>
                  <Input name="batch" type="number" min={1} max={4} placeholder="1" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700">Status</label>
                  <select
                    name="status"
                    className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                    defaultValue="OPEN"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="ENDED">ENDED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">Cohort name</label>
                <Input name="name" placeholder="e.g. 2026 • Batch 1" required />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-neutral-700">Start date (optional)</label>
                  <Input name="startDate" type="date" />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700">End date (optional)</label>
                  <Input name="endDate" type="date" />
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                <p className="text-sm font-medium">Available courses</p>
                <p className="mt-1 text-xs text-neutral-500">Select what students can apply for in this cohort.</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {courses.map((course) => (
                    <label key={course._id} className="flex items-center gap-2 rounded-xl bg-white p-3 text-sm">
                      <input type="checkbox" name="courseIds" value={course._id} />
                      <span className="font-medium">{course.title}</span>
                      <span className="ml-auto text-xs text-neutral-500">{course.slug}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={pending}>
                  Create cohort
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* List Cohorts */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="grid gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">All cohorts</h2>
          <p className="text-sm text-neutral-500">{filtered.length} cohort(s)</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((c) => {
            const courseTitles =
              Array.isArray(c.availableCourseIds) && c.availableCourseIds.length > 0 && typeof c.availableCourseIds[0] === "object"
                ? (c.availableCourseIds as any[]).map((x) => x.title)
                : [];

            return (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader className="space-y-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold">{c.name}</h3>
                        <p className="text-xs text-neutral-500">
                          Year {c.year} • Batch {c.batch}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs ${statusPill(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-neutral-50 p-3">
                        <p className="text-xs text-neutral-500">Start</p>
                        <p className="font-medium">{toDateInputValue(c.startDate) || "—"}</p>
                      </div>
                      <div className="rounded-2xl bg-neutral-50 p-3">
                        <p className="text-xs text-neutral-500">End</p>
                        <p className="font-medium">{toDateInputValue(c.endDate) || "—"}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-neutral-50 p-4">
                      <p className="text-sm font-medium">Courses</p>
                      {courseTitles.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {courseTitles.slice(0, 8).map((t) => (
                            <span key={t} className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs">
                              {t}
                            </span>
                          ))}
                          {courseTitles.length > 8 && (
                            <span className="text-xs text-neutral-500">+{courseTitles.length - 8} more</span>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-neutral-600">No courses selected yet.</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button variant="outline" type="button" onClick={() => setEditingId(c._id)}>
                        Edit
                      </Button>
                      <Button type="button" onClick={() => onDelete(c._id)} disabled={pending}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCohort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 p-4"
            onClick={() => setEditingId(null)}
          >
            <motion.div
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-auto w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">Edit cohort</h2>
                      <p className="text-sm text-neutral-600">{editingCohort.name}</p>
                    </div>
                    <Button variant="outline" type="button" onClick={() => setEditingId(null)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form action={(fd) => onUpdate(editingCohort._id, fd)} className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="text-xs font-medium text-neutral-700">Year</label>
                        <Input name="year" type="number" defaultValue={editingCohort.year} required />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-neutral-700">Batch</label>
                        <Input name="batch" type="number" min={1} max={4} defaultValue={editingCohort.batch} required />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-neutral-700">Status</label>
                        <select
                          name="status"
                          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                          defaultValue={editingCohort.status}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="ONGOING">ONGOING</option>
                          <option value="ENDED">ENDED</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-700">Cohort name</label>
                      <Input name="name" defaultValue={editingCohort.name} required />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-neutral-700">Start date</label>
                        <Input name="startDate" type="date" defaultValue={toDateInputValue(editingCohort.startDate)} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-neutral-700">End date</label>
                        <Input name="endDate" type="date" defaultValue={toDateInputValue(editingCohort.endDate)} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                      <p className="text-sm font-medium">Available courses</p>
                      <p className="mt-1 text-xs text-neutral-500">Update which courses are available for this cohort.</p>

                      {(() => {
                        const existingIds =
                          Array.isArray(editingCohort.availableCourseIds) &&
                          editingCohort.availableCourseIds.length > 0 &&
                          typeof editingCohort.availableCourseIds[0] === "object"
                            ? (editingCohort.availableCourseIds as any[]).map((x) => String(x._id))
                            : (editingCohort.availableCourseIds as string[]).map(String);

                        return (
                          <div className="mt-3 grid gap-2 md:grid-cols-2">
                            {courses.map((course) => (
                              <label key={course._id} className="flex items-center gap-2 rounded-xl bg-white p-3 text-sm">
                                <input
                                  type="checkbox"
                                  name="courseIds"
                                  value={course._id}
                                  defaultChecked={existingIds.includes(String(course._id))}
                                />
                                <span className="font-medium">{course.title}</span>
                                <span className="ml-auto text-xs text-neutral-500">{course.slug}</span>
                              </label>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={pending}>
                        Save changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
