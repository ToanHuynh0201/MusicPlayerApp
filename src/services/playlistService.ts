import { API_CONFIG } from "../constants";
import { useAuth } from "../hooks/useAuth";
import apiService from "../lib/api";
import { SpotifyTokens } from "../types/auth";

class PlaylistService {
	getFeaturedPlaylists = async (
		tokens: SpotifyTokens | null
	): Promise<any> => {
		try {
			if (!tokens?.accessToken) {
				throw new Error("No access token available");
			}

			console.log("Making request to featured playlists endpoint...");

			const response = await fetch(
				`https://api.spotify.com/v1/browse/featured-playlists`,
				{
					headers: {
						Authorization: `Bearer ${tokens?.accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Response status:", response.status);

			if (response.ok) {
				const data = await response.json();
				console.log("Successfully fetched playlists:", data);
				return data;
			} else {
				const errorText = await response.text();
				console.log("Error status:", response.status);
				console.log("Error details:", errorText);

				// Log token info for debugging (without exposing the actual token)
				console.log("Token exists:", !!tokens.accessToken);
				console.log(
					"Token starts with:",
					tokens.accessToken?.substring(0, 10) + "..."
				);

				throw new Error(
					`HTTP Error: ${response.status} - ${errorText}`
				);
			}
		} catch (err: any) {
			console.error("Playlist service error:", err);
			throw new Error(`Failed to fetch playlists: ${err.message}`);
		}
	};
}

export const playlistService = new PlaylistService();
