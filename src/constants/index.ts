export const API_CONFIG = {
	BASE_URL: "https://api.spotify.com/",
	BASE_AUTH_URL: "",
	BASE_AUTH_TOKEN_URL: "",
	TIMEOUT: 10000, // 10 seconds
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000,
};
export const AUTH_CONFIG = {
	TOKEN_STORAGE_KEY: "access_token",
	REFRESH_TOKEN_STORAGE_KEY: "refresh_token",

	USER_STORAGE_KEY: "user",
};
export const ERROR_CODES = {
	BAD_REQUEST: "BAD_REQUEST",
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	NOT_FOUND: "NOT_FOUND",
	VALIDATION_ERROR: "VALIDATION_ERROR",
	CONFLICT: "CONFLICT",
	TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
	SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
	INTERNAL_ERROR: "INTERNAL_ERROR",
	NETWORK_ERROR: "NETWORK_ERROR",
};
export const ERROR_MESSAGES = {
	NETWORK_ERROR: "Network error. Please check your connection and try again.",
	UNAUTHORIZED: "You are not authorized to access this resource.",
	FORBIDDEN: "Access denied. Administrator privileges required.",
	SERVER_ERROR: "Server error. Please try again later.",
	VALIDATION_FAILED: "Please check your input and try again.",
	LOGIN_FAILED: "Invalid email or password. Please try again.",
	GENERIC_ERROR: "Something went wrong. Please try again.",
	BAD_REQUEST: "Invalid request. Please check your input and try again.",
	NOT_FOUND: "The requested resource was not found.",
	CONFLICT: "There was a conflict with your request. Please try again.",
	TOO_MANY_REQUESTS: "Too many requests. Please wait a moment and try again.",
	SERVICE_UNAVAILABLE:
		"Service is temporarily unavailable. Please try again later.",
	INTERNAL_ERROR: "An internal error occurred. Please try again later.",
};
export default {
	API_CONFIG,
	AUTH_CONFIG,
	ERROR_CODES,
	ERROR_MESSAGES,
};
