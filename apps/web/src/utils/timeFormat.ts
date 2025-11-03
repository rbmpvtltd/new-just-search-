export function formatTime(time: string | undefined): string | undefined {
  const formattedTime = time ?? "";
  const [hour, minute] = formattedTime.split(":");
  const h = parseInt(String(hour), 10);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minute} ${period}`;
}
