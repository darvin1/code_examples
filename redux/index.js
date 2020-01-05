import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

// Middlewares

import async from './middleware/async';

// Reducers

import reducers from './reducers';

// ----------------

/**
 * @name createReduxStore
 *
 * Create redux store with middlewares
 *
 * @param {object} [preloadedState]
 *
 * @returns {object} Redux store
 */

export default function createReduxStore(preloadedState) {
	const middlewares = [async];

	if (true) {
		middlewares.unshift(
			createLogger({
				predicate: (getState, action) => {
					if (typeof action === 'function') return false;
					return true;
				},
				collapsed: true
			})
		);
	}

	return createStore(combineReducers(reducers), preloadedState, applyMiddleware(...middlewares));
}
