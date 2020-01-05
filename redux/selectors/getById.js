/**
 * @name getById
 *
 * @param {Array.<Object>} array
 * @param {string}         key
 * @param {string|number}  value
 *
 * @returns {object|null}
 */

export default function getById(array, key, value) {
	return array.find(object => object[key] === value) || null;
}
