import { API_CONFIG } from "../constants";
import { useAuth } from "../hooks/useAuth";
import apiService from "../lib/api";
import { SpotifyTokens } from "../types/auth";
import { withErrorHandling } from "../utils";

class PlaylistService {
	getFeaturedPlaylists = withErrorHandling(async (params = {}) => {
		const queryParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== null && value !== undefined && value !== "") {
				queryParams.append(key, value as string);
			}
		});

		return apiService.api.get(
			`/browse/featured-playlists${queryParams.toString()}`
		);
	});
}

export const playlistService = new PlaylistService();
