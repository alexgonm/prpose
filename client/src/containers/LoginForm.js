import React from 'react';
import API from '../api/Api';
import { withRouter } from 'react-router-dom';
import { Form, FormControl, Button, FormLabel } from 'react-bootstrap';

//import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

class LoginForm extends React.Component {
	constructor() {
		super();
		this.state = {
			show: true,
			username: '',
			password: '',
			error: false
		};

		this.getStatus = this.getStatus.bind(this);
		this.handleChangeUsername = this.handleChangeUsername.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.submitLogin = this.submitLogin.bind(this);
	}

	getStatus() {
		API.get('/login')
			.then(response => {
				this.setState(prevState => {
					return { show: true };
				});
			})
			.catch(err => {
				if (err.response) {
					if (err.response.status === 401) {
						this.setState(prevState => {
							return { show: false };
						});
					}
				} else {
					console.log('Error', err.message);
				}
			});
	}

	componentDidMount() {
		this.getStatus();
	}

	validateForm() {
		const valid =
			this.state.username.length > 0 && this.state.password.length > 0;
		return valid;
	}

	handleChangeUsername(event) {
		event.persist();
		this.setState({
			username: event.target.value
		});
	}

	handleChangePassword(event) {
		event.persist();
		this.setState({
			password: event.target.value
		});
	}

	submitLogin() {
		const username = this.state.username;
		const password = this.state.password;
		const informations = JSON.stringify({ username, password });
		API.post('/login', informations)
			.then(response => {
				setTimeout(
					this.setState({
						show: false
					}),
					1000
				);
				this.props.history.push('/');
			})
			.catch(err => {
				if (err.response) {
					this.setState({
						show: true,
						error: true
					});
				}
			});
	}

	render() {
		if (this.state.show) {
			const loginStyle = {
				paddingTop: '5%',
				margin: '0 auto',
				maxWidth: '320px'
			};

			return (
				<div style={loginStyle}>
					<h3 style={{ marginBottom: '5%' }}>Log In</h3>
					<Form
						onSubmit={this.submitLogin}
						style={{ paddingLeft: 20 }}
					>
						<Form.Group controlId='username' size='lg'>
							<FormLabel>Username</FormLabel>
							<FormControl
								autoFocus
								placeholder='Username'
								onChange={this.handleChangeUsername}
							/>
						</Form.Group>
						<Form.Group controlId='password' size='lg'>
							<FormLabel>Password</FormLabel>
							<FormControl
								placeholder='Password'
								onChange={this.handleChangePassword}
								type='password'
							/>
						</Form.Group>
						<Button
							block
							size='lg'
							type='submit'
							disabled={!this.validateForm()}
						>
							Login
						</Button>
						{this.state.error ? (
							<h6 style={{ color: 'red' }}>
								Wrong Username/Password
							</h6>
						) : (
							<p />
						)}
					</Form>
				</div>
			);
		} else {
			return (
				<div>
					<h1>Already connected</h1>
				</div>
			);
		}
	}
}

export default withRouter(LoginForm);
