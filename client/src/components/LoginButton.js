import React from 'react';
import Button from 'react-bootstrap/Button';
import { NavLink, withRouter } from 'react-router-dom';
import API from '../api/Api';

class LoginButton extends React.Component {
	constructor(props) {
		super();
		this.state = {
			show: true
		};

		this.getStatus = this.getStatus.bind(this);
		this.logout = this.logout.bind(this);
	}

	getStatus() {
		API.get('/login')
			.then(response => {
				if (response.status === 200) {
					console.log('io');
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

	logout() {
		API.post('/logout')
			.then(response => {
				if (response.status === 200) {
					this.setState({
						show: true
					});
					this.props.history.push('/');
				}
			})
			.catch(err => {
				if (err.response) {
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
					<NavLink to='/login'>Log In</NavLink>
				</Button>
			);
		} else {
			return (
				<Button variant='link' onClick={this.logout}>
					Log Out
				</Button>
			);
		}
	}
}

export default withRouter(LoginButton);
