import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Wrapper for clsx that de-duplicates and merges tailwind classes
 */
export const cn = (...args: ClassValue[]): string => {
  return twMerge(clsx(...args))
}
