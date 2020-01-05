import * as types from '../types/user';
import Cookies from 'js-cookie';
import url from '../../constants/url';

// Constants

import { TOKEN_NAME, redirect } from '../../constants/system';

// Utils

import redirectTo from '../../utils/redirect';

// -------- Classic action creator --------

export const classicActionCreatorName = payload => ({
	type: 'MUTATION_TYPE',
	payload
});

// -------- Async action creator --------

/**
 * @name signupEmailAsInvestor
 */

export const signupEmailAsInvestor = payload => async store => {
	await store.dispatch(signupEmail({ ...payload, data: { ...payload.data, role: 'investor' } }));
};

/**
 * @name signupEmail
 */

export const signupEmail = payload => async store => {
	await store.dispatch(signupEmail_$network(payload));
};

/**
 * @name signinEmail
 */

export const signinEmail = payload => async store => {
	const res = await store.dispatch(signinEmail_$network(payload));

	Cookies.set(TOKEN_NAME, res.rest.token);
	redirectTo(redirect.AUTH);
};

/**
 * @name patchUser
 */

export const patchUser = payload => async store => {
	const res = await store.dispatch(user_$network({ ...payload, method: 'patch' }));

	console.log(res);
};

// -------- Async network action creator --------

/**
 * @name signupEmail_$network
 */

export const signupEmail_$network = payload => ({
	method: 'post',
	token: false,
	data: payload.data,
	type: types.SIGNUP_EMAIL_$NETWORK,
	url: url.user.signup,

	after: data => {
		return {
			state: {
				email: data.user.email
			}
		};
	}
});

/**
 * @name signinEmail_$network
 */

export const signinEmail_$network = payload => ({
	method: 'post',
	token: false,
	data: payload.data,
	type: types.SIGNIN_EMAIL_$NETWORK,
	url: url.user.signin,

	after: data => {
		return {
			state: {
				email: data.user.email,
				name: data.user.name,
				role: data.user.role
			},
			rest: {
				token: data.token
			}
		};
	}
});

/**
 * @name forgotPassword_$network
 */

export const forgotPassword_$network = payload => ({
	method: 'post',
	token: false,
	data: payload.data,
	type: types.FORGOT_PASSWORD_$NETWORK,
	url: url.user.forgotPassword
});

/**
 * @name newPassword_$network
 */

export const newPassword_$network = payload => ({
	method: 'post',
	token: false,
	data: payload.data,
	type: types.NEW_PASSWORD_$NETWORK,
	url: url.user.newPassword
});

/**
 * @name verifyEmail_$network
 */

export const verifyEmail_$network = payload => ({
	method: 'post',
	token: false,
	data: payload.data,
	type: types.VERIFY_EMAIL_$NETWORK,
	url: url.user.verifyEmail
});

/**
 * @name user_$network
 */

export const user_$network = payload => ({
	method: payload.method,
	data: payload.data,
	type: types.USER_$NETWORK,
	url: url.user.user
});
