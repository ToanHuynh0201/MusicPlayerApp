import { tabBarIcons, TabRouteNames } from "@/assets/icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
interface TabBarButtonProps {
	isFocused: boolean;
	label: string;
	routeName: TabRouteNames; // Use proper type instead of any
	color: string;
	style?: ViewStyle;
	onPress: () => void;
	onLongPress: () => void;
}
const TabBarButton = (props: TabBarButtonProps) => {
	const { isFocused, label, routeName, color } = props;
	const scale = useSharedValue(0);
	useEffect(() => {
		scale.value = withSpring(
			typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
			{
				duration: 350,
			}
		);
	}, [scale, isFocused]);

	const animatedIconStyle = useAnimatedStyle(() => {
		const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
		const top = interpolate(scale.value, [0, 1], [0, 8]);
		return {
			transform: [{ scale: scaleValue }],
			top,
		};
	});

	const animatedTextStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scale.value, [0, 1], [1, 0]);
		return {
			opacity,
		};
	});
	return (
		<Pressable {...props} style={styles.container}>
			<Animated.View style={[animatedIconStyle]}>
				{tabBarIcons[routeName]({
					color,
				})}
			</Animated.View>

			<Animated.Text
				style={[
					{
						color,
						fontSize: 11,
					},
					animatedTextStyle,
				]}
			>
				{label}
			</Animated.Text>
		</Pressable>
	);
};

export default TabBarButton;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 4,
	},
});
