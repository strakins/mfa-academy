import Link from "next/link"
import Reveal from "./Reveal"
import { ArrowRight, GraduationCap } from "lucide-react"



const FinalCTABAnner = () => {
  return (
    <Reveal delay={0.2}>
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-3 md:p-10 text-center text-white">
                <GraduationCap className="mx-auto h-10 w-10 text-amber-400" />
                <h3 className="mt-4 text-xl md:text-2xl font-bold">Your Future in Fashion Starts Here</h3>
                <p className="mt-3 text-white/90 text-sm md:text-base max-w-2xl mx-auto">
                  Join our next cohort and begin your transformation into a fashion professional.
                  Spaces fill quickly — secure yours today.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 active:scale-[0.98]"
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-7 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-[0.98]"
                  >
                    Browse Programs
                  </Link>
                </div>
              </div>

    </Reveal>
  )
}

export default FinalCTABAnner
