import React, { Component } from 'react';
import SortButton from '../components/SortButton';
import Post from '../components/Post';
import Presentation from '../components/Presentation';
import API from '../api/Api';
import Image from 'react-bootstrap/Image';
import Loading from '../components/Loading';

class Home extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
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
			isLoading: true
		};
	}

	getPosts(sortOption = this.state.sort) {
		API.get(`/p/all?sort=${sortOption}`)
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
				console.log(err.message);
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
					<Presentation />
					<div>
						<SortButton
							buttons={this.state.sortOptions}
							value={this.state.sort}
						/>
						{this.state.posts}
					</div>
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
						<Presentation />
						<Image src={require('../ysuv0.jpg')} roundedCircle />

						<h3 style={textStyle}>Oops! There are no posts yet!</h3>
					</div>
				</div>
			);
		}
	}
}

export default Home;
