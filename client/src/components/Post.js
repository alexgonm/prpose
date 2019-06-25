import React, { Component } from 'react';
import { getThemesOfPost } from '../api/Requests';
import { VoteButtons } from './VoteButtons';
import { Badge, Button } from 'react-bootstrap';
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
		this.handleClick = this.handleClick.bind(this);
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

	handleClick(event) {
		this.setState(prevState => {
			return {
				showAll: !prevState.showAll
			};
		});
	}

	componentDidMount() {
		this.getThemes();
	}

	render() {
		const timeStyles = {
			fontSize: 'small',
			width: 'auto'
		};

		const postStyles = {
			backgroundColor: '#EBEBEB',
			border: '2px solid #D1CDCD',
			borderRadius: 5,
			marginLeft: '2%',
			marginRight: '2%',
			marginTop: '1%',
			padding: '1%'
		};
		var afficherReduire;
		var contentToShow = this.state.content;
		if (this.state.content.length > 500 && !this.state.showAll) {
			contentToShow = this.state.content.substring(0, 500);
		}
		afficherReduire = this.state.showAll ? 'Réduire' : 'Afficher';

		return (
			<div className='post' style={postStyles}>
				<h4>
					<Link
						to={{
							pathname: `/p/${this.state.id}`,
							state: this.props.post
						}}
					>
						{this.state.title}
					</Link>
				</h4>
				<p>
					{contentToShow}
					<Button
						style={{ display: 'inline', textDecoration: 'none' }}
						onClick={this.handleClick}
						variant='link'
						size='sm'
					>
						<em style={{ fontSize: 14 }}>{afficherReduire}</em>
					</Button>
				</p>

				<VoteButtons id={this.state.id} type='p' />
				<div className='postInfo'>
					{this.state.themes}
					<div style={timeStyles}>
						<p>
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
							style={{
								position: 'absolute',
								right: 20,
								top: 20
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Post;
