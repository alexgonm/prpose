import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { deleteElement, isLoggedIn } from '../api/Requests';
import { withRouter } from 'react-router-dom';

class DeleteButton extends Component {
	constructor(props) {
		super();
		this.state = {
			id: props.id,
			type: props.type,
			username: props.username,
			isLoggedIn: false
		};

		this.isLoggedIn = this.isLoggedIn.bind(this);
		this.delete = this.delete.bind(this);
	}

	isLoggedIn() {
		const username = this.state.username;
		const informations = JSON.stringify({ username });
		isLoggedIn(informations)
			.then(response => {
				if (response.status === 200) {
					this.setState({
						isLoggedIn: true
					});
				}
				console.log(response.status);
			})
			.catch(err => {
				if (err.response) {
					this.setState({
						isLoggedIn: false
					});
				}
			});
	}

	delete() {
		console.log('suppression');
		// deleteElement(this.state.type, this.state.id).then(response => {
		// 	if (response.status === 200) {
		// 		this.props.history.push('/');
		// 	}
		// });
	}

	componentDidMount() {
		this.isLoggedIn();
	}
	render() {
		return this.state.isLoggedIn ? (
			<Button onClick={this.delete}>Delete</Button>
		) : null;
		// if (this.state.isLoggedIn) {
		// 	return <Button onClick={this.delete}>Delete</Button>;
		// } else {
		// 	return <div />;
		// }
	}
}

export default withRouter(DeleteButton);
