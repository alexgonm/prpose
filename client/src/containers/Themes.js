import React, { Component } from 'react';
import ThemeNav from '../components/ThemeNav';
import { getThemes } from '../api/Requests';
import Loading from '../components/Loading';

class Themes extends Component {
	constructor() {
		super();
		this.state = {
			items: [],
			isLoaded: false
		};
	}

	getThemes() {
		getThemes()
			.then(response => {
				this.setState({
					items: response.data,
					isLoaded: true
				});
			})
			.catch(err => console.log(err));
	}

	componentDidMount() {
		this.getThemes();
	}

	render() {
		if (this.state.isLoaded) {
			const themes = this.state.items.map(item => {
				return <ThemeNav key={item.theme} theme={item.theme} />;
			});
			return (
				<div
					style={{
						height: 'auto',
						maxHeight: '50vh',
						overflowX: 'auto'
					}}
				>
					{themes}
				</div>
			);
		} else {
			return <Loading />;
		}
	}
}

export default Themes;
