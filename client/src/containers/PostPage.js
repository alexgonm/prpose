import React from 'react';
import Post from '../components/Post';
import Comment from '../components/Comment';
import SortButton from '../components/SortButton';
import NewComment from '../components/NewComment';
import { getCommentsOfPost } from '../api/Requests';

class PostPage extends React.Component {
	constructor(props) {
		super();
		this.state = {
			id: props.location.state.postId,
			parent: props.location.state.parentId,
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
	}

	getComments(sortOption = this.state.sort) {
		getCommentsOfPost(this.state.id, sortOption).then(response => {
			const commentsToShow = response.data.map(comment => {
				return <Comment comment={comment} />;
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
		this.getComments(value);
	}

	componentDidMount() {
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
				<Post post={this.props.location.state} />
				<NewComment
					postId={this.state.id}
					style={{ marginBottom: '2%', marginLeft: '2%' }}
				/>
				<div style={commentsStyle}>
					<SortButton buttons={this.state.sortOptions} />
					{this.state.comments}
				</div>
			</div>
		);
	}
}

export default PostPage;
