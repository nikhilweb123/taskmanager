/**
 * Date utility functions for handling UTC timestamps from Supabase
 * 
 * Supabase returns timestamptz columns as ISO 8601 strings in UTC.
 * These utilities ensure proper conversion to local timezone for display.
 */

import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats a UTC timestamp string from Supabase to local timezone
 * @param utcTimestamp - ISO 8601 string from Supabase (UTC)
 * @param formatString - date-fns format string (default: 'M/d/yyyy, h:mm:ss a')
 * @returns Formatted date string in local timezone, or error message
 */
export function formatUTCTimestamp(
  utcTimestamp: string | null | undefined,
  formatString: string = 'M/d/yyyy, h:mm:ss a'
): string {
  if (!utcTimestamp) {
    return 'N/A';
  }

  try {
    // Parse ISO 8601 string (Supabase returns UTC timestamps)
    // parseISO correctly handles ISO strings with or without timezone info
    const date = parseISO(utcTimestamp);

    // Validate the parsed date
    if (!isValid(date)) {
      console.error('Invalid date string:', utcTimestamp);
      return 'Invalid date';
    }

    // Format to local timezone (format automatically uses local time)
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error, utcTimestamp);
    return 'Error formatting date';
  }
}

/**
 * Formats a UTC timestamp to a relative time string (e.g., "2 hours ago")
 * @param utcTimestamp - ISO 8601 string from Supabase (UTC)
 * @returns Relative time string
 */
export function formatRelativeTime(utcTimestamp: string | null | undefined): string {
  if (!utcTimestamp) {
    return 'N/A';
  }

  try {
    const date = parseISO(utcTimestamp);
    if (!isValid(date)) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return format(date, 'M/d/yyyy');
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Error';
  }
}
