export const safeArray = (val: any) => {
  if (!val) return [];
  try {
    const parsed = Array.isArray(val) ? val : JSON.parse(val);
    return parsed.map((v) =>
      typeof v === "string"
        ? v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()
        : v
    );
  } catch {
    return [];
  }
};
