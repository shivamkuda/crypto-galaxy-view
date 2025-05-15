
/**
 * Format a timestamp to a date string based on the time range
 * @param timestamp UNIX timestamp in milliseconds
 * @param timeRange Time range in days
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number, timeRange: number): string => {
  const date = new Date(timestamp);
  if (timeRange <= 1) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (timeRange <= 30) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
  }
};

/**
 * Format a price to a USD string
 * @param value Price value
 * @returns Formatted price string
 */
export const formatPriceTooltip = (value: number): string => {
  return `$${value.toFixed(2)}`;
};
