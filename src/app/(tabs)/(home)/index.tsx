import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { albumService } from "@/src/services/albumService";
import { playlistService } from "@/src/services/playlistService";

const HomeScreen = () => {
	const { user, tokens } = useAuth();
	const [error, setError] = useState("");
	const [albums, setAlbums] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchPlaylists = async () => {
			// ✅ Kiểm tra điều kiện trước khi fetch
			if (!user?.id || !tokens?.accessToken) {
				console.log("Missing user or tokens");
				return;
			}

			setLoading(true);
			setError("");

			try {
				console.log("Fetching playlists for user:", user.id);

				const data = await albumService.getUserAlbums(tokens, user.id); // ✅ Thêm await
				console.log("Playlists data:", data);

				setAlbums(data);
			} catch (err: any) {
				console.error("Error fetching playlists:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		const fetchNewReleaseAlbums = async () => {
			// ✅ Kiểm tra điều kiện trước khi fetch
			if (!user?.id || !tokens?.accessToken) {
				console.log("Missing user or tokens");
				return;
			}

			setLoading(true);
			setError("");

			try {
				console.log("Fetching playlists for user:", user.id);

				const data = await albumService.getNewReleaseAlbum(tokens); // ✅ Thêm await
				console.log("Playlists data:", data);

				setAlbums(data);
			} catch (err: any) {
				console.error("Error fetching playlists:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPlaylists();
		fetchNewReleaseAlbums();
	}, [user, tokens]); // ✅ Thêm dependency array

	return (
		<View>
			<Text>Welcome {user?.display_name}</Text>
			{loading && <Text>Loading playlists...</Text>}
			{error && <Text style={{ color: "red" }}>Error: {error}</Text>}
			{/* {albums && <Text>Found {albums.items?.length || 0} playlists</Text>} */}
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({});
