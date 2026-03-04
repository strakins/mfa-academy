"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAssignment, deleteAssignment } from "./actions";

async function uploadToCloudinary(file: File, folder: string) {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!signRes.ok) throw new Error("Could not sign upload");
  const sig = await signRes.json();

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;
  const upRes = await fetch(uploadUrl, { method: "POST", body: fd });
  if (!upRes.ok) throw new Error("Upload failed");
  const out = await upRes.json();

  const type =
    file.type.includes("pdf") ? "pdf" : file.type.startsWith("image/") ? "image" : "other";

  return { url: out.secure_url as string, publicId: out.public_id as string, type };
}

export default function InstructorAssignmentsClient({ cohorts, assignments }: { cohorts: any[]; assignments: any[] }) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<{ url: string; publicId?: string; type: string }[]>([]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return assignments;
    return assignments.filter((a: any) => {
      const cohortName = a.cohortId?.name ?? "";
      return String(a.title ?? "").toLowerCase().includes(s) || String(cohortName).toLowerCase().includes(s);
    });
  }, [assignments, q]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function onCreate(fd: FormData) {
    startTransition(async () => {
      fd.set("assetsJson", JSON.stringify(assets));
      const res = await createAssignment(fd);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  async function onDelete(id: string) {
    const ok = confirm("Delete this assignment?");
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteAssignment(id);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  return (
    <div className="grid gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Instructor • Assignments</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Create assignments per cohort and attach reference designs/files.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <Input placeholder="Search assignments..." value={q} onChange={(e) => setQ(e.target.value)} />
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

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Create assignment</h2>
          <p className="text-sm text-neutral-600">Add a due date and attach assets (images/PDFs).</p>
        </CardHeader>
        <CardContent>
          <form action={onCreate} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-neutral-700">Title</label>
                <Input name="title" placeholder="e.g. Make a corset bodice (Week 3)" required />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-700">Cohort</label>
                <select
                  name="cohortId"
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select cohort</option>
                  {cohorts.map((c: any) => (
                    <option key={String(c._id)} value={String(c._id)}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-neutral-700">Due date (optional)</label>
                <Input name="dueDate" type="date" />
              </div>
              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                <p className="text-sm font-medium">Attach assets</p>
                <p className="mt-1 text-xs text-neutral-500">Upload reference image/PDF.</p>

                <div className="mt-3 grid gap-2">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setUploading(true);
                      try {
                        const out = await uploadToCloudinary(f, "mfa/assignments");
                        setAssets((prev) => [...prev, out]);
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                  {uploading ? (
                    <p className="text-sm text-neutral-600">Uploading…</p>
                  ) : (
                    <p className="text-sm text-neutral-600">{assets.length} asset(s) attached</p>
                  )}

                  {assets.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {assets.slice(0, 6).map((a, idx) => (
                        <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="text-xs underline">
                          Asset {idx + 1}
                        </a>
                      ))}
                      <button
                        type="button"
                        className="text-xs underline text-neutral-600"
                        onClick={() => setAssets([])}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700">Description (optional)</label>
              <Input name="description" placeholder="What students should deliver, format, tips..." />
            </div>

            <Button type="submit" disabled={pending || uploading}>
              {pending ? "Publishing..." : "Publish assignment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((a: any) => (
          <motion.div key={String(a._id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">{a.title}</h3>
                    <p className="text-xs text-neutral-500">{a.cohortId?.name ?? "Cohort"}</p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                    Assets: {a.assets?.length ?? 0}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                {a.description ? <p className="text-sm text-neutral-600">{a.description}</p> : null}
                {a.dueDate ? <p className="text-xs text-neutral-500">Due: {String(a.dueDate).slice(0, 10)}</p> : null}
                <div className="flex flex-wrap gap-2">
                  {(a.assets || []).slice(0, 6).map((x: any, idx: number) => (
                    <a key={idx} className="text-xs underline" href={x.url} target="_blank" rel="noreferrer">
                      Asset {idx + 1}
                    </a>
                  ))}
                </div>
                <Button type="button" onClick={() => onDelete(String(a._id))} disabled={pending}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
