import createActionType from '../utils/createActionType';
import fetch from '../../utils/fetch';

// ----------------

export default store => next => action => {
	if (typeof action === 'function') {
		return action(store);
	}

	next(action);

	if (/.+_\$NETWORK$/.test(action.type)) {
		const { after, token, type, ...config } = action;

		async function handler() {
			try {
				const result = await fetch(config, after, token);

				store.dispatch({
					type: createActionType(type),
					payload: result
				});

				return result;
			} catch (error) {
				store.dispatch({
					type: createActionType(type, false)
				});

				switch (error.status) {
					case 400: {
						throw error.data;
					}

					case 401: {
						// Logout

						//store.dispatch(logout());
						return;
					}

					case 404: {
						break;
					}

					default:
						throw new Error('Unknown error | Async middleware');
				}
			}
		}

		return handler();
	}
};
