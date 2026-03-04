import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: "dark" | "light";
}

export function CTABanner({ 
  title, 
  description, 
  buttonText, 
  buttonLink,
  variant = "dark" 
}: CTABannerProps) {
  const isDark = variant === "dark";
  
  return (
    <div className={`overflow-hidden rounded-3xl ${isDark ? 'bg-navy-900 text-white' : 'border border-ash-200 bg-white'} p-8`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-navy-900'}`}>{title}</p>
          <p className={`mt-1 text-sm ${isDark ? 'text-ash-200' : 'text-ash-600'}`}>{description}</p>
        </div>
        <Link
          href={buttonLink}
          className={`inline-flex w-fit items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition active:scale-[0.98] ${
            isDark 
              ? 'bg-gold-500 text-black hover:bg-gold-400' 
              : 'bg-navy-900 text-white hover:bg-navy-800'
          }`}
        >
          {buttonText} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}