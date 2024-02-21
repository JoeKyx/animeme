import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// A function that takes width and height and scales it down to max 1536x1536
// while maintaining the aspect ratio.
// Must be divisible by 8.
export function scaleDown(width: number, height: number): [number, number] {
  const maxWidth = 1536
  const maxHeight = 1536
  const ratio = Math.min(maxWidth / width, maxHeight / height)
  return [Math.floor(width * ratio / 8) * 8, Math.floor(height * ratio / 8) * 8]
}