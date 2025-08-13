import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function _layout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
					headerTitle: "Songs",
				}}
			/>
		</Stack>
	);
}

const styles = StyleSheet.create({});
