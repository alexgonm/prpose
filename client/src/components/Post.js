import React, { Component } from 'react';
import { getThemesOfPost } from '../api/Requests';
import { VoteButtons } from './VoteButtons';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';

class Post extends Component {
	constructor(props) {
		super();
		this.state = {
			showAll: false,
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

		this.getThemes = this.getThemes.bind(this);
	}

	getThemes() {
		getThemesOfPost(this.state.id).then(response => {
			const themesOfPost = response.data.map(item => {
				return (
					<Badge pill key={item.theme} variant='info'>
						{item.theme}
					</Badge>
				);
			});

			this.setState(prevState => {
				return {
					themes: themesOfPost
				};
			});
		});
	}

	componentDidMount() {
		this.getThemes();
	}

	render() {
		const timeStyles = {
			fontSize: 'small'
		};

		const postStyles = {
			backgroundColor: '#EBEBEB',
			border: '1px solid #D1CDCD',
			borderRadius: 5,
			marginLeft: '2%',
			marginRight: '2%',
			marginTop: '1%',
			padding: '1%'
		};

		return (
			<div className='post' style={postStyles}>
				<h4>
					<Link to={`/p/${this.state.id}`}>{this.state.title}</Link>
				</h4>
				<p>{this.state.content}</p>
				<VoteButtons id={this.state.id} type='p' />
				<div className='postInfo'>
					{this.state.themes}
					<div>
						<p style={timeStyles}>
							posted by{' '}
							<Link to={`/u/${this.state.username}`}>
								{this.state.username}
							</Link>
							,{' '}
							{`${this.state.time.hour}
						${this.state.time.date}`}
						</p>
						<DeleteButton
							type='p'
							id={this.state.id}
							username={this.state.username}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Post;
