import React from 'react'
import Reveal from './Reveal'
import { CheckCircle2 } from 'lucide-react'

const Details = () => {
  return (
    <Reveal delay={0.26}>
      <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
         <p className="text-sm font-semibold text-white">Why Choose MFA?</p>
            <ul className="mt-2 space-y-2 text-sm text-ash-200">
              {[
                "4 intensive batches yearly (Jan, Apr, Jul, Oct)",
                "Registration fee: ₦10,000 (flexible payment plans available)",
                "Beginner to Advanced tracks with personalized learning paths",
                "Student works featured in our annual fashion showcase",
                "Industry networking events and guest lectures",
              ].map((t) => (
               <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-gold-300" />
                <span>{t}</span>
               </li>
             ))}
            </ul>
        </div>
     </Reveal>
  )
}

export default Details
