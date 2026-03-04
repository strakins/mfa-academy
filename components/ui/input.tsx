import * as React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm",
        "outline-none focus:ring-2 focus:ring-black/20",
        props.className
      )}
    />
  );
}
