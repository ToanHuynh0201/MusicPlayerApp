export interface ColorPalette {
	background: string;
	surface: string;
	primary: string;
	secondary: string;
	accent: string;
	textPrimary: string;
	textSecondary: string;
	border: string;
	shadow: string;
	overlay: string;
	success: string;
	warning: string;
	error: string;
}

export const COLORS: ColorPalette = {
	// Main backgrounds
	background: "#0A0A0F", // Very dark purple-black
	surface: "#151520", // Dark purple-gray

	// Brand colors
	primary: "#8B5CF6", // Purple primary
	secondary: "#3F3F46", // Dark gray with purple hint
	accent: "#A855F7", // Bright purple accent

	// Text colors
	textPrimary: "#FFFFFF",
	textSecondary: "#A1A1AA",

	// UI elements
	border: "#27272A", // Dark border with purple tint
	shadow: "#000000",
	overlay: "#00000080", // 50% transparent black

	// Status colors
	success: "#10B981",
	warning: "#F59E0B",
	error: "#EF4444",
} as const;

// Type for color keys
export type ColorKey = keyof typeof COLORS;

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
	return `${color}${Math.round(opacity * 255)
		.toString(16)
		.padStart(2, "0")}`;
};

// Additional color variations
export const COLOR_VARIANTS = {
	primary: {
		light: "#A78BFA",
		main: COLORS.primary,
		dark: "#7C3AED",
	},
	surface: {
		light: "#1F1F29",
		main: COLORS.surface,
		dark: "#0F0F14",
	},
	text: {
		primary: COLORS.textPrimary,
		secondary: COLORS.textSecondary,
		disabled: "#6B7280",
		hint: "#4B5563",
	},
} as const;

// Gradient colors for player backgrounds
export const GRADIENTS = {
	playerBackground: ["#0A0A0F", "#151520", "#0A0A0F"],
	nowPlayingCard: ["#151520", "#1F1F29"],
	primaryButton: ["#8B5CF6", "#7C3AED"],
	accentButton: ["#A855F7", "#9333EA"],
} as const;
