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
