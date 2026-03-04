"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiSend } from "@/lib/utils";

export default function ContactPageClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please complete required fields");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Sending message...");

    try {
      await apiSend("/api/contact", "POST", form);

      toast.success("Message sent successfully!", { id: toastId });

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (e: any) {
      toast.error(e.message || "Failed to send message", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-navy-900 text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm text-gold-400">CONTACT</p>

            <h1 className="mt-2 text-4xl font-bold">
              Get in touch with us
            </h1>

            <p className="mt-4 max-w-xl text-ash-200">
              Have questions about admissions, courses, or partnerships?
              Send us a message and our team will respond promptly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2">

          {/* Form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <h2 className="text-xl font-semibold">
              Send Message
            </h2>

            <input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />

            <input
              placeholder="Your email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />

            <input
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />

            <textarea
              placeholder="Message"
              rows={5}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />

            <Button
              disabled={loading}
              className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400"
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <InfoCard
              title="Email"
              value="info@yourdomain.com"
            />

            <InfoCard
              title="Phone"
              value="+234 800 000 0000"
            />

            <InfoCard
              title="Address"
              value="Ibadan, Nigeria"
            />

            <InfoCard
              title="Working Hours"
              value="Mon - Fri, 9AM - 5PM"
            />

            {/* Map */}
            <div className="rounded-3xl overflow-hidden border border-white/10">
              <iframe
                src="https://maps.google.com/maps?q=Ibadan&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-60 border-0"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <FAQ
              q="How do I apply?"
              a="Create an account and apply through your profile dashboard."
            />

            <FAQ
              q="How long does approval take?"
              a="Usually within 24-72 hours."
            />

            <FAQ
              q="Can I upload my portfolio?"
              a="Yes, after approval you can upload your projects."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ title, value }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-ash-300">{title}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function FAQ({ q, a }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="font-semibold">{q}</p>
      <p className="text-sm text-ash-200 mt-1">{a}</p>
    </div>
  );
}