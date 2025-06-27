import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const TOAST_CONFIG = {
  success: {
    duration: 2000,
    style: { background: "var(--success)", color: "#fff" },
  },
  error: {
    duration: 4000,
    style: { background: "var(--error)", color: "#fff" },
  },
};
