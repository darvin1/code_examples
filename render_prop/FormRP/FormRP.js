import defaultMessages from './messages';
import React from 'react';
import types from 'prop-types';

// ----------------

// Validate type

const validate = types.exact({
	required: types.bool,
	confirm: types.string,
	regExp: types.instanceOf(RegExp),
	min: types.number,
	max: types.number
});

/**
 * Render prop component, that provides data and handlers for the form view component.
 */

export default class FormRP extends React.Component {
	static propTypes = {
		ignoreDidUpdate: types.bool,
		extraState: types.object,
		submitMode: types.bool,
		validate,
		onSubmit: types.func,
		messages: types.object,
		render: types.func.isRequired,
		fields: types.objectOf(
			types.exact({
				ignoreOnSubmit: types.bool,
				setterKey: types.string,
				messages: types.object,
				callBack: types.func,
				validate,
				asNumber: types.bool,
				handler: types.oneOf(['boolean', 'setter', 'default']),
				value: types.any,
				type: types.string
			})
		).isRequired,
		data: types.object
	};

	static defaultProps = { validate: {} };

	constructor(props) {
		super(props);

		// Binds

		this._handleServerErrors = this._handleServerErrors.bind(this);
		this.handleFocusSetter = this.handleFocusSetter.bind(this);
		this.setFieldsStatus = this.setFieldsStatus.bind(this);
		this._setExtraState = this._setExtraState.bind(this);
		this.handleBoolean = this.handleBoolean.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSetter = this.handleSetter.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClear = this.handleClear.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);

		// State and handlers initialization

