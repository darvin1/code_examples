/**
 * @name createActionType
 *
 * Create success or error action type
 *
 * @param {string}  currentType
 * @param {boolean} [success=true]
 *
 * @return {string} New action type
 **/

export default function createActionType(currentType, success = true) {
	return success ? `${currentType}_SUCCESS` : `${currentType}_ERROR`;
}
