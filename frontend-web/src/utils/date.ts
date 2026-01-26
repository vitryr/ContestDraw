// Simple date formatting utilities to avoid external dependency
export const format = (date: Date, formatStr: string): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (formatStr === "MMM d, yyyy") {
    return `${month} ${day}, ${year}`;
  }

  // Default format
  return date.toLocaleDateString();
};
