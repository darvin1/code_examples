/**
 * Creates a new error.
 *
 * @param {string} message - The error message.
 *
 * @returns {object} - Error object.
 */

export default function error(message) {
	throw new Error(message);
}
