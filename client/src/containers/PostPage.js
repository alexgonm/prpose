import React from 'react';
import { withRouter } from 'react-router-dom';
import Post from '../components/Post';
import Comment from '../components/Comment';
import SortButton from '../components/SortButton';
import NewComment from '../components/NewComment';
import { getPost, getCommentsOfPost } from '../api/Requests';

class PostPage extends React.Component {
	constructor(props) {
		super();
		this.state = {
			id: props.match.params.postId,
			parentId: '',
			comments: [],
			sortOptions: [
				{
					name: 'top',
					method: value => {
						this.handleSelect(value);
					}
				},
				{
					name: 'new',
					method: value => {
						this.handleSelect(value);
					}
				}
			],
			sort: 'top'
		};

		this.getComments = this.getComments.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.getPost = this.getPost.bind(this);
	}

	getPost(postId) {
		getPost(postId)
			.then(response => {
				this.setState({
					post: <Post post={response.data[0]} />
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	getComments(sortOption = this.state.sort) {
		getCommentsOfPost(this.state.id, sortOption).then(response => {
			const commentsToShow = response.data.map(comment => {
				return <Comment key={comment.commentId} comment={comment} />;
			});

			this.setState({
				comments: commentsToShow
			});
		});
	}

	handleSelect(value) {
		this.setState({
			sort: value
		});
		this.getComments(this.state.sort);
	}

	componentDidMount() {
		this.getPost(this.state.id);
		this.getComments();
	}

	render() {
		const commentsStyle = {
			backgroundColor: '#BBBEBF',
			border: '1px solid #D1CDCD',
			borderRadius: 5,
			marginLeft: '3%',
			marginRight: '3%',
			marginTop: '1%',
			padding: '1%'
		};
		return (
			<div>
				{this.state.post}
				<NewComment
					postId={this.props.match.params.postId}
					style={{ margin: '2%' }}
				/>
				<div style={commentsStyle}>
					<SortButton
						buttons={this.state.sortOptions}
						value={this.state.sort}
					/>
					{this.state.comments}
				</div>
			</div>
		);
	}
}

export default withRouter(PostPage);
