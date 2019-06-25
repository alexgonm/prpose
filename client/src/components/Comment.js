import React, { Component } from 'react';
import Media from 'react-bootstrap/Media';
import { Link } from 'react-router-dom';
import { VoteButtons } from './VoteButtons';
import { getCommentsOfComment } from '../api/Requests';

class Comment extends Component {
	constructor(props) {
		super();
		this.state = {
			id: props.comment.commentId,
			parent: props.comment.parentId,
			username: props.comment.username,
			content: props.comment.content,
			time: {
				hour: props.post.publicationHour,
				date: props.post.publicationDate
			},
			comments: []
		};

		this.getComments = this.getComments.bind(this);
	}

	getComments() {
		getCommentsOfComment(this.state.id)
			.then(response => {
				const commentsToShow = response.data.map(comment => {
					return <Comment comment={comment} />;
				});

				this.setState({
					comments: commentsToShow
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	componentDidMount() {
		this.getComments();
	}

	render() {
		return (
			<Media
				style={{
					borderLeftStyle: 'solid',
					borderColor: '#3E3F40',
					borderLeftWidth: 2
				}}
			>
				<VoteButtons type='c' id={this.state.id} />
				<Media.Body>
					<p>{this.state.content}</p>
					<p style={{ fontSize: 'small' }}>
						posted by{' '}
						<Link to={`/u/${this.state.username}`}>
							{this.state.username}
						</Link>
						,{' '}
						{`${this.state.time.hour}
						${this.state.time.date}`}
					</p>
				</Media.Body>
				{this.state.comments}
			</Media>
		);
	}
}

export default Comment;
