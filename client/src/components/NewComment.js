import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { createComment } from '../api/Requests';

class NewComment extends Component {
	constructor(props) {
		super();
		this.state = {
			postId: props.postId,
			commentContent: '',
			open: false,
			error: false
		};

		this.validateForm = this.validateForm.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	validateForm() {
		const valid = this.state.commentContent.length > 0;
		return valid;
	}

	handleClick(event) {
		this.setState(prevState => {
			return {
				open: !prevState.open
			};
		});
	}

	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit(event) {
		const postID = this.state.postId;
		const commentContent = this.state.commentContent;
		const informations = JSON.stringify({ postID, commentContent });
		createComment(informations)
			.then(response => {
				if (response.status === 200) {
					window.location.reload();
				}
			})
			.catch(err => {
				this.setState({
					error: true
				});
			});
	}

	render() {
		const openStyle = this.state.open
			? {
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto',
					maxWidth: '500px'
			  }
			: {
					display: 'none',
					marginLeft: 'auto',
					marginRight: 'auto',
					maxWidth: '500px'
			  };

		return (
			<div>
				<Button
					variant='primary'
					onClick={this.handleClick}
					style={{
						width: '10em',
						margin: '0 auto'
					}}
				>
					New Comment?
				</Button>
				<div>
					<div style={openStyle}>
						<h3 style={{ marginBottom: '3%' }}>Create a post</h3>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId='commentContent' size='lg'>
								<Form.Label>Content</Form.Label>
								<Form.Control
									placeholder='Leave your thoughts'
									onChange={this.handleChange}
									as='textarea'
									rows='3'
								/>
							</Form.Group>
							<Button
								block
								size='lg'
								type='submit'
								disabled={!this.validateForm()}
							>
								COMMENT
							</Button>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}

export default NewComment;
