import React, { Component } from 'react';
import Media from 'react-bootstrap/Media';
import { Link } from 'react-router-dom';
import { VoteButtons } from './VoteButtons';
import { getCommentsOfComment } from '../api/Requests';
import DeleteButton from './DeleteButton';
import NewChildComment from './NewChildComment';

class Comment extends Component {
	constructor(props) {
		super();
		this.state = {
			id: props.comment.commentId,
			parent: props.comment.parentId,
			postId: props.comment.postId,
			username: props.comment.username,
			content: props.comment.content,
			time: {
				hour: props.comment.publicationHour,
				date: props.comment.publicationDate
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
					borderTopStyle: 'solid',
					borderTopColor: '#E6E6E6',
					borderLeftColor: '#3E3F40',
					borderLeftWidth: 4,
					borderTopWidth: 2,
					marginTop: '1%'
				}}
			>
				<VoteButtons
					type='c'
					id={this.state.id}
					style={{ marginLeft: '2%' }}
				/>
				<Media.Body>
					<div style={{ margin: '1%' }}>
						<p>{this.state.content}</p>
						<p style={{ fontSize: 'small' }}>
							posted by{' '}
							<Link to={`/u/${this.state.username}`}>
								{this.state.username}
							</Link>
							,{' '}
							{`${this.state.time.hour}
                        ${this.state.time.date}`}
							<NewChildComment
								parentId={this.state.id}
								postId={this.state.postId}
							/>
							<DeleteButton type='c' id={this.state.id} />
						</p>
					</div>
					{this.state.comments}
				</Media.Body>
			</Media>
		);
	}
}

export default Comment;
