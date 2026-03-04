"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function StudentNotesClient({ notes }: { notes: any[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return notes;
    return notes.filter((n: any) => String(n.title ?? "").toLowerCase().includes(s));
  }, [notes, q]);

  return (
    <div className="grid gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Student • Notes</h1>
            <p className="mt-1 text-sm text-neutral-600">Notes uploaded by instructors for your cohort.</p>
          </div>
          <div className="w-full md:w-[360px]">
            <Input placeholder="Search notes..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((n: any) => (
          <motion.div key={String(n._id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="space-y-1">
                <h3 className="text-base font-semibold">{n.title}</h3>
                <p className="text-xs text-neutral-500">{n.visibility}</p>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                {n.description ? <p className="text-sm text-neutral-600">{n.description}</p> : null}
                <a className="underline" href={n.fileUrl} target="_blank" rel="noreferrer">
                  Open note file
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
