import * as types from '../types/meta';
import url from '../.../../../constants/url';

// -------- Async network action creator --------

/**
 * @name getLocations_$network
 */

export const getLocations_$network = payload => ({
	params: payload.params,
	type: types.GET_LOCATIONS_$NETWORK,
	url: url.meta.locations
});
