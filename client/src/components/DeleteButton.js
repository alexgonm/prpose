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
		console.log('io');
		isUserLoggedIn()
			.then(response => {
				console.log('fff');
				console.log(response.data);
				if (response.data.username === this.state.username) {
					this.setState({
						isLoggedIn: true
					});
				}
				console.log(this.state.isLoggedIn);
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
		deleteElement(this.state.type, this.state.id).then(response => {
			if (response.status === 200) {
				this.props.history.push('/');
			}
		});
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
