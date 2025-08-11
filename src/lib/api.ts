import axios, { AxiosInstance } from "axios";
import { API_CONFIG, AUTH_CONFIG } from "../constants";
import {
	getStorageItem,
	clearStorageItems,
	logError,
	parseError,
	shouldLogout,
} from "../utils";
import { Router, useRouter } from "expo-router";

class ApiService {
	api: AxiosInstance;
	router: Router;

	constructor() {
		this.api = this._createAxiosInstance();
		this._setupInterceptors();
		this.router = useRouter();
	}

	_createAxiosInstance() {
		return axios.create({
			baseURL: API_CONFIG.BASE_URL,
			timeout: API_CONFIG.TIMEOUT,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	/**
	 * Setup request and response interceptors
	 * @private
	 */
	_setupInterceptors() {
		this._setupRequestInterceptor();
		this._setupResponseInterceptor();
	}

	_setupRequestInterceptor() {
		this.api.interceptors.request.use(
			(config) => {
				const token = getStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				const parsedError = parseError(error);
				logError(parsedError, { context: "api.request" });
				return Promise.reject(parsedError);
			}
		);
	}

	/**
	 * Setup response interceptor to handle auth errors
	 * @private
	 */
	_setupResponseInterceptor() {
		this.api.interceptors.response.use(
			(response) => response,
			async (error) => {
				const parsedError = parseError(error);

				// Don't trigger logout for login endpoint errors

				// Handle auth errors with token refresh attempt
				if (shouldLogout(parsedError)) {
					const refreshResult = await this._handleAuthError(
						error,
						parsedError
					);
					if (refreshResult) {
						return refreshResult;
					}
					this._handleLogout();
				}

				logError(parsedError, { context: "api.response" });
				return Promise.reject(parsedError);
			}
		);
	}
	/**
	 * Handle authentication errors
	 * @private
	 * @param {Object} originalError - Original error object
	 * @param {Object} parsedError - Parsed error object
	 * @returns {Promise<Object|false>} Retry result or false
	 */
	async _handleAuthError(originalError: any, parsedError: any) {
		// Try token refresh for 401 errors only
		if (parsedError.status === 401) {
			return await this._tryTokenRefresh(originalError);
		}
		return false;
	}
	/**
	 * Attempt to refresh token and retry original request
	 * @private
	 * @param {Object} originalError - Original error object
	 * @returns {Promise<Object|false>} Retry result or false
	 */
	async _tryTokenRefresh(originalError: any) {
		const refreshToken = getStorageItem(
			AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY
		);
		if (!refreshToken) {
			return false;
		}

		// try {
		// 	const refreshResponse = await this._performTokenRefresh(
		// 		refreshToken
		// 	);

		// 	if (refreshResponse.data.status === "success") {
		// 		const { accessToken, refreshToken: newRefreshToken } =
		// 			refreshResponse.data.data;
		// 		setStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, accessToken);

		// 		if (newRefreshToken) {
		// 			setStorageItem(
		// 				AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
		// 				newRefreshToken
		// 			);
		// 		}

		// 		return this._retryOriginalRequest(originalError, accessToken);
		// 	}
		// } catch (refreshError: any) {
		// 	logError(parseError(refreshError), { context: "api.refresh" });
		// }

		return false;
	}

	/**
	 * Perform token refresh API call
	 * @private
	 * @param {string} refreshToken - Refresh token
	 * @returns {Promise<Object>} Refresh response
	 */
	// async _performTokenRefresh(refreshToken: any) {
	// 	return axios.post(`${API_CONFIG.BASE_URL}/auth/token/refresh`, {
	// 		refreshToken,
	// 	});
	// }

	/**
	 * Retry original request with new token
	 * @private
	 * @param {Object} originalError - Original error object
	 * @param {string} accessToken - New access token
	 * @returns {Promise<Object>} Request response
	 */
	_retryOriginalRequest(originalError: any, accessToken: string) {
		const originalRequest = originalError.config;
		originalRequest.headers.Authorization = `Bearer ${accessToken}`;
		return axios(originalRequest);
	}

	/**
	 * Handle logout by clearing storage and redirecting
	 * @private
	 */
	_handleLogout() {
		clearStorageItems([
			AUTH_CONFIG.TOKEN_STORAGE_KEY,
			AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
			AUTH_CONFIG.USER_STORAGE_KEY,
		]);
		this.router.navigate("./app/index");
	}

	// Proxy methods to axios instance
	get(url: any, config: any) {
		return this.api.get(url, config);
	}

	post(url: any, data: any, config: any) {
		return this.api.post(url, data, config);
	}

	put(url: any, data: any, config: any) {
		return this.api.put(url, data, config);
	}

	patch(url: any, data: any, config: any) {
		return this.api.patch(url, data, config);
	}

	delete(url: any, config: any) {
		return this.api.delete(url, config);
	}
}

const apiService = new ApiService();
export default apiService;
