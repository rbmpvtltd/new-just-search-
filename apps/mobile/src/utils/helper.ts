export const maskPhone = (input: string) => {
  const digits = String(input).replace(/\D/g, "");
  if (digits.length <= 4) return "x".repeat(digits.length);
  return digits.slice(0, -4) + "x".repeat(4);
};
