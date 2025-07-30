import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  // If the number has no decimal places, return it as is
  // If it has decimal places, show them
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}
