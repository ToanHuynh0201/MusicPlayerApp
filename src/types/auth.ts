import * as AuthSession from "expo-auth-session";

export interface SpotifyTokens {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	tokenType: string;
	scope: string;
	expiresAt?: number;
}

export interface AuthConfig {
	clientId: string;
	scopes: string[];
	usePKCE: boolean;
	redirectUri: string;
	responseType: AuthSession.ResponseType;
	discovery: {
		authorizationEndpoint: string;
		tokenEndpoint: string;
	};
}

export interface SpotifyUser {
	id: string;
	display_name: string;
	email: string;
	country?: string;
	followers?: {
		total: number;
	};
	images?: Array<{
		url: string;
		height: number | null;
		width: number | null;
	}>;
	product?: string;
	type: string;
	uri: string;
	external_urls?: {
		spotify: string;
	};
}

export interface AuthError {
	message: string;
	code?: string;
	type: "AUTH_ERROR" | "NETWORK_ERROR" | "TOKEN_ERROR" | "UNKNOWN_ERROR";
}

export interface AuthState {
	user: SpotifyUser | null;
	tokens: SpotifyTokens | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: AuthError | null;
}

export type AuthAction =
	| { type: "AUTH_START" }
	| {
			type: "AUTH_SUCCESS";
			payload: { user: SpotifyUser; tokens: SpotifyTokens };
	  }
	| { type: "AUTH_ERROR"; payload: AuthError }
	| { type: "AUTH_LOGOUT" }
	| { type: "TOKEN_REFRESH"; payload: SpotifyTokens }
	| { type: "CLEAR_ERROR" };
