"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCourse,
  deleteCourse,
  toggleCourseActive,
  updateCourse,
} from "./actions";

function formatNgn(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

type Course = {
  _id: string;
  slug: string;
  title: string;
  durationMonths: number;
  tuitionNgn: number;
  registrationFeeNgn: number;
  audience: string;
  trackTags: string[];
  outlines: string[];
  active: boolean;
  createdAt?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function AdminCoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => {
      return (
        c.title.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.trackTags || []).join(",").toLowerCase().includes(q)
      );
    });
  }, [courses, query]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function onCreate(formData: FormData) {
    startTransition(async () => {
      const res = await createCourse(formData);
      if (!res.ok) return showToast(res.message);

      // refresh by reloading from server isn’t required; simplest: hard reload
      // but we’ll do a soft refresh by navigating:
      window.location.reload();
    });
  }

  async function onUpdate(courseId: string, formData: FormData) {
    startTransition(async () => {
      const res = await updateCourse(courseId, formData);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  async function onToggle(courseId: string) {
    startTransition(async () => {
      const res = await toggleCourseActive(courseId);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  async function onDelete(courseId: string) {
    const ok = confirm("Delete this course permanently?");
    if (!ok) return;

    startTransition(async () => {
      const res = await deleteCourse(courseId);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  const editingCourse = editingId ? courses.find((c) => c._id === editingId) : null;

  return (
    <div className="grid gap-6">
      <motion.div initial="hidden" animate="show" variants={fadeUp}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin • Courses</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Create, update, and manage course pricing, outlines, and availability.
            </p>
          </div>

          <div className="w-full md:w-[360px]">
            <Input
              placeholder="Search courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
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

      {/* Create Form */}
      <motion.div initial="hidden" animate="show" variants={fadeUp}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Create a new course</h2>
                <p className="text-sm text-neutral-600">
                  Best practice: keep titles clear, add tags for filtering, and outlines as bullet lines.
                </p>
              </div>
              <span className="text-xs text-neutral-500">{pending ? "Saving..." : ""}</span>
            </div>
          </CardHeader>
          <CardContent>
            <form action={onCreate} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-neutral-700">Title</label>
                  <Input name="title" placeholder="e.g. Beginners Only" required />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-700">Duration (months)</label>
                  <Input name="durationMonths" type="number" min={1} placeholder="3" required />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-700">Tuition (NGN)</label>
                  <Input name="tuitionNgn" type="number" min={0} placeholder="150000" required />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-700">Registration Fee (NGN)</label>
                  <Input name="registrationFeeNgn" type="number" min={0} placeholder="10000" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">Audience (short description)</label>
                <Input
                  name="audience"
                  placeholder="Who this course is for..."
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">Tags (comma-separated)</label>
                <Input name="trackTags" placeholder="Beginner, Basics, Ready-to-wear" />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">
                  Outline topics (one per line)
                </label>
                <textarea
                  name="outlines"
                  className="min-h-[140px] w-full rounded-2xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  placeholder={`Introduction to Fashion Design\nMachine Acquaintance\nSewing basics`}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input name="active" type="checkbox" defaultChecked />
                  Active
                </label>

                <Button type="submit" disabled={pending}>
                  Create course
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Courses List */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="grid gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">All courses</h2>
          <p className="text-sm text-neutral-500">{filtered.length} course(s)</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((c) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden">
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold">{c.title}</h3>
                      <p className="text-xs text-neutral-500">{c.slug}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        c.active ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-neutral-50 p-3">
                      <p className="text-xs text-neutral-500">Duration</p>
                      <p className="font-medium">{c.durationMonths} months</p>
                    </div>
                    <div className="rounded-2xl bg-neutral-50 p-3">
                      <p className="text-xs text-neutral-500">Tuition</p>
                      <p className="font-medium">{formatNgn(c.tuitionNgn)}</p>
                    </div>
                    <div className="rounded-2xl bg-neutral-50 p-3">
                      <p className="text-xs text-neutral-500">Registration</p>
                      <p className="font-medium">{formatNgn(c.registrationFeeNgn)}</p>
                    </div>
                    <div className="rounded-2xl bg-neutral-50 p-3">
                      <p className="text-xs text-neutral-500">Topics</p>
                      <p className="font-medium">{c.outlines?.length ?? 0}</p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600">{c.audience}</p>

                  <div className="flex flex-wrap gap-2">
                    {(c.trackTags || []).slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs text-neutral-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" type="button" onClick={() => setEditingId(c._id)}>
                      Edit
                    </Button>
                    <Button variant="outline" type="button" onClick={() => onToggle(c._id)} disabled={pending}>
                      {c.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button type="button" onClick={() => onDelete(c._id)} disabled={pending}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Edit Drawer */}
      <AnimatePresence>
        {editingCourse && (
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
                      <h2 className="text-lg font-semibold">Edit course</h2>
                      <p className="text-sm text-neutral-600">{editingCourse.title}</p>
                    </div>
                    <Button variant="outline" type="button" onClick={() => setEditingId(null)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form action={(fd) => onUpdate(editingCourse._id, fd)} className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-neutral-700">Title</label>
                        <Input name="title" defaultValue={editingCourse.title} required />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-neutral-700">Duration (months)</label>
                        <Input
                          name="durationMonths"
                          type="number"
                          min={1}
                          defaultValue={editingCourse.durationMonths}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-neutral-700">Tuition (NGN)</label>
                        <Input
                          name="tuitionNgn"
                          type="number"
                          min={0}
                          defaultValue={editingCourse.tuitionNgn}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-neutral-700">Registration Fee (NGN)</label>
                        <Input
                          name="registrationFeeNgn"
                          type="number"
                          min={0}
                          defaultValue={editingCourse.registrationFeeNgn}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-700">Audience</label>
                      <Input name="audience" defaultValue={editingCourse.audience} required />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-700">Tags (comma-separated)</label>
                      <Input name="trackTags" defaultValue={(editingCourse.trackTags || []).join(", ")} />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-700">Outline topics (one per line)</label>
                      <textarea
                        name="outlines"
                        defaultValue={(editingCourse.outlines || []).join("\n")}
                        className="min-h-[160px] w-full rounded-2xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm text-neutral-700">
                        <input name="active" type="checkbox" defaultChecked={editingCourse.active} />
                        Active
                      </label>
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
