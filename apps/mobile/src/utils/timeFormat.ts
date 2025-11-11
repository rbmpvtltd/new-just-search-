
export const toISOStringTime = (time: string | Date): string => {
  if (typeof time !== "string") {
    return time.toISOString();
  }

  if (time.includes("T")) return time;

  const [hours, mintues] = time.split(":").map(Number);
  const now = new Date();

  now.setHours(hours, mintues, 0, 0);
  return now.toISOString();
};

export const formatTime = (time: string | Date): string => {
  const date = typeof time === "string" ? new Date(time) : time;

  const hours = date.getHours().toString().padStart(2, "0");
  const mintues = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${mintues}`;
};
