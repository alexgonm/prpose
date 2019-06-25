import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { deleteElement, isUserLoggedIn } from '../api/Requests';
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
		isUserLoggedIn()
			.then(response => {
				if (response.data.username === this.state.username) {
					this.setState({
						isLoggedIn: true
					});
				}
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
		deleteElement(this.state.type, this.state.id)
			.then(response => {
				if (response.status === 200) {
					this.props.history.push('/');
				}
			})
			.catch(err => console.log(err));
	}

	componentDidMount() {
		this.isLoggedIn();
	}
	render() {
		var buttonStyle = {
			display: 'none'
		};
		if (this.state.isLoggedIn) {
			buttonStyle = {
				display: 'inline'
			};
		}

		return (
			<Button
				style={buttonStyle}
				onClick={this.delete}
				variant='danger'
				size='sm'
			>
				Delete
			</Button>
		);
	}
}

export default withRouter(DeleteButton);
