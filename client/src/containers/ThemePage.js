import React from 'react';
import Image from 'react-bootstrap/Image';
import { withRouter } from 'react-router-dom';
import Post from '../components/Post';
import SortButton from '../components/SortButton';
import Loading from '../components/Loading';
import API from '../api/Api';

class ThemePage extends React.Component {
	constructor(props) {
		super();
		this.state = {
			theme: props.match.params.theme,
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
		// 		const {theme} =this.props.match.params
		// ;
		// 		this.setState({
		// 			theme: theme
		// 		});
		console.log(this.state.theme);
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
			const styles = {
				textAlign: 'center'
			};

			const textStyle = {
				textAlign: 'center'
			};

			return (
				<div>
					<div style={styles}>
						<Image src={require('../ysuv0.jpg')} roundedCircle />

						<h3 style={textStyle}>Oops! There are no posts yet!</h3>
					</div>
				</div>
			);
		}
	}
}

export default withRouter(ThemePage);
