import { AxiosError, AxiosResponse } from "axios";
import { ERROR_CODES, ERROR_MESSAGES } from "../constants";
export class ApiError extends Error {
	status: number;
	code: string;

	constructor(
		message: string,
		status: number = 500,
		code: string = ERROR_CODES.INTERNAL_ERROR
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
	}
}

export const parseError = (error: AxiosError) => {
	// Network error (no response)
	if (!error.response) {
		return new ApiError(
			ERROR_MESSAGES.NETWORK_ERROR,
			0,
			ERROR_CODES.NETWORK_ERROR
		);
	}

	const { status, data } = error.response as {
		status: number;
		data: Record<string, any>;
	};

	// Extract error details from various response formats
	const errorCode =
		data?.error?.code || data?.code || ERROR_CODES.INTERNAL_ERROR;
	const errorMessage =
		data?.error?.message ||
		data?.message ||
		data?.error ||
		ERROR_MESSAGES.GENERIC_ERROR;

	// Validate error code
	type ErrorCode = keyof typeof ERROR_MESSAGES;

	const validCode: ErrorCode = Object.values(ERROR_CODES).includes(errorCode)
		? (errorCode as ErrorCode)
		: "INTERNAL_ERROR";

	// Use backend message if available, otherwise fall back to predefined message
	const finalMessage =
		errorMessage && errorMessage !== ERROR_MESSAGES.GENERIC_ERROR
			? errorMessage
			: ERROR_MESSAGES[validCode] || errorMessage;

	return new ApiError(finalMessage, status, validCode);
};

/**
 * Simple service error handler - wraps async functions with error handling
 * @param {Function} asyncFn - Async function to wrap
 * @returns {Function} Wrapped function that returns standardized response
 */
export const withErrorHandling = (asyncFn: any) => {
	return async (...args: any) => {
		try {
			const response = await asyncFn(...args);

			// If response is successful, return it
			if (response.data?.status === "success") {
				return {
					success: true,
					data: response.data.data,
					message: response.data.message,
				};
			}

			// Handle error response
			const error = parseError({ response } as any);
			return {
				success: false,
				error: error.message,
				code: error.code,
			};
		} catch (error: any) {
			const parsedError = parseError(error);
			return {
				success: false,
				error: parsedError.message,
				code: parsedError.code,
			};
		}
	};
};

/**
 * Log error with context (simplified)
 * @param {Error} error - Error to log
 * @param {Object} context - Additional context
 */
export const logError = (error: any, context = {}) => {
	console.error("Application Error:", {
		message: error.message,
		code: error.code,
		status: error.status,
		timestamp: new Date().toISOString(),
		...context,
	});
};

/**
 * Check if error should trigger logout (401/403)
 * @param {ApiError} error - Parsed API error
 * @returns {boolean} Whether error should trigger logout
 */
export const shouldLogout = (error: any) => {
	return (
		error.status === 401 ||
		error.status === 403 ||
		error.code === ERROR_CODES.UNAUTHORIZED ||
		error.code === ERROR_CODES.FORBIDDEN
	);
};
