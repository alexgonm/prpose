import React from 'react';
import Post from '../components/Post';
import SortButton from '../components/SortButton';
import API from '../api/Api';
import Loading from '../components/Loading';

class ThemePage extends React.Component {
	constructor(props) {
		super();
		this.state = {
			theme: props.theme,
			sortOptions: [
				{
					name: 'best',
					method: value => {
						this.handleSelect(value);
					}
				},
				{
					name: 'new',
					method: value => {
						this.handleSelect(value);
					}
				},
				{
					name: 'top',
					method: value => {
						this.handleSelect(value);
					}
				}
			],
			sort: 'best',
			posts: [],
			isLoading: true
		};

		this.getPosts = this.getPosts.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
	}

	getPosts(sortOption = this.state.sort) {
		API.get(`/t/${this.state.theme}/posts?sort=${sortOption}`)
			.then(response => {
				const postsToShow = response.data.map(post => {
					return <Post key={post.postId} post={post} />;
				});

				setTimeout(() => {
					this.setState({
						posts: postsToShow,
						isLoading: false
					});
				}, 1000);
			})
			.catch(err => {
				console.log(err);
			});
	}

	handleSelect(value) {
		this.setState(prevState => {
			return {
				sort: value
			};
		});
		this.getPosts(value);
	}

	componentDidMount() {
		this.getPosts();
	}

	render() {
		if (this.state.isLoading) {
			return <Loading size='100px' />;
		} else if (this.state.posts.length > 0) {
			return (
				<div>
					<h2>{`t/${this.state.theme}`}</h2>

					<SortButton
						buttons={this.state.sortOptions}
						value={this.state.sort}
					/>

					{this.state.posts}
				</div>
			);
		} else {
			return (
				<div>
					<img alt='Sad meme' src='../ysuv0.jpg' />
					<p>Oops! There are no posts yet!</p>
				</div>
			);
		}
	}
}

export default ThemePage;
