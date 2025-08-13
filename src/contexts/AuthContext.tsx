import React, { createContext, useContext, useEffect, useState } from "react";
import { spotifyAuthService } from "../services/authService";
import { SpotifyTokens } from "../types/auth";

export interface User {
	id: string;
	display_name: string;
	email: string;
	images?: Array<{ url: string }>;
}

interface AuthContextType {
	user: User | null;
	tokens: SpotifyTokens | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		checkAuthState();
	}, []);

	const checkAuthState = async () => {
		try {
			setIsLoading(true);
			const storedTokens = await spotifyAuthService.getStoredTokens();

			if (storedTokens) {
				setTokens(storedTokens);
				setIsAuthenticated(true);

				// Get user profile
				const userProfile = await getUserProfile(
					storedTokens.accessToken
				);
				if (userProfile) {
					setUser(userProfile);
				}
			} else {
				setIsAuthenticated(false);
				setUser(null);
				setTokens(null);
			}
		} catch (error) {
			console.error("Error checking auth state:", error);
			setIsAuthenticated(false);
			setUser(null);
			setTokens(null);
		} finally {
			setIsLoading(false);
		}
	};

	const getUserProfile = async (
		accessToken: string
	): Promise<User | null> => {
		try {
			const response = await fetch("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (response.ok) {
				return await response.json();
			}
			return null;
		} catch (error) {
			console.error("Error fetching user profile:", error);
			return null;
		}
	};

	const login = async () => {
		try {
			setIsLoading(true);
			// This will be handled by the LoginScreen component
			// The context will be updated when tokens are received
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			setIsLoading(true);
			await spotifyAuthService.logout();
			setUser(null);
			setTokens(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const refreshTokens = async () => {
		try {
			if (!tokens?.refreshToken) {
				throw new Error("No refresh token available");
			}

			const newTokens = await spotifyAuthService.refreshToken(
				tokens.refreshToken
			);
			setTokens(newTokens);

			// Update user profile with new token
			const userProfile = await getUserProfile(newTokens.accessToken);
			if (userProfile) {
				setUser(userProfile);
			}
		} catch (error) {
			console.error("Token refresh error:", error);
			// If refresh fails, log out user
			await logout();
			throw error;
		}
	};

	// Method to update auth state after successful login
	const updateAuthState = async (newTokens: SpotifyTokens) => {
		try {
			setTokens(newTokens);
			setIsAuthenticated(true);

			const userProfile = await getUserProfile(newTokens.accessToken);
			if (userProfile) {
				setUser(userProfile);
			}
		} catch (error) {
			console.error("Error updating auth state:", error);
		}
	};

	const value: AuthContextType = {
		user,
		tokens,
		isLoading,
		isAuthenticated,
		login,
		logout,
		refreshTokens,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuthContext = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};