		this.state = this._init();
	}

	/**
	 * Creates initial state of form and static properties for all fields types.
	 *
	 * @private
	 * @returns {object} State.
	 */

	_init() {
		const { extraState, fields, messages, data } = this.props;
		const staticProps = {
			fields: {}
		};
		const state = {
			fields: {},
			...(extraState ? { extraState: extraState } : {})
		};
		const keys = Object.keys(fields);

		keys.forEach(key => {
			const field = fields[key];

			switch (field.type) {
				// Simple field

				default: {
					state.fields[key] = {
						value: (data && data[key]) || field.value,
						status: {}
					};

					// Set static props

					switch (field.handler) {
						case 'boolean': {
							staticProps.fields[key] = {
								onChange: () => this.handleBoolean(key),
								name: key
							};

							break;
						}

						case 'setter': {
							staticProps.fields[key] = {
								onChange: value => this.handleSetter(key, value),
								onFocus: () => this.handleFocusSetter(key),
								name: key
							};

							break;
						}

						default: {
							staticProps.fields[key] = {
								onChange: this.handleChange,
								onFocus: this.handleFocus,
								onBlur: this.handleBlur,
								name: key
							};
						}
					}
				}
			}
		});

		this.messages = {
			...defaultMessages,
			...(FormRP.messages || {}),
			...(messages || {})
		};

		this.staticProps = staticProps;
		return state;
	}

	/**
	 * Validate the value according to the rules.
	 *
	 * @private
	 *
	 * @param  {any}     value          - Value for the validation.
	 * @param  {object}  validateParams - Rules of the validation.
	 * @param  {string}  name           - Field name.
	 * @param  {boolean} [requiredStatus=false]
	 *
	 * @returns {object}
	 */

	_validateValue(value, validateParams, name, requiredStatus = false) {
		let validate;

		if (this.props.validate && validateParams) {
			validate = { ...this.props.validate, ...validateParams };
		} else {
			validate = validateParams || this.props.validate;
		}

		if (!validate) return null;
		if (typeof validate === 'function')
			return validate(value, (isValid, des) => {
				if (isValid) return this._createValidateResult(isValid, name, des);
				return this._createValidateResult(isValid, '', name, des);
			});

		const { min, max, regExp, confirm, required } = validate;

		// Empty test

		let valueIsEmpty = false;

		switch (typeof value) {
			case 'string': {
				if (value.length === 0) valueIsEmpty = true;
				break;
			}

			case 'object': {
				if (value === null) valueIsEmpty = true;
				else if (value instanceof Array && value.length === 0) {
					valueIsEmpty = true;
				} else {
					return this._createValidateResult(true, name);
					//error('For object validation you need to create a custom validation function');
				}
				break;
			}

			case 'boolean': {
				if (!value) valueIsEmpty = true;
				break;
			}

			default:
		}

		if (valueIsEmpty) {
			if (required && requiredStatus) {
				return this._createValidateResult(false, 'required', name);
			}
			return this._createValidateResult(null, name);
		}

		if (typeof value === 'boolean') {
			return this._createValidateResult(true, name);
		}

		// Confirm test

		if (confirm) {
			if (this.state.fields[confirm].value === value) {
				return this._createValidateResult(true, name);
			} else {
				return this._createValidateResult(false, 'confirm', name);
			}
		}

		// Min length test

		if (min) {
			let isValid = true;

			switch (typeof value) {
				case 'string':
				case 'object': {
					if (value.length < min) isValid = false;
					break;
				}

				case 'number': {
					if (value < min) isValid = false;
					break;
				}

				default:
			}

			if (!isValid) {
				return this._createValidateResult(false, 'min', name);
			}
		}

		// Max length test

		if (max) {
			let isValid = true;

			switch (typeof value) {
				case 'string':
				case 'object': {
					if (value.length > max) isValid = false;
					break;
				}

				case 'number': {
					if (value > max) isValid = false;
					break;
				}

				default:
			}

			if (!isValid) {
				return this._createValidateResult(false, 'max', name);
			}
		}

		// RegExp test

		if (regExp) {
			if (!regExp.test(value)) {
				return this._createValidateResult(false, 'regExp', name);
			}
		}

		return this._createValidateResult(true, name);
	}

	/**
	 * Validate all fields.
	 *
	 * @private
	 *
	 * @returns {Array}
	 */

	_validateAll() {
		const { fields } = this.props;
		const keys = Object.keys(fields);

		const validateResults = [];
		let errors = 0;

		keys.forEach(key => {
			const { value, config } = this._getFieldInfo(key);
			const validateResult = this._validateValue(
				this._valuePreparation(value, config),
				config.validate,
				key,
				true
			);

			if (validateResult.isValid === false) errors++;
			validateResults.push(validateResult);
		});

		return [validateResults, errors];
	}

	// -------- Handlers --------

	/**
	 * Handle change for a field
	 */

	handleChange(e) {
		const {
			target: { name, value }
		} = e;
		this._setFieldState(name, 'value', value);

		const { callBack } = this.props.fields[name];

		if (callBack) callBack(value);
	}

	/**
	 * Handle focus for a field
	 */

	handleFocus(e) {
		const {
			target: { name }
		} = e;

		const { status, config } = this._getFieldInfo(name);

		if (status.des) {
			this._setFieldState(name, 'status', {});
		}
	}

	/**
	 * Handle blur for a field
	 */

	handleBlur(e) {
		const {
			target: { name }
		} = e;

		const { value, config } = this._getFieldInfo(name);
		const validateResult = this._validateValue(
			this._valuePreparation(value, config),
			config.validate,
			name
		);

		this._postProcessingValidateResult(validateResult);

		if (this.props.submitMode && validateResult.isValid) {
			this.handleSubmit();
		}

		return { isValid: validateResult.isValid, value };
	}

	/**
	 * Handle for submit form.
	 */

	handleSubmit(e) {
		if (e) e.preventDefault();

		const [validateResults, errors] = this._validateAll();

		this._postProcessingValidateResultAll(validateResults);

		if (!errors) {
			this.props.onSubmit &&
				this.props.onSubmit(
					this._getDataForSubmit(),
					{
						handleServerErrors: this._handleServerErrors,
						setStatus: this.setFieldsStatus,
						...(this.props.extraState ? { setExtraState: this._setExtraState } : {})
					},
					this.state.extraState
				);
		}
	}

	/**
	 * Handle boolean.
	 */

	handleBoolean(name) {
		const { value } = this._getFieldInfo(name);

		this._setFieldState(name, 'value', !value);

		return !value;
	}

	/**
	 * Handle setter.
	 */

	handleSetter(name, value) {
		const {
			status,
			config: { setterKey }
		} = this._getFieldInfo(name);

		this._setFieldState(name, 'value', setterKey ? value[setterKey] : value);

		if (status.error) {
			this._setFieldState(name, 'status', {});
		}
	}

	/**
	 * Handle focus setter.
	 */

	handleFocusSetter(name) {
		const { status } = this._getFieldInfo(name);

		if (status.des) {
			this._setFieldState(name, 'status', {});
		}
	}

	/**
	 * Handle clear
	 */

	handleClear(name) {
		this._setFieldState(name, 'value', '');
	}

	// -------- Utils --------

	/**
	 * @private
	 *
	 * @param {string} name
	 *
	 * @returns {object} - All info about field.
	 */

	_getFieldInfo(name) {
		return {
			status: this.state.fields[name].status,
			config: this.props.fields[name],
			value: this.state.fields[name].value,
			name
		};
	}

	/**
	 * @private
	 *
	 * @param {any}    value
	 * @param {object} config
	 *
	 * @returns {any} - Prepared value.
	 */

	_valuePreparation(value, config) {
		return config.asNumber && typeof value === 'string' && value.length ? +value : value;
	}

	/**
	 * @private
	 *
	 * @param {boolean|null} isValid
	 *
	 * @returns {object}
	 */

	_createValidateResult(isValid, ...rest) {
		if (isValid === false) return { isValid, errorType: rest[0], name: rest[1], des: rest[2] };
		if (isValid === true) return { isValid, name: rest[0], des: rest[1] };
		return { isValid: null, name: rest[0] };
	}

	/**
	 * @private
	 *
	 * @param {object} validateResult
	 */

	_postProcessingValidateResult(validateResult) {
		const { name, isValid, errorType, des } = validateResult;

		if (isValid === null) {
			this._setFieldState(name, 'status', {});
			return null;
		}

		const messages = this.props.fields[name].messages;

		if (isValid) {
			this._setFieldState(name, 'status', {
				success: true,
				des: des || (messages && messages.valid) || this.messages.valid
			});

			return true;
		} else {
			this._setFieldState(name, 'status', {
				error: true,
				des: des || (messages && messages[errorType]) || this.messages[errorType]
			});

			return false;
		}
	}

	/**
	 * @private
	 *
	 * @param {Array} validateResults
	 */

	_postProcessingValidateResultAll(validateResults) {
		const newStatuses = validateResults.map(result => {
			const { name, isValid, errorType, des } = result;

			if (isValid === null) {
				return {
					name,
					data: {
						status: {}
					}
				};
			}

			const messages = this.props.fields[name].messages;

			if (isValid) {
				return {
					name,
					data: {
						status: {
							success: true,
							des: des || (messages && messages.valid) || this.messages.valid
						}
					}
				};
			} else {
				return {
					name,
					data: {
						status: {
							error: true,
							des: des || (messages && messages[errorType]) || this.messages[errorType]
						}
					}
				};
			}
		});

		this._setFieldsState(newStatuses);
	}

	/**
	 * Merge state and static props for the fields.
	 *
	 * @private
	 * @returns {object} - Object with merged props for the fields.
	 */

	_mergeFieldProps() {
		const { fields } = this.state;
		const fieldsKeys = Object.keys(fields);
		const props = {};

		if (fieldsKeys.length) {
			fieldsKeys.forEach(fieldKey => {
				props[fieldKey] = {
					...this.staticProps.fields[fieldKey],
					...fields[fieldKey]
				};
			});
		}

		return props;
	}

	/**
	 * Set the state for a field.
	 *
	 * @private
	 *
	 * @param  {string} name
	 * @param  {string} prop
	 * @param  {any}    value
	 */

	_setFieldState(name, prop, value) {
		this.setState(prevState => ({
			fields: {
				...prevState.fields,
				[name]: { ...prevState.fields[name], [prop]: value }
			}
		}));
	}

	/**
	 * Set the state for multiple fields.
	 *
	 * @param {Array} arr
	 */

	_setFieldsState(arr) {
		const state = this.state.fields;
		const newState = { ...state };

		arr.forEach(field => {
			newState[field.name] = {
				...state[field.name],
				...field.data
			};
		});

		this.setState({ fields: newState });
	}

	/**
	 * @param {Array} arr
	 */

	setFieldsStatus(arr) {
		const state = this.state.fields;
		const newState = { ...state };

		arr.forEach(field => {
			if (!field) return;

			newState[field.name] = {
				...state[field.name],
				status: {
					...(field.success ? { success: true } : { error: true }),
					des: field.des
				}
			};
		});

		this.setState({ fields: newState });
	}

	/**
	 * Set the extra state.
	 *
	 * @private
	 *
	 * @param  {string} name
	 * @param  {any}    value
	 */

	_setExtraState(name, value) {
		this.setState(prevState => ({
			extraState: {
				...prevState.extraState,
				[name]: value
			}
		}));
	}

	/**
	 * @returns {object} - Data for submit.
	 */

	_getDataForSubmit() {
		const { fields } = this.state;
		const { fields: config } = this.props;
		const keys = Object.keys(fields);
		const data = {};

		keys.forEach(key => {
			if (!config[key].ignoreOnSubmit) {
				let { value } = fields[key];

				if (config[key].asNumber) value = +value;

				data[key] = value;
			}
		});

		return data;
	}

	/**
	 * Handle server errors
	 *
	 * @private
	 *
	 * @param {object} errors
	 */

	_handleServerErrors(errors) {
		const keys = Object.keys(errors);

		this.setFieldsStatus(
			keys.map(key => {
				return this.props.fields[key] ? { name: key, error: true, des: errors[key][0] } : undefined;
			})
		);
	}

	// -------- Life cycle --------

	componentDidUpdate(prevProps) {
		if (!this.props.ignoreDidUpdate && prevProps.data !== this.props.data) {
			const { fields } = this.state;
			const { data } = this.props;

			const newFields = { ...fields };
			const keys = Object.keys(data);

			keys.forEach(key => {
				const newValue = data[key];

				if (newFields[key]) {
					newFields[key].value = newValue;
					newFields[key].status = {};
				}
			});

			this.setState({ fields: newFields });
		}
	}

	// -------- Render --------

	render() {
		return this.props.render({
			setExtraState: this._setExtraState,
			extraState: this.state.extraState,
			onSubmit: this.handleSubmit,
			onClear: this.handleClear,
			fields: this._mergeFieldProps()
		});
	}
}
