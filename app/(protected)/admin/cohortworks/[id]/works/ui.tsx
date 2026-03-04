"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createWork } from "./actions";
import { ImageIcon, Trash2, UploadCloud, X } from "lucide-react";

type Props = {
  cohortId: string;
  cohortTitle: string;
};

const MAX_MB = 8;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function AdminWorkUploader({ cohortId, cohortTitle }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [studentName, setStudentName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => !!file && !loading, [file, loading]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function resetForm() {
    setFile(null);
    setTitle("");
    setStudentName("");
    setCategory("");
    setDescription("");
    setPreview("null");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validateFile(f: File) {
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Unsupported file type. Use JPG, PNG or WebP.");
      return false;
    }
    const sizeMb = f.size / (1024 * 1024);
    if (sizeMb > MAX_MB) {
      toast.error(`File too large. Max ${MAX_MB}MB (yours: ${sizeMb.toFixed(1)}MB).`);
      return false;
    }
    return true;
  }

  async function getSignature(folder: string) {
    const signRes = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    if (!signRes.ok) {
      const text = await signRes.text().catch(() => "");
      throw new Error(`Failed to sign upload. ${text}`);
    }
    return signRes.json();
  }

  // ✅ Cloudinary upload with progress (XHR)
  async function uploadToCloudinaryWithProgress(f: File) {
    const folder = `mfa/cohorts/${cohortId}`;
    const { cloudName, apiKey, timestamp, signature } = await getSignature(folder);

    const form = new FormData();
    form.append("file", f);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("folder", folder);

    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      };

      xhr.onload = () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Cloudinary upload failed (${xhr.status}).`));
          }
        } catch (err) {
          reject(err);
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(form);
    });
  }

  async function onSubmit() {
    if (!file) {
      toast("Select an image first.");
      return;
    }

    setLoading(true);
    setProgress(0);

    // react-hot-toast loading returns an id string
    const toastId = toast.loading("Uploading image...");

    try {
      const uploaded = await uploadToCloudinaryWithProgress(file);

      toast.loading("Saving work to database...", { id: toastId });

      const res = await createWork(cohortId, {
        title,
        studentName,
        category,
        description,
        imageUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        width: uploaded.width,
        height: uploaded.height,
      });

      if (res?.ok) {
        toast.success("Work uploaded successfully!", { id: toastId });
        resetForm();
      } else {
        toast.error(res?.message ?? "Upload saved failed. Please try again.", { id: toastId });
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
        <h1 className="text-xl font-extrabold">Upload Works • {cohortTitle}</h1>
        <p className="mt-1 text-sm text-ash-200">
          Upload student designs for this cohort. These will appear on the public Works page.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      >
        <div className="grid gap-5 lg:grid-cols-5">
          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <div className="relative aspect-[4/3]">
                {preview ? (
                  <>
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-ash-200">
                        {file?.name ? (
                          <>
                            {file.name}
                            {" • "}
                            {(file.size / (1024 * 1024)).toFixed(1)}MB
                          </>
                        ) : (
                          <span className="text-ash-300">No file selected</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                      >
                        <Trash2 className="h-4 w-4 text-gold-300" />
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
                    <ImageIcon className="h-8 w-8 text-ash-300" />
                    <p className="text-sm font-semibold text-white">Image preview</p>
                    <p className="text-xs text-ash-200">Upload a JPG/PNG/WebP (max {MAX_MB}MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            {loading ? (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-ash-200">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gold-500 transition-[width] duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Fields */}
          <div className="grid gap-4 lg:col-span-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-ash-200">
              Work title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold-400/40"
                placeholder="e.g. Elegant AsoEbi"
              />
            </label>

            <label className="grid gap-2 text-sm text-ash-200">
              Student name (optional)
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold-400/40"
                placeholder="e.g. Adaobi Adejero"
              />
            </label>

            <label className="grid gap-2 text-sm text-ash-200">
              Category (optional)
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold-400/40"
                placeholder="e.g. Bridal / Corsetry / RTW"
              />
            </label>

            <label className="grid gap-2 text-sm text-ash-200">
              Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (!f) return;
                  if (!validateFile(f)) {
                    e.currentTarget.value = "";
                    return;
                  }
                  setFile(f);
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ash-200"
              />
              <p className="text-[11px] text-ash-300">Tip: Use clear, well-lit images for best conversions.</p>
            </label>

            <label className="md:col-span-2 grid gap-2 text-sm text-ash-200">
              Description (optional)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold-400/40"
                placeholder="Short details about this design..."
              />
            </label>

            <div className="md:col-span-2 mt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 hover:bg-gold-400 disabled:opacity-60"
              >
                <UploadCloud className="h-4 w-4" />
                {loading ? "Uploading..." : "Upload Work"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
              >
                <X className="h-4 w-4 text-ash-200" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}