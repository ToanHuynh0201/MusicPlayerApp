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

	useEffect(() => {}, [user, tokens]); // ✅ Thêm dependency array

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
