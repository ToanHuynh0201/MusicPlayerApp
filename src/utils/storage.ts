import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage utilities for handling AsyncStorage operations safely in React Native
 */

// Types
export interface StorageInfo {
	totalKeys: number;
	keys: string[];
}

export type StorageValue = string | number | boolean | object | null;

/**
 * Safely get item from AsyncStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed value or default
 */
export const getStorageItem = async <T = any>(
	key: string,
	defaultValue: T | null = null
): Promise<T | null> => {
	try {
		const item = await AsyncStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (error) {
		console.warn(`Error reading AsyncStorage key "${key}":`, error);
		return defaultValue;
	}
};

/**
 * Safely set item in AsyncStorage
 * @param key - Storage key
 * @param value - Value to store
 * @returns Success status
 */
export const setStorageItem = async (
	key: string,
	value: StorageValue
): Promise<boolean> => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (error) {
		console.warn(`Error writing to AsyncStorage key "${key}":`, error);
		return false;
	}
};

/**
 * Safely remove item from AsyncStorage
 * @param key - Storage key
 * @returns Success status
 */
export const removeStorageItem = async (key: string): Promise<boolean> => {
	try {
		await AsyncStorage.removeItem(key);
		return true;
	} catch (error) {
		console.warn(`Error removing AsyncStorage key "${key}":`, error);
		return false;
	}
};

/**
 * Clear multiple storage items
 * @param keys - Array of keys to remove
 * @returns Success status
 */
export const clearStorageItems = async (
	keys: readonly string[]
): Promise<boolean> => {
	try {
		await AsyncStorage.multiRemove(keys as string[]);
		return true;
	} catch (error) {
		console.warn("Error clearing AsyncStorage items:", error);
		return false;
	}
};

/**
 * Clear all storage items
 * @returns Success status
 */
export const clearAllStorage = async (): Promise<boolean> => {
	try {
		await AsyncStorage.clear();
		return true;
	} catch (error) {
		console.warn("Error clearing all AsyncStorage:", error);
		return false;
	}
};

/**
 * Check if AsyncStorage is available
 * @returns Availability status
 */
export const isStorageAvailable = async (): Promise<boolean> => {
	try {
		const test = "__storage_test__";
		await AsyncStorage.setItem(test, "test");
		await AsyncStorage.removeItem(test);
		return true;
	} catch {
		return false;
	}
};

/**
 * Get storage usage info (keys count)
 * @returns Storage info
 */
export const getStorageInfo = async (): Promise<StorageInfo> => {
	try {
		const keys = await AsyncStorage.getAllKeys();
		return {
			totalKeys: keys.length,
			keys: keys as string[],
		};
	} catch (error) {
		console.warn("Error getting storage info:", error);
		return {
			totalKeys: 0,
			keys: [],
		};
	}
};
