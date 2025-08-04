import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { COLORS, GRADIENTS } from "../constants/Colors";
const { width, height } = Dimensions.get("window");

const index = () => {
	const router = useRouter();
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.5)).current;
	const textFadeAnim = useRef(new Animated.Value(0)).current;
	const musicNoteAnim = useRef(new Animated.Value(-50)).current;

	useEffect(() => {
		// Animation sequence
		const sequence = Animated.sequence([
			// Logo appears and scales up
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.spring(scaleAnim, {
					toValue: 1,
					tension: 50,
					friction: 7,
					useNativeDriver: true,
				}),
			]),
			// Text appears
			Animated.timing(textFadeAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
			// Music note animation
			Animated.timing(musicNoteAnim, {
				toValue: 0,
				duration: 400,
				useNativeDriver: true,
			}),
			// Hold for a moment
			Animated.delay(1000),
		]);

		sequence.start(() => {
			// Navigate to login screen after animation
			// router.replace("/login");
		});
	}, [fadeAnim, scaleAnim, textFadeAnim, musicNoteAnim]);
	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<View style={styles.content}>
				{/* Logo Container */}
				<Animated.View
					style={[
						styles.logoContainer,
						{
							opacity: fadeAnim,
							transform: [{ scale: scaleAnim }],
						},
					]}
				>
					{/* Music Icon */}
					<View style={styles.musicIcon}>
						<Animated.View style={[styles.musicNote]}>
							<Text style={styles.noteText}>♪</Text>
						</Animated.View>
					</View>
				</Animated.View>

				{/* App Name */}
				<Animated.View
					style={[
						styles.textContainer,
						{
							opacity: textFadeAnim,
						},
					]}
				>
					<Text style={styles.appName}>MusicFlow</Text>
					<Text style={styles.tagline}>Your music, your way</Text>
				</Animated.View>

				{/* Loading dots */}
				<View style={styles.loadingContainer}>
					<View style={styles.loadingDots}>
						{[0, 1, 2].map((index) => (
							<Animated.View
								key={index}
								style={[
									styles.dot,
									{
										opacity: fadeAnim,
									},
								]}
							/>
						))}
					</View>
				</View>
			</View>

			{/* Background decorative elements */}
			<View style={styles.backgroundDecoration}>
				{[...Array(20)].map((_, index) => (
					<Animated.View
						key={index}
						style={[
							styles.decorativeCircle,
							{
								left: Math.random() * width,
								top: Math.random() * height,
								opacity: fadeAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 0.1],
								}),
							},
						]}
					/>
				))}
			</View>
		</LinearGradient>
	);
};

export default index;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
	logoContainer: {
		marginBottom: 40,
	},
	musicIcon: {
		width: 120,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	circle: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 4,
		borderColor: COLORS.primary,
		backgroundColor: COLORS.surface,
		shadowColor: COLORS.primary,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.5,
		shadowRadius: 20,
		elevation: 10,
	},
	line: {
		position: "absolute",
		width: 4,
		height: 40,
		backgroundColor: COLORS.primary,
		top: 20,
		right: 15,
		borderRadius: 2,
	},
	musicNote: {
		position: "absolute",
		fontSize: 250,
	},
	noteText: {
		fontSize: 200,
		color: COLORS.accent,
		fontWeight: "bold",
	},
	textContainer: {
		alignItems: "center",
		marginBottom: 60,
	},
	appName: {
		fontSize: 36,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginBottom: 8,
		letterSpacing: 1.2,
	},
	tagline: {
		fontSize: 16,
		color: COLORS.textSecondary,
		fontStyle: "italic",
	},
	loadingContainer: {
		position: "absolute",
		bottom: 80,
	},
	loadingDots: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.primary,
		marginHorizontal: 4,
		shadowColor: COLORS.primary,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.8,
		shadowRadius: 4,
		elevation: 5,
	},
	backgroundDecoration: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: -1,
	},
	decorativeCircle: {
		position: "absolute",
		width: Math.random() * 20 + 10,
		height: Math.random() * 20 + 10,
		borderRadius: 50,
		backgroundColor: COLORS.primary,
	},
});
