import { API_CONFIG } from "../constants";
import { useAuth } from "../hooks/useAuth";
import apiService from "../lib/api";
import { SpotifyTokens } from "../types/auth";

class AlbumService {
	getAlbums = async (
		tokens: SpotifyTokens | null,
		id: string
	): Promise<any> => {
		try {
			if (!tokens?.accessToken) {
				throw new Error("No access token available");
			}

			const response = await fetch(
				`https://api.spotify.com/v1/users/${id}/playlists`,
				{
					headers: {
						Authorization: `Bearer ${tokens.accessToken}`, // ✅ Thêm "Bearer "
						"Content-Type": "application/json", // ✅ Thêm content type
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				return data;
			} else {
				console.log("Error status:", response.status);
				console.log("Error details:", await response.text()); // ✅ Log chi tiết lỗi

				throw new Error(`HTTP Error: ${response.status}`);
			}
		} catch (err: any) {
			console.error("Album service error:", err); // ✅ Log lỗi chi tiết
			throw new Error(`Failed to fetch playlists: ${err.message}`);
		}
	};
}

export const albumService = new AlbumService();
