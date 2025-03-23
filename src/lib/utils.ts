import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createContext, useContext } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
