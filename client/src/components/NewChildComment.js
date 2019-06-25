import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { createCommentChild } from '../api/Requests';

class NewChildComment extends Component {
	constructor(props) {
		super();
		this.state = {
			postID: props.postId,
			parentId: props.parentId,
			commentContent: ''
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
		const postID = this.state.postID;
		const parentId = this.state.parentId;
		const commentContent = this.state.commentContent;
		const informations = JSON.stringify({
			postID,
			parentId,
			commentContent
		});
		createCommentChild(informations)
			.then(response => {
				if (response.status === 200) {
					window.location.reload();
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	componentDidMount() {
		console.log(this.state.postID, 'post');
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
						marginLeft: '2%',
						marginRight: '2%',
						maxWidth: '500px',
						marginTop: '1%'
					}}
				>
					REPLY
				</Button>
				<div>
					<div style={openStyle}>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId='commentContent' size='lg'>
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
								SEND
							</Button>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}

export default NewChildComment;
