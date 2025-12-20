import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @intent Utility function to merge Tailwind classes conditionally
 * @param {...any} inputs - Class names or conditional class objects
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
