"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { approveReview, deleteFeedback } from "./actions";

type ReviewItem = {
  _id: string;
  displayName?: string | null;
  type?: string | null;
  rating?: number | null;
  text?: string | null;
  createdAt?: string | Date | null;
  approved?: boolean;
};

export default function AdminDashboardClient({
  stats,
  reviews: initialReviews,
}: {
  stats: { users: number; students: number; instructors: number; reviewCount: number };
  reviews: ReviewItem[];
}) {
  const [pending, startTransition] = useTransition();

  // ✅ local state so we can update UI without reload
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews ?? []);

  // delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const deleteTarget = useMemo(
    () => reviews.find((r) => String(r._id) === String(deleteId)),
    [reviews, deleteId]
  );

  function openDeleteModal(id: string) {
    setDeleteId(id);
    setConfirmText("");
  }

  function closeDeleteModal() {
    setDeleteId(null);
    setConfirmText("");
  }

  function formatDate(d: any) {
    const s = String(d ?? "");
    return s ? s.slice(0, 10) : "";
  }

  function statusPill(approved?: boolean) {
    return approved ? (
      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700">
        Approved
      </span>
    ) : (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700">
        Pending
      </span>
    );
  }

  async function onApprove(id: string) {
    const tId = toast.loading("Approving review...");

    startTransition(async () => {
      try {
        const res = await approveReview(id);

        if (res?.ok) {
          // ✅ optimistic update
          setReviews((prev) =>
            prev.map((r) => (String(r._id) === String(id) ? { ...r, approved: true } : r))
          );
          toast.success(res.message || "Review approved", { id: tId });
        } else {
          toast.error(res?.message || "Could not approve review", { id: tId });
        }
      } catch (e: any) {
        toast.error(e?.message ?? "Approval failed", { id: tId });
      }
    });
  }

  async function onDeleteConfirmed() {
    if (!deleteId) return;

    const tId = toast.loading("Deleting review...");

    startTransition(async () => {
      try {
        const res = await deleteFeedback(deleteId);

        if (res?.ok) {
          setReviews((prev) => prev.filter((r) => String(r._id) !== String(deleteId)));
          toast.success(res.message || "Review deleted", { id: tId });
          closeDeleteModal();
        } else {
          toast.error(res?.message || "Delete failed", { id: tId });
        }
      } catch (e: any) {
        toast.error(e?.message ?? "Delete failed", { id: tId });
      }
    });
  }

  return (
    <div className="grid gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Overview of your academy activity and feedback.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Registered Users" value={stats.users} />
        <StatCard title="Students" value={stats.students} />
        <StatCard title="Instructors" value={stats.instructors} />
        <StatCard title="Feedback" value={stats.reviewCount} />
      </div>

      {/* Reviews */}
      <div className="grid gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">All Reviews</h2>
          <p className="text-sm text-neutral-500">{reviews.length} item(s)</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((f) => (
            <motion.div
              key={String(f._id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold line-clamp-1">
                        {f.displayName ?? "Unknown"}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {formatDate(f.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {statusPill(Boolean(f.approved))}
                      {f.type ? (
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                          {f.type}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-3 text-sm">
                  {typeof f.rating === "number" ? (
                    <p className="text-xs text-neutral-500">Rating: {f.rating}/5</p>
                  ) : null}

                  {f.text ? <p className="text-sm text-neutral-700">{f.text}</p> : null}

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    {!f.approved && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onApprove(String(f._id))}
                        disabled={pending}
                      >
                        {pending ? "..." : "Approve"}
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={() => openDeleteModal(String(f._id))}
                      disabled={pending}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {reviews.length === 0 && (
            <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-neutral-600">
              No feedback yet.
            </div>
          )}
        </div>
      </div>

      {/* ✅ Delete Modal: Type DELETE */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 10, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.98 }}
              className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold">Hard delete this review?</h3>
              <p className="mt-2 text-sm text-neutral-600">
                This will permanently delete the review. Type{" "}
                <span className="font-semibold">DELETE</span> to confirm.
              </p>

              {deleteTarget?.text ? (
                <div className="mt-3 rounded-2xl bg-neutral-50 p-3 text-sm text-neutral-700">
                  {deleteTarget.text}
                </div>
              ) : null}

              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="mt-4 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold-400/60"
              />

              <div className="mt-4 flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={closeDeleteModal}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  className="flex-1"
                  onClick={onDeleteConfirmed}
                  disabled={confirmText !== "DELETE" || pending}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <p className="text-xs font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}