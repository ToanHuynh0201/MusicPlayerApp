import { COLORS } from "@/src/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";

export interface IconProps {
	color?: string;
	size?: number;
}

export type TabRouteNames = "(home)" | "(search)" | "(library)" | "(profile)";

export type IconsType = {
	[K in TabRouteNames]: (props: IconProps) => React.ReactElement;
};

export const tabBarIcons: IconsType = {
	"(home)": (props: IconProps) => (
		<AntDesign
			name="home"
			size={24}
			color={COLORS.textPrimary}
			{...props}
		/>
	),
	"(search)": (props: IconProps) => (
		<AntDesign
			name="search1"
			size={24}
			color={COLORS.textPrimary}
			{...props}
		/>
	),
	"(library)": (props: IconProps) => (
		<MaterialIcons
			name="my-library-music"
			size={24}
			color={COLORS.textPrimary}
			{...props}
		/>
	),
	"(profile)": (props: IconProps) => (
		<MaterialIcons
			name="people"
			size={24}
			color={COLORS.textPrimary}
			{...props}
		/>
	),
};
