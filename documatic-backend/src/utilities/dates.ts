/**
 * Formats a date into PostgreSQL timestamp with timezone format
 * Format: YYYY-MM-DD HH:mm:ss.SSSZ
 * @param date Date object or ISO string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  // Format to match Payload's PostgreSQL format
  return d.toISOString().replace('T', ' ').replace('Z', '+00');
};

/**
 * Creates a properly formatted date string for the current time
 * @returns Current date formatted for Payload
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};
