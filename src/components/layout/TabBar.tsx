import { COLORS, getColorWithOpacity } from "@/src/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import TabBarButton from "./TabBarButton";

const TabBar = ({ state, descriptors, navigation }: any) => {
	return (
		<View style={styles.tabBar}>
			{state.routes.map((route: any, index: any) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

				if (["_sitemap", "+not-found"].includes(route.name))
					return null;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: "tabLongPress",
						target: route.key,
					});
				};

				return (
					<TabBarButton
						key={route.name}
						style={styles.tabBarItem}
						onPress={onPress}
						onLongPress={onLongPress}
						isFocused={isFocused}
						routeName={route.name}
						color={isFocused ? COLORS.primary : COLORS.textPrimary}
						label={label}
					/>
				);
			})}
		</View>
	);
};

export default TabBar;

const styles = StyleSheet.create({
	tabBar: {
		position: "absolute",
		bottom: 25,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: getColorWithOpacity(COLORS.secondary, 0.9),
		marginHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 25,
		borderCurve: "continuous",
		shadowColor: "white",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
	},
	tabBarItem: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 4,
	},
});
