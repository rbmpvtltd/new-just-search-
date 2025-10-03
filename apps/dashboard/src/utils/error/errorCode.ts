export const errorCodeMap: Record<
  string,
  { message: string; redirect?: string; toast?: string }
> = {
  PARSE_ERROR: { message: "Invalid request format", toast: "Invalid request!" },
  BAD_REQUEST: { message: "Bad request", toast: "Something went wrong!" },
  INTERNAL_SERVER_ERROR: {
    message: "Server error, try later",
    toast: "Server error!",
  },
  NOT_IMPLEMENTED: {
    message: "Feature not implemented",
    redirect: "/coming-soon",
    toast: "Coming soon!",
  },
  BAD_GATEWAY: { message: "Bad gateway", toast: "Gateway error!" },
  SERVICE_UNAVAILABLE: {
    message: "Service unavailable, please try later",
    redirect: "/maintenance",
    toast: "Service unavailable!",
  },
  GATEWAY_TIMEOUT: { message: "Gateway timeout", toast: "Gateway timeout!" },

  UNAUTHORIZED: {
    message: "You must login to continue",
    redirect: "/login",
    toast: "Login required!",
  },
  PAYMENT_REQUIRED: {
    message: "Payment required",
    redirect: "/payment",
    toast: "Payment required!",
  },
  FORBIDDEN: {
    message: "You don't have permission to access this resource",
    redirect: "/forbidden",
    toast: "Access denied!",
  },
  NOT_FOUND: {
    message: "The requested resource was not found",
    redirect: "/404",
    toast: "Not found!",
  },

  METHOD_NOT_SUPPORTED: {
    message: "Method not supported",
    toast: "Method not supported!",
  },
  TIMEOUT: { message: "Request timed out", toast: "Request timed out!" },
  CONFLICT: { message: "Resource conflict", toast: "Conflict detected!" },
  PRECONDITION_FAILED: {
    message: "Precondition failed (e.g., OTP required)",
    redirect: "/verify-otp",
    toast: "OTP required!",
  },
  PAYLOAD_TOO_LARGE: {
    message: "Payload too large",
    toast: "Payload too large!",
  },
  UNSUPPORTED_MEDIA_TYPE: {
    message: "Unsupported media type",
    toast: "Unsupported media type!",
  },
  UNPROCESSABLE_CONTENT: {
    message: "Cannot process content",
    toast: "Cannot process content!",
  },
  TOO_MANY_REQUESTS: {
    message: "Too many requests, slow down!",
    toast: "Too many requests!",
  },
  CLIENT_CLOSED_REQUEST: {
    message: "Request closed by client",
    toast: "Client closed request!",
  },

  undefined: { message: "Unknown error occurred", toast: "Unknown error!" },
};
