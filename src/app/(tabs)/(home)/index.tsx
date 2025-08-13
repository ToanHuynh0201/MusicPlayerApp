import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";

const HomeScreen = () => {
	const { user } = useAuth();
	useEffect(() => {
		console.log(user);
	});
	return (
		<View>
			<Text>Welcome {user.display_name}</Text>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({});
