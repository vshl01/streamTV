import clsx, { type ClassValue } from "clsx";

/**
 * Merge conditional class names into a single string.
 * Thin wrapper over `clsx` so components have one import for class logic.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
