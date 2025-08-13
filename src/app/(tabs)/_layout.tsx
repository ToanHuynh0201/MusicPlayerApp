import TabBar from "@/src/components/layout/TabBar";
import { COLORS, getColorWithOpacity } from "@/src/constants/Colors";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
export default function TabLayout() {
	return (
		<Tabs
			tabBar={(props) => <TabBar {...props} />}
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.textSecondary,
				tabBarStyle: {
					backgroundColor: getColorWithOpacity(COLORS.secondary, 0.5),
					height: 80,
					position: "absolute",
					borderTopWidth: 0,
					paddingBottom: 30,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
				},
				animation: "shift",
			}}
		>
			<Tabs.Screen
				name="(home)"
				options={{
					title: "Home",
					sceneStyle: { backgroundColor: COLORS.background },
				}}
			></Tabs.Screen>
			{/* <Tabs.Screen
				name="(search)"
				options={{
					title: "Search",
					sceneStyle: { backgroundColor: COLORS.background },
				}}
			></Tabs.Screen>
			<Tabs.Screen
				name="(library)"
				options={{
					title: "Library",
					sceneStyle: { backgroundColor: COLORS.background },
				}}
			></Tabs.Screen>
			<Tabs.Screen
				name="(profile)"
				options={{
					title: "Profile",
					sceneStyle: { backgroundColor: COLORS.background },
				}}
			></Tabs.Screen> */}
		</Tabs>
	);
}

const styles = StyleSheet.create({
	blurContainer: {
		flex: 1,
		textAlign: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
});
