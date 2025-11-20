export function isEmail(identifier: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
}

export function isMobileNumber(identifier: string): boolean {
  // Indian mobile number format (10 digits, optionally with +91 or 91)
  const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return mobileRegex.test(identifier.replace(/[\s-]/g, ""));
}

export function normalizeMobile(mobile: string): string {
  // Remove spaces, hyphens and country code to get 10 digit number
  return mobile.replace(/[\s-]/g, "").replace(/^(\+91|91)/, "");
}