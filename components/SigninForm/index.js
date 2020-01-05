import React from 'react';

// Global object

import globalObject from '../../../../../global';

// Components

import FacebookButton from '../../../atoms/buttons/FacebookButton';
import LinkedinButton from '../../../atoms/buttons/LinkedinButton';
import GoogleButton from '../../../atoms/buttons/GoogleButton';
import FieldLabel from '../../../atoms/FieldLabel';
import Button from '../../../atoms/Button';
import Input from '../../../atoms/Input';
import Link from '../../../atoms/Link';
import Text from '../../../atoms/Text';

// Types

import { form } from '../../../../../types';

// Style

import './style.scss';

// ----------------

// Type of props

SigninForm.propTypes = {
	...form
};

// ----------------

export default function SigninForm(props) {
	const { submitting, extraState, fields, onSubmit } = props;
	const {
		route: { signinForm: l }
	} = globalObject.local;

	// Render

	return (
		<form className="signin-form" onSubmit={submitting ? e => e.preventDefault() : onSubmit}>
			{/* Title */}

			<div className="signin-form__title">
				<Text h="2">{l.title}</Text>
			</div>

			{/* Social buttons */}

			<div className="signin-form__social-buttons">
				<div className="signin-form__row">
					<FacebookButton width="full">{l.socialButtons.facebook}</FacebookButton>
				</div>
				<div className="signin-form__row">
					<LinkedinButton width="full">{l.socialButtons.linkedin}</LinkedinButton>
				</div>
				<div className="signin-form__row">
					<GoogleButton width="full">{l.socialButtons.google}</GoogleButton>
				</div>
			</div>

			<div className="signin-form__or">
				<Text color="on-primary-light">{l.or}</Text>
			</div>

			{extraState.nonFieldsError && (
				<div className="signin-form__error">
					<Text size="middle" color="error">
						{extraState.nonFieldsError}
					</Text>
				</div>
			)}

			{/* Fields */}

			<div className="signin-form__fields">
				<div className="signin-form__row">
					<FieldLabel status={fields.email.status}>
						<Input placeholder={l.fields.email.placeholder} {...fields.email} />
					</FieldLabel>
				</div>
				<div className="signin-form__row">
					<FieldLabel status={fields.password.status}>
						<Input
							placeholder={l.fields.password.placeholder}
							{...fields.password}
							type="password"
						/>
					</FieldLabel>
				</div>
			</div>

			{/* Forgot password */}

			<div className="signin-form__forgot-password">
				<Link href="/auth/forgot-password">
					<Text color="inherit">{l.forgotPassword}</Text>
				</Link>
			</div>

			{/* Footer */}

			<div className="signin-form__footer">
				<Button width="full" type="submit" load={submitting}>
					{l.button}
				</Button>
			</div>

			<p className="signin-form__terms">
				<Text size="small" color="on-primary-light">
					{l.terms[0]}{' '}
					<Link href="/">
						<mark>{l.terms[1]}</mark>
					</Link>{' '}
					{l.terms[2]}
				</Text>
			</p>

			<p className="signin-form__account">
				<Text color="inherit" size="middle">
					{l.account[0]}{' '}
					<Link href="/auth/signup/user">
						<mark>{l.account[1]}</mark>
					</Link>
				</Text>
			</p>
		</form>
	);
}
