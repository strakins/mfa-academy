"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function StudentAssignmentsClient({ assignments }: { assignments: any[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return assignments;
    return assignments.filter((a: any) => String(a.title ?? "").toLowerCase().includes(s));
  }, [assignments, q]);

  return (
    <div className="grid gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Student • Assignments</h1>
            <p className="mt-1 text-sm text-neutral-600">Assignments for your cohort (with attached reference files).</p>
          </div>
          <div className="w-full md:w-[360px]">
            <Input placeholder="Search assignments..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((a: any) => (
          <motion.div key={String(a._id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold">{a.title}</h3>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                    Assets: {a.assets?.length ?? 0}
                  </span>
                </div>
                {a.dueDate ? (
                  <p className="text-xs text-neutral-500">Due: {String(a.dueDate).slice(0, 10)}</p>
                ) : null}
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                {a.description ? <p className="text-sm text-neutral-600">{a.description}</p> : null}
                <div className="flex flex-wrap gap-2">
                  {(a.assets || []).map((x: any, idx: number) => (
                    <a key={idx} className="text-xs underline" href={x.url} target="_blank" rel="noreferrer">
                      Asset {idx + 1}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
