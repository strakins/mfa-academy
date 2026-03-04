import Link from "next/link";
import { getCourses } from "@/lib/courses";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatNgn(n: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Courses & Pricing</h1>
        <p className="mt-2 text-sm text-neutral-600 md:text-base">
          Choose a track that fits your goal. Apply online and join the next cohort.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/sign-up"><Button>Apply / Create Account</Button></Link>
          <Link href="/works"><Button variant="outline">View Past Works</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c: any) => (
          <Card key={String(c._id)} className="overflow-hidden">
            <CardHeader className="space-y-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="text-sm text-neutral-600">Duration: {c.durationMonths} months</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Tuition</p>
                  <p className="text-base font-semibold">{formatNgn(c.tuitionNgn)}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(c.trackTags || []).map((t: string) => (
                  <span key={t} className="rounded-full border border-black/10 bg-neutral-50 px-2.5 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </CardHeader>

            <CardContent className="grid gap-4">
              <p className="text-sm text-neutral-600">{c.audience}</p>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm font-medium">What you’ll learn</p>
                <ul className="mt-2 grid gap-1 text-sm text-neutral-600">
                  {(c.outlines || []).slice(0, 6).map((o: string) => (
                    <li key={o} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
