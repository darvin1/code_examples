import * as system_types from '../types/system';

// -------- Default state of the branch --------

const defaultState = {
	loadingPage: false
};

// -------- Reducer --------

export default function(state, action) {
	if (!state) return defaultState;

	switch (action.type) {
		// START_LOAD_PAGE

		case system_types.START_LOAD_PAGE: {
			return { ...state, loadingPage: true };
		}

		// FINISH_LOAD_PAGE

		case system_types.FINISH_LOAD_PAGE: {
			return { ...state, loadingPage: false };
		}

		case system_types.RESTORE_STATE: {
			return defaultState;
		}

		default: {
			return state;
		}
	}
}
