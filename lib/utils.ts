// import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export async function apiSend<T>(
//   url: string,
//   method: "POST" | "PATCH" | "DELETE",
//   body?: any
// ): Promise<T> {
//   const res = await fetch(url, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) {
//     const data = await res.json().catch(() => ({}));
//     throw new Error(data?.error ? String(data.error) : `${method} ${url} failed`);
//   }
//   return res.json();
// }


import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ GET helper
export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Try to surface useful error messages
    try {
      const json = JSON.parse(text);
      throw new Error(json?.error ? String(json.error) : `GET ${url} failed`);
    } catch {
      throw new Error(text || `GET ${url} failed`);
    }
  }

  return res.json();
}

// ✅ POST/PATCH/DELETE helper
export async function apiSend<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: any
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    try {
      const json = JSON.parse(text);
      throw new Error(json?.error ? String(json.error) : `${method} ${url} failed`);
    } catch {
      throw new Error(text || `${method} ${url} failed`);
    }
  }

  return res.json();
}