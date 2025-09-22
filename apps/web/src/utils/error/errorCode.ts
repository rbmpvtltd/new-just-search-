
export const errorCodeMap: Record<
  string,
  { action: "redirect" | "toast"; path?: string; message?: string }
> = {
  PARSE_ERROR: { action: "toast", message: "Invalid request format" },
  BAD_REQUEST: { action: "toast", message: "Bad request" },
  INTERNAL_SERVER_ERROR: { action: "toast", message: "Server error, try later" },
  NOT_IMPLEMENTED: { action: "redirect", path: "../coming-soon" },
  BAD_GATEWAY: { action: "toast", message: "Bad gateway" },
  SERVICE_UNAVAILABLE: { action: "redirect", path: "../maintenance" },
  GATEWAY_TIMEOUT: { action: "toast", message: "Gateway timeout" },
  UNAUTHORIZED: { action: "redirect", path: "../login" },
  PAYMENT_REQUIRED: { action: "redirect", path: "../payment" },
  FORBIDDEN: { action: "redirect", path: "../forbidden" },
  NOT_FOUND: { action: "redirect", path: "../404" },
  METHOD_NOT_SUPPORTED: { action: "toast", message: "Method not supported" },
  TIMEOUT: { action: "toast", message: "Request timed out" },
  CONFLICT: { action: "toast", message: "Resource conflict" },
  PRECONDITION_FAILED: { action: "redirect", path: "../verify-otp" },
  PAYLOAD_TOO_LARGE: { action: "toast", message: "Payload too large" },
  UNSUPPORTED_MEDIA_TYPE: { action: "toast", message: "Unsupported media type" },
  UNPROCESSABLE_CONTENT: { action: "toast", message: "Cannot process content" },
  TOO_MANY_REQUESTS: { action: "toast", message: "Too many requests" },
  CLIENT_CLOSED_REQUEST: { action: "toast", message: "Request closed by client" },
  undefined: { action: "toast", message: "Unknown error" },
};
