// -------- Classic action creator --------

export const classicActionCreatorName = payload => ({
	type: 'MUTATION_TYPE',
	payload
});

// -------- Async action creator --------

export const asyncActionCreatorName = payload => async store => {
	// Do some actions ...
};

// -------- Async network action creator --------

export const asyncNetworkActionCreatorName = payload => ({
	headers: {},
	method: 'GET', // Default
	params: {}, // For GET
	token: true, // Default
	type: 'MUTATION_TYPE_$NETWORK',
	data: {},
	url: '',

	after: data => {
		return data;
	}
});
