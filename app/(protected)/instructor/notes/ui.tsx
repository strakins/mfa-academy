"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNote, deleteNote } from "./actions";

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

  return { url: out.secure_url as string, publicId: out.public_id as string, format: out.format as string };
}

function guessFileType(file: File): "pdf" | "image" | "other" {
  if (file.type.includes("pdf")) return "pdf";
  if (file.type.startsWith("image/")) return "image";
  return "other";
}

export default function InstructorNotesClient({ cohorts, notes }: { cohorts: any[]; notes: any[] }) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [filePublicId, setFilePublicId] = useState("");
  const [fileType, setFileType] = useState<"pdf" | "image" | "other">("other");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return notes;
    return notes.filter((n: any) => {
      const cohortName = n.cohortId?.name ?? "";
      return (
        String(n.title ?? "").toLowerCase().includes(s) ||
        String(cohortName).toLowerCase().includes(s)
      );
    });
  }, [notes, q]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function onCreate(fd: FormData) {
    startTransition(async () => {
      fd.set("fileUrl", fileUrl);
      fd.set("filePublicId", filePublicId);
      fd.set("fileType", fileType);

      const res = await createNote(fd);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  async function onDelete(id: string) {
    const ok = confirm("Delete this note?");
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteNote(id);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  return (
    <div className="grid gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Instructor • Notes</h1>
            <p className="mt-1 text-sm text-neutral-600">Upload notes per cohort. Students only see their cohort notes.</p>
          </div>
          <div className="w-full md:w-[360px]">
            <Input placeholder="Search notes..." value={q} onChange={(e) => setQ(e.target.value)} />
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
          <h2 className="text-lg font-semibold">Upload note</h2>
          <p className="text-sm text-neutral-600">Mobile-friendly form • clean layout • secure upload</p>
        </CardHeader>
        <CardContent>
          <form action={onCreate} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-neutral-700">Title</label>
                <Input name="title" placeholder="e.g. Dart Manipulation (Week 2)" required />
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

            <div>
              <label className="text-xs font-medium text-neutral-700">Description (optional)</label>
              <Input name="description" placeholder="Short description of the note..." />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-neutral-700">Visibility</label>
                <select
                  name="visibility"
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  defaultValue="STUDENTS_ONLY"
                >
                  <option value="STUDENTS_ONLY">Students only</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>

              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                <p className="text-sm font-medium">Attach file</p>
                <p className="mt-1 text-xs text-neutral-500">PDF/images recommended.</p>

                <div className="mt-3 grid gap-3">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setUploading(true);
                      try {
                        const t = guessFileType(f);
                        setFileType(t);
                        const out = await uploadToCloudinary(f, "mfa/notes");
                        setFileUrl(out.url);
                        setFilePublicId(out.publicId);
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />

                  {uploading ? (
                    <p className="text-sm text-neutral-600">Uploading…</p>
                  ) : fileUrl ? (
                    <a className="text-sm underline" href={fileUrl} target="_blank" rel="noreferrer">
                      File uploaded ✓ (click to view)
                    </a>
                  ) : (
                    <p className="text-sm text-neutral-600">No file uploaded yet</p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={pending || uploading || !fileUrl}>
              {pending ? "Saving..." : "Publish note"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((n: any) => (
          <motion.div key={String(n._id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">{n.title}</h3>
                    <p className="text-xs text-neutral-500">{n.cohortId?.name ?? "Cohort"}</p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                    {n.visibility}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                {n.description ? <p className="text-sm text-neutral-600">{n.description}</p> : null}
                <a className="underline" href={n.fileUrl} target="_blank" rel="noreferrer">
                  Open file
                </a>
                <Button type="button" onClick={() => onDelete(String(n._id))} disabled={pending}>
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
