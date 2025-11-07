import { Timestamp } from 'firebase/firestore';
import type { SerializableTimestamp } from './types';

/**
 * Safely converts various timestamp formats (Firebase Timestamp, serialized object, string, number) to a JavaScript Date object.
 * @param ts The timestamp to convert. Can be a Firebase Timestamp, an object with seconds and nanoseconds, a date string, or a number.
 * @returns A Date object, or the current date as a fallback if the input is invalid.
 */
export const timestampToDate = (ts: any): Date => {
  if (!ts) {
    // Return current date for null/undefined to avoid crashes, but log a warning.
    console.warn("timestampToDate received a null or undefined value.");
    return new Date();
  }
  // Case 1: Already a Date object
  if (ts instanceof Date) {
    return ts;
  }
  // Case 2: Firebase Timestamp object
  if (ts instanceof Timestamp) {
    return ts.toDate();
  }
  // Case 3: Serialized object from server component { seconds, nanoseconds }
  if (ts && typeof ts.seconds === 'number' && typeof ts.nanoseconds === 'number') {
    return new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000);
  }
  // Case 4: Date string or number (from JSON serialization or other sources)
  if (typeof ts === 'string' || typeof ts === 'number') {
    const date = new Date(ts);
    // Check if the conversion was successful
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Fallback for any unhandled or invalid cases.
  console.error("Failed to convert timestamp to date:", ts);
  return new Date();
};

/**
 * Converts a Date object to a serializable timestamp format.
 * This is crucial for passing date information from Server Components to Client Components.
 * @param date The Date object to convert.
 * @returns An object with `seconds` and `nanoseconds`.
 */
export function toSerializableTimestamp(date: Date): SerializableTimestamp {
    const seconds = Math.floor(date.getTime() / 1000);
    const nanoseconds = (date.getTime() % 1000) * 1000000;
    return { seconds, nanoseconds };
}
