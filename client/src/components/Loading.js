import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading = props => {
	const loadingAnimation = {
		display: 'block',
		margin: 'auto',
		height: props.size,
		width: props.size
	};
	return (
		<Spinner animation='border' role='status' style={loadingAnimation}>
			<span className='sr-only'>Loading...</span>
		</Spinner>
	);
};

export default Loading;
