import * as system_types from '../types/system';
import * as types from '../types';
import $ from '../utils/createActionType';

// -------- Default state of the branch --------

const defaultState = {};

// -------- Reducer --------

export default function(state, action) {
	if (!state) return defaultState;

	switch (action.type) {
		case 'MUTATION_TYPE_1': {
			return { ...state, ...action.payload };
		}

		case types.RESTORE_BRANCH:
		case system_types.RESTORE_STATE: {
			return defaultState;
		}

		default: {
			return state;
		}
	}
}
