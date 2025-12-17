export const redirectRole = (role: string) => {
  if (role === "franchises") {
    return "/franchise";
  }
  if (role === "salesman") {
    return "/salesman";
  }
  if (role === "admin") {
    return "/admin";
  }
  return "/login";
};
