import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import NewPost from './NewPost';

const Presentation = () => {
	return (
		<Jumbotron>
			<h1>
				Welcome to <b>PrPose</b>
			</h1>
			<p>
				Propose your own ideas and concepts to make the world a better
				place.
			</p>
			<NewPost />
		</Jumbotron>
	);
};

export default Presentation;
