import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 * @param {...(string|object|array)} inputs - Class names to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Generates a shareable appointment link
 * @param {string} appointmentId - The appointment ID
 * @returns {string} Shareable URL
 */
export function generateShareLink(appointmentId) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/book/${appointmentId}`;
}
