import React from 'react';
import API from '../api/Api';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class SignUpButton extends React.Component {
	constructor() {
		super();
		this.state = {
			show: true
		};

		this.getStatus = this.getStatus.bind(this);
	}

	getStatus() {
		API.get('/signup')
			.then(response => {
				if (response.status === 200) {
					this.setState({
						show: true
					});
				}
			})
			.catch(err => {
				if (err.response.status === 401) {
					this.setState({
						show: false
					});
				}
			});
	}

	componentDidMount() {
		this.getStatus();
	}

	render() {
		if (this.state.show) {
			return (
				<Button variant='link'>
					<NavLink to='/signup'>Sign Up</NavLink>
				</Button>
			);
		}
		return null;
	}
}

export default SignUpButton;
