import classNames from 'classnames';
import types from 'prop-types';
import React from 'react';

// Components

import UiSize from '../UiSize';

// Style

import './style.scss';

// ----------------

// Type of props

Input.propTypes = {
	placeholder: types.string,
	onChange: types.func.isRequired,
	onFocus: types.func,
	onBlur: types.func,
	status: types.shape({
		error: types.bool
	}),
	value: types.oneOfType([types.string, types.number]).isRequired,
	name: types.string.isRequired
};

// Default value for props

Input.defaultProps = {
	status: {},
	width: 'full'
};

// ----------------

export default function Input(props) {
	const {
		placeholder,
		onChange,
		onFocus,
		onBlur,
		status: { error },
		height,
		width,
		value,
		name,
		type,
		...rest
	} = props;

	// Modifiers

	const inputFieldClass = classNames({
		input__field: true,
		'input__field--error': error
	});

	// Render

	return (
		<UiSize width={width} height={height}>
			<div className="input">
				<input
					autoComplete={type === 'password' ? 'new-password' : 'off'}
					placeholder={placeholder}
					className={inputFieldClass}
					onChange={onChange}
					onFocus={onFocus}
					onBlur={onBlur}
					value={value}
					name={name}
					type={type}
					{...rest}
				/>
			</div>
		</UiSize>
	);
}
