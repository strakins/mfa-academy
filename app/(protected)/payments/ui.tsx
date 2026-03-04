"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitPayment } from "./actions";

type AppItem = any;
type PayItem = any;

function formatNgn(n: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

async function uploadToCloudinary(file: File) {
  const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
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

  return { url: out.secure_url as string, publicId: out.public_id as string };
}

export default function PaymentsClient({ applications, payments }: { applications: AppItem[]; payments: PayItem[] }) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const pendingApps = useMemo(() => {
    const paidAppIds = new Set(payments.map((p) => String(p.applicationId?._id ?? p.applicationId)));
    return applications.filter((a) => !paidAppIds.has(String(a._id)));
  }, [applications, payments]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitPayment(formData);
      showToast(res.message);
      if (res.ok) window.location.reload();
    });
  }

  return (
    <div className="grid gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Upload proof of payment for your application. Admin will approve and your student access unlocks automatically.
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

      {/* Submit Payment */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Submit payment proof</h2>
          <p className="text-sm text-neutral-600">Fast upload • secure • mobile-friendly</p>
        </CardHeader>
        <CardContent>
          {pendingApps.length === 0 ? (
            <p className="text-sm text-neutral-600">
              No pending applications to pay for. If you already submitted, check your status below.
            </p>
          ) : (
            <PaymentForm pending={pending} onSubmit={handleSubmit} applications={pendingApps} />
          )}
        </CardContent>
      </Card>

      {/* Status List */}
      <div className="grid gap-4 md:grid-cols-2">
        {payments.map((p: any) => {
          const status = p.status as "PENDING" | "APPROVED" | "DECLINED";
          const pill =
            status === "APPROVED"
              ? "bg-green-50 text-green-700"
              : status === "DECLINED"
              ? "bg-red-50 text-red-700"
              : "bg-neutral-100 text-neutral-700";

          const cohortName = p.applicationId?.cohortId?.name ?? "—";
          const courseTitle = p.applicationId?.courseId?.title ?? "—";

          return (
            <motion.div key={String(p._id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold">{courseTitle}</h3>
                      <p className="text-xs text-neutral-500">{cohortName}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs ${pill}`}>{status}</span>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div className="rounded-2xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Amount</p>
                    <p className="font-medium">{formatNgn(p.amountNgn)}</p>
                  </div>
                  <a className="text-sm underline" href={p.proofUrl} target="_blank" rel="noreferrer">
                    View uploaded proof
                  </a>
                  {p.reviewNote ? <p className="text-sm text-neutral-600">Admin note: {p.reviewNote}</p> : null}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentForm({
  applications,
  pending,
  onSubmit,
}: {
  applications: any[];
  pending: boolean;
  onSubmit: (fd: FormData) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [proofPublicId, setProofPublicId] = useState("");

  return (
    <form action={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-neutral-700">Application</label>
          <select
            name="applicationId"
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
            required
            defaultValue=""
          >
            <option value="" disabled>Select application</option>
            {applications.map((a: any) => (
              <option key={String(a._id)} value={String(a._id)}>
                {a.courseId?.title} • {a.cohortId?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700">Amount paid (NGN)</label>
          <Input name="amountNgn" type="number" min={0} placeholder="e.g. 160000" required />
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
        <p className="text-sm font-medium">Proof upload (Cloudinary)</p>
        <p className="mt-1 text-xs text-neutral-500">Upload a screenshot or receipt.</p>

        <div className="mt-3 grid gap-3 md:grid-cols-2 md:items-end">
          <div>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setUploading(true);
                try {
                  const out = await uploadToCloudinary(f);
                  setProofUrl(out.url);
                  setProofPublicId(out.publicId);
                } finally {
                  setUploading(false);
                }
              }}
            />
          </div>

          <div className="text-sm">
            {uploading ? (
              <span className="text-neutral-600">Uploading…</span>
            ) : proofUrl ? (
              <a className="underline" href={proofUrl} target="_blank" rel="noreferrer">
                Proof uploaded ✓ (click to view)
              </a>
            ) : (
              <span className="text-neutral-600">No file uploaded yet</span>
            )}
          </div>
        </div>

        <input type="hidden" name="proofUrl" value={proofUrl} />
        <input type="hidden" name="proofPublicId" value={proofPublicId} />
      </div>

      <Button type="submit" disabled={pending || uploading || !proofUrl}>
        {pending ? "Submitting..." : "Submit payment proof"}
      </Button>
    </form>
  );
}
