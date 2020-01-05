import * as types from '../types/system';

// -------- Classic action creator --------

/**
 * @name startLoadPage
 */

export const startLoadPage = () => ({
	type: types.START_LOAD_PAGE
});

/**
 * @name finishLoadPage
 */

export const finishLoadPage = () => ({
	type: types.FINISH_LOAD_PAGE
});
