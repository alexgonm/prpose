import React from 'react';
import { Form, FormControl, FormLabel, Button } from 'react-bootstrap';
import API from '../api/Api';

class SignUpForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		};

		this.validateForm = this.validateForm.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signUp = this.signUp.bind(this);
	}

	validateForm() {
		return (
			this.state.username.length > 0 &&
			this.state.email.length > 0 &&
			this.state.password.length > 0 &&
			this.state.password === this.state.confirmPassword
		);
	}

	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	signUp() {
		const username = this.state.username;
		const email = this.state.email;
		const password = this.state.password;
		const informations = JSON.stringify({ username, email, password });
		API.post('/signup', informations)
			.then(response => {
				if (response.status === 200) {
					this.props.history.push('/');
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	render() {
		const signupStyle = {
			paddingTop: '5%',
			margin: '0 auto',
			maxWidth: '320px'
		};
		return (
			<div style={signupStyle}>
				<h3 style={{ marginBottom: '5%' }}>Sign Up</h3>
				<Form onSubmit={this.signUp} style={{ paddingLeft: 20 }}>
					<Form.Group controlId='username' size='lg'>
						<FormLabel>Username</FormLabel>
						<FormControl
							autoFocus
							type='text'
							value={this.state.username}
							onChange={this.handleChange}
						/>
					</Form.Group>
					<Form.Group controlId='email' bsSize='large'>
						<FormLabel>Email</FormLabel>
						<FormControl
							autoFocus
							type='email'
							value={this.state.email}
							onChange={this.handleChange}
						/>
					</Form.Group>
					<Form.Group controlId='password' bsSize='large'>
						<FormLabel>Password</FormLabel>
						<FormControl
							value={this.state.password}
							onChange={this.handleChange}
							type='password'
						/>
					</Form.Group>
					<Form.Group controlId='confirmPassword' bsSize='large'>
						<FormLabel>Confirm Password</FormLabel>
						<FormControl
							value={this.state.confirmPassword}
							onChange={this.handleChange}
							type='password'
						/>
					</Form.Group>
					<Button
						block
						size='lg'
						disabled={!this.validateForm()}
						type='submit'
					>
						Sign Up
					</Button>
				</Form>
			</div>
		);
	}
}

export default SignUpForm;
