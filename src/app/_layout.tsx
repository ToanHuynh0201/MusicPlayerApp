import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { COLORS } from "../constants/Colors";

const StackLayout = () => {
	const insets = useSafeAreaInsets();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					paddingTop: insets.top,
					backgroundColor: COLORS.background,
				},
				headerStyle: {
					backgroundColor: COLORS.background,
				},
				animation: "none",
			}}
		></Stack>
	);
};

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<StatusBar style="light" />
			<StackLayout></StackLayout>
		</SafeAreaProvider>
	);
}
