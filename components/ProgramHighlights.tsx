import { Palette, Ruler, Scissors, Users } from 'lucide-react'
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { galleryImages } from '@/data/galleryImages';
import Image from 'next/image';


const ProgramHighlights = () => {
  return (
     <Reveal delay={0.08}>
                      <div className="grid gap-4">
                        <motion.div
                          whileHover={{ y: -4 }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-ash-100">Next Cohort Starts</p>
                              <p className="mt-1 text-xl font-extrabold text-white">April 15, 2024</p>
                              <p className="mt-2 text-sm text-ash-200">
                                Only 8 spots remaining for our next batch. 
                                Apply now to secure your place in this intensive program.
                              </p>
                            </div>
                            <span className="rounded-2xl bg-gold-500 px-3 py-2 text-xs font-bold text-navy-900">
                              Limited Seats
                            </span>
                          </div>
    
                          <div className="mt-5 grid grid-cols-3 gap-3">
                            {galleryImages.slice(0, 3).map((src) => (
                              <div key={src} className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                                <Image src={src} alt="Student work preview" fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        </motion.div>
    
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-sm backdrop-blur">
                          <p className="text-sm font-semibold text-ash-100">What Makes Us Different</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <MiniPoint 
                              icon={<Scissors className="h-4 w-4" />}
                              title="Hands-on Practice" 
                              desc="Learn on industrial machines with real fabrics" 
                            />
                            <MiniPoint 
                              icon={<Palette className="h-4 w-4" />}
                              title="Design Principles" 
                              desc="From sketching to finished garments" 
                            />
                            <MiniPoint 
                              icon={<Ruler className="h-4 w-4" />}
                              title="Pattern Making" 
                              desc="Master the art of perfect fit" 
                            />
                            <MiniPoint 
                              icon={<Users className="h-4 w-4" />}
                              title="Industry Network" 
                              desc="Connect with fashion professionals" 
                            />
                          </div>
                        </div>
                      </div>
                    </Reveal>
  )
}

export default ProgramHighlights



// Enhanced MiniPoint component with icons
function MiniPoint({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2">
        <span className="text-gold-300">{icon}</span>
        <p className="text-sm font-bold text-white">{title}</p>
      </div>
      <p className="mt-1 text-xs text-ash-200">{desc}</p>
    </div>
  );
}