export const isoStringToTime = (isoString: string) => {
  const date = new Date(isoString);

  // Format to India time (IST = Asia/Kolkata)
  const timeInIndia = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  return timeInIndia;
};




export function normalizeDate(value: unknown): string  {
  if (!value) return "";

  // If it's already a Date
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString();
  }

  // If it's a string (maybe ISO or local)
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  // Sometimes react-hook-form stores { $d: Date } when using date pickers (like dayjs)
  if (typeof value === "object" && value && "$d" in value) {
    const date = (value as any).$d;
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  return "";
}


// Convert ISO string or unknown value back to Date object
export function denormalizeDate(value: unknown): Date | undefined {
  if (!value) return undefined;

  // If it's already a Date
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  // If it's a string (ISO or local)
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // If it's an object like { $d: Date } (from dayjs or react-hook-form calendar)
  if (typeof value === "object" && value && "$d" in value) {
    const date = (value as any).$d;
    if (date instanceof Date && !isNaN(date.getTime())) return date;
  }

  return undefined;
}
