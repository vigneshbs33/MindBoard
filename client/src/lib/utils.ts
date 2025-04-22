import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string 
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Format a number as a percentage
 */
export function formatPercent(num: number): string {
  return `${Math.round(num)}%`;
}

/**
 * Format a score out of 10
 */
export function formatScore(score: number): string {
  return (score / 10).toFixed(1);
}

/**
 * Generate a random username
 */
export function generateRandomUsername(): string {
  const adjectives = [
    "Creative", "Brilliant", "Witty", "Innovative", "Clever", 
    "Imaginative", "Inspired", "Original", "Smart", "Bold"
  ];
  
  const nouns = [
    "Thinker", "Genius", "Mind", "Creator", "Inventor", 
    "Visionary", "Artist", "Dreamer", "Explorer", "Designer"
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}${noun}${number}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
