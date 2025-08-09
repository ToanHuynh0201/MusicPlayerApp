export const API_CONFIG = {
	BASE_URL: "https://api.spotify.com/v1/",
	TIMEOUT: 10000, // 10 seconds
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000,
};
export const AUTH_CONFIG = {
	TOKEN_STORAGE_KEY: "access_token",
	REFRESH_TOKEN_STORAGE_KEY: "refresh_token",
	USER_STORAGE_KEY: "user",
};
