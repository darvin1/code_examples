import React, { useState } from 'react';
import types from 'prop-types';

// Types

import { selectListItem } from '../../../../types';

// ----------------

// Type of props

SelectRP.propTypes = {
	render: types.func.isRequired,
	value: types.oneOfType([types.string, types.number]),
	keys: types.object,
	list: types.arrayOf(selectListItem).isRequired
};

// Default value for props

SelectRP.defaultProps = {
	keys: { value: 'value', label: 'label' }
};

// ----------------

export default function SelectRP(props) {
	const { render: Render, list, value, keys, ...viewProps } = props;
	const [isListOpen, setList] = useState(false);

	const selected = list.find(option => option[keys.value] === value);

	// Handlers

	function toggleList() {
		setList(!isListOpen);
	}

	// Render

	return (
		<Render
			onHeaderClick={toggleList}
			selected={selected}
			open={isListOpen}
			list={list}
			keys={keys}
			{...viewProps}
		/>
	);
}
