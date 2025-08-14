import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { SpotifyTokens, AuthConfig } from "../types/auth";
import { clearAllStorage, getStorageItem, setStorageItem } from "../utils";
import { AUTH_CONFIG } from "../constants";

// Complete the auth session for web browsers
WebBrowser.maybeCompleteAuthSession();

// Warm up the browser for better performance
if (Platform.OS === "web") {
	WebBrowser.warmUpAsync();
}

// Spotify OAuth configuration
const SPOTIFY_CLIENT_ID = "066b93b708ef4bfb99ee25877296b19b";

// Scopes for Spotify API access
const SCOPES = [
	"user-read-email",
	"user-read-private",
	"user-library-read",
	"user-library-modify",
	"playlist-read-private",
	"playlist-read-collaborative",
	"playlist-modify-private",
	"playlist-modify-public",
	"user-read-recently-played",
	"user-top-read",
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
	"streaming",
];

// OAuth endpoints
const discovery = {
	authorizationEndpoint: "https://accounts.spotify.com/authorize",
	tokenEndpoint: "https://accounts.spotify.com/api/token",
};

// Storage keys

class SpotifyAuthService {
	private redirectUri: string;

	constructor() {
		// Create redirect URI with proper fallbacks
		this.redirectUri = makeRedirectUri({
			scheme: "musicplayerapp",
			path: "auth",
		});

		console.log("🔗 Redirect URI:", this.redirectUri);
		console.log("🏗️ Development mode:", __DEV__);
		console.log("📱 Platform:", Platform.OS);
	}

	/**
	 * Get auth configuration for components
	 */
	getAuthConfig(): AuthConfig {
		return {
			clientId: SPOTIFY_CLIENT_ID,
			scopes: SCOPES,
			usePKCE: true,
			redirectUri: this.redirectUri,
			responseType: AuthSession.ResponseType.Code,
			discovery,
		};
	}

	/**
	 * Get redirect URI (for external use)
	 */
	getRedirectUri(): string {
		return this.redirectUri;
	}

	/**
	 * Exchange authorization code for access token
	 */
	async exchangeCodeForTokens(
		code: string,
		codeVerifier: string
	): Promise<SpotifyTokens> {
		try {
			const tokenRequestParams = {
				grant_type: "authorization_code",
				code,
				redirect_uri: this.redirectUri,
				client_id: SPOTIFY_CLIENT_ID,
				code_verifier: codeVerifier,
			};

			console.log("📡 Making token request...");

			const response = await fetch(discovery.tokenEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(tokenRequestParams).toString(),
			});

			const data = await response.json();

			if (response.ok) {
				const tokens: SpotifyTokens = {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					expiresIn: data.expires_in,
					tokenType: data.token_type,
					scope: data.scope,
					expiresAt: Date.now() + data.expires_in * 1000,
				};

				// Store tokens automatically
				await setStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, tokens);
				console.log("✅ Tokens stored successfully");

				return tokens;
			} else {
				console.error("Token exchange error:", data);
				throw new Error(
					data.error_description || "Token exchange failed"
				);
			}
		} catch (error) {
			console.error("Token exchange error:", error);
			throw error;
		}
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(refreshToken?: string): Promise<SpotifyTokens> {
		try {
			// If no refresh token provided, try to get from storage
			const currentRefreshToken =
				refreshToken || (await this.getStoredTokens())?.refreshToken;

			if (!currentRefreshToken) {
				throw new Error("No refresh token available");
			}

			const tokenRequestParams = {
				grant_type: "refresh_token",
				refresh_token: currentRefreshToken,
				client_id: SPOTIFY_CLIENT_ID,
			};

			const response = await fetch(discovery.tokenEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(tokenRequestParams).toString(),
			});

			const data = await response.json();

			if (response.ok) {
				const tokens: SpotifyTokens = {
					accessToken: data.access_token,
					refreshToken: data.refresh_token || currentRefreshToken,
					expiresIn: data.expires_in,
					tokenType: data.token_type,
					scope: data.scope,
					expiresAt: Date.now() + data.expires_in * 1000,
				};

				await setStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, tokens);
				console.log("✅ Tokens refreshed successfully");

				return tokens;
			} else {
				console.error("Token refresh error:", data);
				throw new Error(
					data.error_description || "Token refresh failed"
				);
			}
		} catch (error) {
			console.error("Token refresh error:", error);
			// If refresh fails, clear stored tokens
			await this.clearTokens();
			throw error;
		}
	}

	/**
	 * Get stored tokens and auto-refresh if needed
	 */
	async getStoredTokens(): Promise<SpotifyTokens | null> {
		try {
			const tokensJson = await getStorageItem(
				AUTH_CONFIG.TOKEN_STORAGE_KEY
			);
			if (!tokensJson) return null;

			const tokenData = JSON.parse(tokensJson);

			// Check if token is expired (with 5 minute buffer)
			const bufferTime = 5 * 60 * 1000; // 5 minutes
			if (
				tokenData.expiresAt &&
				Date.now() >= tokenData.expiresAt - bufferTime
			) {
				console.log("🔄 Token expired, refreshing...");
				try {
					return await this.refreshToken(tokenData.refreshToken);
				} catch (error) {
					console.error("Failed to refresh token:", error);
					return null;
				}
			}

			return tokenData;
		} catch (error) {
			console.error("Error getting stored tokens:", error);
			return null;
		}
	}

	/**
	 * Get valid access token (auto-refresh if needed)
	 */
	async getValidAccessToken(): Promise<string | null> {
		const tokens = await this.getStoredTokens();
		return tokens?.accessToken || null;
	}

	/**
	 * Clear stored tokens
	 */
	async clearTokens(): Promise<void> {
		try {
			await AsyncStorage.multiRemove([
				AUTH_CONFIG.TOKEN_STORAGE_KEY,
				AUTH_CONFIG.USER_STORAGE_KEY,
			]);
			console.log("🗑️ Tokens cleared");
		} catch (error) {
			console.error("Error clearing tokens:", error);
		}
	}

	/**
	 * Check if user is authenticated
	 */
	async isAuthenticated(): Promise<boolean> {
		const tokens = await this.getStoredTokens();
		return tokens !== null && !!tokens.accessToken;
	}

	/**
	 * Logout - clear stored tokens
	 */
	async logout(): Promise<void> {
		await clearAllStorage();
		console.log("👋 User logged out");
	}

	/**
	 * Store user data
	 */
	async storeUser(user: any): Promise<void> {
		try {
			await AsyncStorage.setItem(
				AUTH_CONFIG.USER_STORAGE_KEY,
				JSON.stringify(user)
			);
		} catch (error) {
			console.error("Error storing user:", error);
			throw error;
		}
	}

	/**
	 * Get stored user data
	 */
	async getStoredUser(): Promise<any | null> {
		try {
			const userJson = await AsyncStorage.getItem(
				AUTH_CONFIG.USER_STORAGE_KEY
			);
			return userJson ? JSON.parse(userJson) : null;
		} catch (error) {
			console.error("Error getting stored user:", error);
			return null;
		}
	}
}

export const spotifyAuthService = new SpotifyAuthService();
