import { COLORS, getColorWithOpacity, GRADIENTS } from "@/src/constants/Colors";
import { useAuth } from "@/src/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
	Alert,
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { height } = Dimensions.get("window");

const LoginScreen = () => {
	const {
		isLoading,
		isAuthenticated,
		error,
		request,
		login,
		clearError,
		user,
	} = useAuth();

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;

	useEffect(() => {
		// Animate entrance
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 800,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	// Navigate to home when authenticated
	useEffect(() => {
		if (isAuthenticated && user) {
			console.log("🔄 User authenticated, redirecting...");
			router.replace("/(tabs)/(home)");
		}
	}, [isAuthenticated, user]);

	const handleSpotifyLogin = async () => {
		if (!request) {
			console.error("❌ Auth request not ready");
			Alert.alert(
				"Authentication Error",
				"Authentication not ready. Please try again.",
				[{ text: "OK" }]
			);
			return;
		}

		try {
			await login();
		} catch (error) {
			console.error("💥 Login error:", error);
			Alert.alert(
				"Login Failed",
				"There was an error logging in with Spotify. Please try again.",
				[{ text: "OK" }]
			);
		}
	};

	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<KeyboardAvoidingView
				style={styles.keyboardContainer}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContainer}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<Animated.View
						style={[
							styles.content,
							{
								opacity: fadeAnim,
								transform: [{ translateY: slideAnim }],
							},
						]}
					>
						{/* Header */}
						<View style={styles.header}>
							<View style={styles.spotifyLogo}>
								<Text style={styles.spotifyLogoText}>♫</Text>
							</View>
							<Text style={styles.spotifyText}>Spotify</Text>

							{/* Description */}
							<Text style={styles.description}>
								Sign in with your Spotify account to access your
								music library, playlists, and personalized
								recommendations.
							</Text>

							{/* Error Display */}
							{error && (
								<View style={styles.errorContainer}>
									<Text style={styles.errorText}>
										{error}
									</Text>
									<TouchableOpacity
										onPress={clearError}
										style={styles.errorButton}
									>
										<Text style={styles.errorButtonText}>
											Dismiss
										</Text>
									</TouchableOpacity>
								</View>
							)}

							{/* Features List */}
							<View style={styles.featuresList}>
								<View style={styles.featureItem}>
									<View style={styles.featureBullet} />
									<Text style={styles.featureText}>
										Access your playlists
									</Text>
								</View>
								<View style={styles.featureItem}>
									<View style={styles.featureBullet} />
									<Text style={styles.featureText}>
										Sync your music library
									</Text>
								</View>
								<View style={styles.featureItem}>
									<View style={styles.featureBullet} />
									<Text style={styles.featureText}>
										Get personalized recommendations
									</Text>
								</View>
								<View style={styles.featureItem}>
									<View style={styles.featureBullet} />
									<Text style={styles.featureText}>
										Stream high-quality music
									</Text>
								</View>
							</View>

							{/* Spotify Login Button */}
							<TouchableOpacity
								style={[
									styles.spotifyButton,
									(isLoading || !request) &&
										styles.spotifyButtonDisabled,
								]}
								onPress={handleSpotifyLogin}
								disabled={isLoading || !request}
							>
								<LinearGradient
									colors={["#1DB954", "#1AAE4F"]}
									style={styles.spotifyButtonGradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
								>
									<View style={styles.spotifyButtonContent}>
										<Text style={styles.spotifyButtonIcon}>
											♫
										</Text>
										<Text style={styles.spotifyButtonText}>
											{isLoading
												? "Connecting..."
												: !request
												? "Preparing..."
												: "Continue with Spotify"}
										</Text>
									</View>
								</LinearGradient>
							</TouchableOpacity>

							{/* Privacy Notice */}
							<View style={styles.privacyNotice}>
								<Text style={styles.privacyText}>
									By continuing, you agree to Spotify's Terms
									of Service and Privacy Policy. We'll only
									access your public profile and playlists.
								</Text>
							</View>
						</View>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardContainer: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: "center",
		paddingHorizontal: 24,
		paddingVertical: 40,
	},
	content: {
		width: "100%",
		maxWidth: 400,
		alignSelf: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: 48,
	},
	spotifyLogo: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "#1DB954",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#1DB954",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.4,
		shadowRadius: 12,
		elevation: 12,
		marginBottom: 16,
	},
	spotifyLogoText: {
		fontSize: 40,
		color: COLORS.textPrimary,
		fontWeight: "bold",
	},
	spotifyText: {
		fontSize: 24,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
	description: {
		fontSize: 15,
		color: COLORS.textSecondary,
		textAlign: "center",
		lineHeight: 22,
		marginBottom: 32,
		paddingHorizontal: 8,
	},
	errorContainer: {
		backgroundColor: "rgba(255, 59, 48, 0.1)",
		borderColor: "rgba(255, 59, 48, 0.3)",
		borderWidth: 1,
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
		width: "100%",
	},
	errorText: {
		color: "#FF3B30",
		fontSize: 14,
		textAlign: "center",
		marginBottom: 8,
	},
	errorButton: {
		alignSelf: "center",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 6,
		backgroundColor: "rgba(255, 59, 48, 0.2)",
	},
	errorButtonText: {
		color: "#FF3B30",
		fontSize: 12,
		fontWeight: "600",
	},
	featuresList: {
		alignSelf: "stretch",
		marginBottom: 32,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		paddingHorizontal: 16,
	},
	featureBullet: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: COLORS.primary,
		marginRight: 12,
	},
	featureText: {
		fontSize: 14,
		color: COLORS.textSecondary,
		flex: 1,
	},
	spotifyButton: {
		width: "100%",
		borderRadius: 25,
		overflow: "hidden",
		marginBottom: 24,
		shadowColor: "#1DB954",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.4,
		shadowRadius: 12,
		elevation: 12,
	},
	spotifyButtonDisabled: {
		opacity: 0.7,
	},
	spotifyButtonGradient: {
		paddingVertical: 18,
		paddingHorizontal: 24,
	},
	spotifyButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	spotifyButtonIcon: {
		fontSize: 20,
		color: COLORS.textPrimary,
		marginRight: 12,
		fontWeight: "bold",
	},
	spotifyButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "bold",
	},
	privacyNotice: {
		backgroundColor: getColorWithOpacity(COLORS.surface, 0.8),
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	privacyText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		textAlign: "center",
		lineHeight: 18,
	},
});
export default LoginScreen;
