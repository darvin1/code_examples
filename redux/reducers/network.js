import * as system_types from '../types/system';

// -------- Default state of the branch --------

const defaultState = {};

// -------- Reducer --------

export default function(state, action) {
	if (!state) return defaultState;

	switch (true) {
		case /.+_\$NETWORK$/.test(action.type): {
			return {
				...state,
				[action.type]: true
			};
		}

		case /.+_\$NETWORK_SUCCESS$/.test(action.type) || /.+_\$NETWORK_ERROR$/.test(action.type): {
			const newState = {};
			const keys = Object.keys(state);

			keys.forEach(processKey => {
				if (processKey !== action.type.slice(0, action.type.lastIndexOf('_'))) {
					newState[processKey] = state[processKey];
				}
			});

			return newState;
		}

		case action.type === system_types.RESTORE_STATE: {
			return defaultState;
		}

		default: {
			return state;
		}
	}
}
