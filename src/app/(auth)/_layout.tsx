import { COLORS } from "@/src/constants/Colors";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function TabLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor: COLORS.background,
				},
				headerStyle: {
					backgroundColor: COLORS.background,
				},
				freezeOnBlur: true,
			}}
		>
			<Stack.Screen
				name="login"
				options={{
					animation: "none",
				}}
			/>
		</Stack>
	);
}
