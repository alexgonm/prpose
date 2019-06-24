import React from 'react';
import Post from '../components/Post';

class PostPage extends React.Component {
	constructor(props) {
		super();
		this.state = {
			id: props.post.postId,
			parent: props.post.parentId,
			username: props.post.username,
			themes: [],
			title: props.post.title,
			content: props.post.content,
			time: {
				hour: props.post.publicationHour,
				date: props.post.publicationDate
			}
		};
	}
	render() {
		return null;
	}
}

export default PostPage;
