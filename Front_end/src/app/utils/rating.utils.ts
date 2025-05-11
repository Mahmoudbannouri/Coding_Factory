// Create a new file: src/app/utils/rating.utils.ts
export function validateRating(rate: number): number {
  if (rate === undefined || rate === null || isNaN(rate)) {
    return 0;
  }
  return Math.min(Math.max(rate, 0), 5); // Clamp between 0-5
}
