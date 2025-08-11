import { useCallback, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import { SpotifyTokens } from "../types/auth";
import { useAuthContext } from "../contexts/AuthContext";
import { spotifyAuthService } from "../services/authService";

interface UseAuthReturn {
	// Authentication state
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;

	// Auth session
	request: AuthSession.AuthRequest | null;
	response: AuthSession.AuthSessionResult | null;

	// Methods
	login: () => Promise<void>;
	logout: () => Promise<void>;
	promptAsync: () => Promise<AuthSession.AuthSessionResult>;
	clearError: () => void;

	// User and tokens from context
	user: any;
	tokens: SpotifyTokens | null;
}

export const useAuth = (): UseAuthReturn => {
	const {
		user,
		tokens,
		isLoading: contextLoading,
		isAuthenticated,
		logout: contextLogout,
	} = useAuthContext();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Get auth configuration from service
	const authConfig = spotifyAuthService.getAuthConfig();

	// Use AuthSession hook with config from service
	const [request, response, promptAsync] = AuthSession.useAuthRequest(
		{
			clientId: authConfig.clientId,
			scopes: authConfig.scopes,
			usePKCE: authConfig.usePKCE,
			redirectUri: authConfig.redirectUri,
			responseType: authConfig.responseType,
		},
		authConfig.discovery
	);

	console.log("🔗 Redirect URI:", authConfig.redirectUri);

	// Handle auth response
	useEffect(() => {
		if (response?.type === "success") {
			console.log("✅ Auth success, code:", response.params.code);
			handleAuthSuccess(response.params.code, request?.codeVerifier);
		} else if (response?.type === "error") {
			console.error("❌ Auth error:", response.error);
			setError(
				`Authentication failed: ${
					response.error?.message || "Unknown error"
				}`
			);
			setIsLoading(false);
		} else if (response?.type === "cancel") {
			console.log("👤 User cancelled authentication");
			setIsLoading(false);
		}
	}, [response]);

	const handleAuthSuccess = async (code: string, codeVerifier?: string) => {
		if (!codeVerifier) {
			setError("Code verifier missing");
			setIsLoading(false);
			return;
		}

		try {
			console.log("🔄 Exchanging code for tokens...");

			// Use auth service to exchange code for tokens
			const tokens = await spotifyAuthService.exchangeCodeForTokens(
				code,
				codeVerifier
			);

			if (tokens) {
				console.log("✅ Tokens received, getting user profile...");

				// Get user profile using the new tokens
				const userProfile = await getCurrentUser(tokens.accessToken);

				if (userProfile) {
					console.log(
						"✅ User profile received:",
						userProfile.display_name
					);

					// Store user data
					await spotifyAuthService.storeUser(userProfile);

					// The AuthContext will automatically update through its useEffect
					// when stored tokens change
				} else {
					setError("Failed to get user profile");
				}
			} else {
				setError("Failed to exchange code for tokens");
			}
		} catch (error) {
			console.error("💥 Auth success handler error:", error);
			setError(
				error instanceof Error ? error.message : "Authentication failed"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const getCurrentUser = async (accessToken: string) => {
		try {
			const response = await fetch("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (response.ok) {
				return await response.json();
			} else {
				throw new Error("Failed to fetch user profile");
			}
		} catch (error) {
			console.error("Error fetching user profile:", error);
			throw error;
		}
	};

	const login = useCallback(async () => {
		if (!request) {
			console.error("❌ Auth request not ready");
			setError("Authentication not ready. Please try again.");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			console.log("🚀 Starting Spotify auth...");
			console.log("📱 Platform:", require("react-native").Platform.OS);
			console.log("🔗 Using redirect URI:", authConfig.redirectUri);

			// Start the authentication flow
			const result = await promptAsync({
				showInRecents: true,
			});

			console.log("📋 Prompt result:", result);
		} catch (error) {
			console.error("💥 Spotify login error:", error);
			setError("Login failed. Please try again.");
			setIsLoading(false);
		}
	}, [request, authConfig.redirectUri, promptAsync]);

	const logout = useCallback(async () => {
		try {
			setIsLoading(true);
			await contextLogout();
		} catch (error) {
			console.error("Logout error:", error);
			setError("Failed to logout. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, [contextLogout]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		// Authentication state
		isLoading: isLoading || contextLoading,
		isAuthenticated,
		error,

		// Auth session
		request,
		response,

		// Methods
		login,
		logout,
		promptAsync,
		clearError,

		// User and tokens from context
		user,
		tokens,
	};
};
