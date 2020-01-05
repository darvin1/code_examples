/**
 * @param {any} value - The value to inspect.
 *
 * @returns {boolean} - True if the argument appears to be a plain object.
 */

export default function isPlainObject(value) {
	if (typeof value !== 'object' || value === null) return false;

	return !(value instanceof Array);
}
