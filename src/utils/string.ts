/**
 * String utility functions
 */

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str: string) => {
	if (!str || typeof str !== "string") return "";
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
/**
 * Sanitize string for display
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str: string) => {
	if (!str || typeof str !== "string") return "";
	return str.replace(/[<>&"']/g, (char) => {
		const entities = {
			"<": "&lt;",
			">": "&gt;",
			"&": "&amp;",
			'"': "&quot;",
			"'": "&#39;",
		};
		return entities[char as keyof typeof entities] || char;
	});
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @param {string} charset - Character set to use
 * @returns {string} Random string
 */
export const generateRandomString = (
	length = 8,
	charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) => {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return result;
};
