export const errorCodeMap: Record<
	string,
	{ message: string; redirect?: string }
> = {
	PARSE_ERROR: { message: "Invalid request format" },
	BAD_REQUEST: { message: "Bad request" },
	INTERNAL_SERVER_ERROR: { message: "Server error, try later" },
	NOT_IMPLEMENTED: {
		message: "Feature not implemented",
		redirect: "/coming-soon",
	},
	BAD_GATEWAY: { message: "Bad gateway" },
	SERVICE_UNAVAILABLE: {
		message: "Service unavailable, please try later",
		redirect: "/maintenance",
	},
	GATEWAY_TIMEOUT: { message: "Gateway timeout" },

	UNAUTHORIZED: { message: "You must login to continue", redirect: "/login" },
	PAYMENT_REQUIRED: { message: "Payment required", redirect: "/payment" },
	FORBIDDEN: {
		message: "You don't have permission to access this resource",
		redirect: "/forbidden",
	},
	NOT_FOUND: {
		message: "The requested resource was not found",
		redirect: "/404",
	},

	METHOD_NOT_SUPPORTED: { message: "Method not supported" },
	TIMEOUT: { message: "Request timed out" },
	CONFLICT: { message: "Resource conflict" },
	PRECONDITION_FAILED: {
		message: "Precondition failed (e.g., OTP required)",
		redirect: "/verify-otp",
	},
	PAYLOAD_TOO_LARGE: { message: "Payload too large" },
	UNSUPPORTED_MEDIA_TYPE: { message: "Unsupported media type" },
	UNPROCESSABLE_CONTENT: { message: "Cannot process content" },
	TOO_MANY_REQUESTS: { message: "Too many requests, slow down!" },
	CLIENT_CLOSED_REQUEST: { message: "Request closed by client" },

	undefined: { message: "Unknown error occurred" },
};
