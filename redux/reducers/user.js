import * as system_types from '../types/system';
import * as types from '../types/user';
import $ from '../utils/createActionType';

// -------- Default state of the branch --------

const defaultState = {};

// -------- Reducer --------

export default function(state, action) {
	if (!state) return defaultState;

	switch (action.type) {
		// SIGNUP_EMAIL_$NETWORK

		case $(types.SIGNUP_EMAIL_$NETWORK): {
			return action.payload.state;
		}

		// SIGNIN_EMAIL_$NETWORK

		case $(types.SIGNIN_EMAIL_$NETWORK): {
			return action.payload.state;
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
