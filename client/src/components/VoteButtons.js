import React, { Component } from 'react';
import API from '../api/Api';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

class UpvoteButton extends Component {
	constructor(props) {
		super();
		this.state = {
			id: props.id,
			type: props.type,
			upvotes: 0,
			disabled: false
		};

		this.getUpvotes = this.getUpvotes.bind(this);
		this.giveUpvote = this.giveUpvote.bind(this);
		this.disableButton = this.disableButton.bind(this);
		this.getVoteState = this.getVoteState.bind(this);
	}

	getUpvotes() {
		API.get(`/${this.state.type}/${this.state.id}/upvotes`)
			.then(response => {
				this.setState({
					upvotes: response.data[0].upvotes
				});
			})
			.catch(err => {
				this.setState({
					error: true
				});
				console.log(err);
			});
	}

	giveUpvote() {
		API.post(`/${this.state.type}/${this.state.id}/upvote`)
			.then(response => {
				this.getUpvotes();
			})
			.catch(err => {
				this.setState({
					error: true
				});
				console.log(err);
			});
	}

	getVoteState() {
		API.get(`/p/${this.state.id}/voteState`)
			.then(response => {
				if (response.status === 200) {
					this.setState({
						disabled: false
					});
				}
			})
			.catch(err => {
				this.setState({
					disabled: true
				});
			});
	}

	disableButton() {
		this.giveUpvote();
		this.setState(prevState => {
			return {
				disabled: !prevState.disabled
			};
		});
	}

	componentDidMount() {
		this.getUpvotes();
		this.getVoteState();
	}

	render() {
		var buttonStyle = {};
		if (this.state.type === 'c') {
			buttonStyle = buttonStyle = {
				borderBottomLeftRadius: 0,
				borderTopLeftRadius: 20,
				borderBottomRightRadius: 0,
				borderTopRightRadius: 20,
				margin: '2%'
			};
		} else {
			buttonStyle = {
				borderBottomLeftRadius: 20,
				borderTopLeftRadius: 20,
				borderBottomRightRadius: 0,
				borderTopRightRadius: 0
			};
		}

		return (
			<div>
				<Button
					variant='success'
					style={buttonStyle}
					size='sm'
					onClick={this.disableButton}
					disabled={this.state.disabled}
				>
					+{this.state.upvotes}
				</Button>
			</div>
		);
	}
}

class DownvoteButton extends Component {
	constructor(props) {
		super();
		this.state = {
			id: props.id,
			type: props.type,
			downvotes: 0,
			disabled: false
		};

		this.getDownvotes = this.getDownvotes.bind(this);
		this.giveDownvote = this.giveDownvote.bind(this);
		this.disableButton = this.disableButton.bind(this);
		this.getVoteState = this.getVoteState.bind(this);
	}

	getDownvotes() {
		API.get(`/${this.state.type}/${this.state.id}/downvotes`)
			.then(response => {
				this.setState({
					downvotes: response.data[0].downvotes
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	giveDownvote() {
		API.post(`/${this.state.type}/${this.state.id}/downvote`)
			.then(response => {
				this.getDownvotes();
			})
			.catch(err => {
				console.log(err);
			});
	}

	getVoteState() {
		API.get(`/p/${this.state.id}/voteState`)
			.then(response => {
				if (response.status === 200) {
					this.setState({
						disabled: false
					});
				}
			})
			.catch(err => {
				this.setState({
					disabled: true
				});
			});
	}

	disableButton() {
		this.giveDownvote();
		this.setState(prevState => {
			return {
				disabled: !prevState.disabled
			};
		});
	}

	componentDidMount() {
		this.getDownvotes();
		this.getVoteState();
	}

	render() {
		var buttonStyle = {};
		if (this.state.type === 'c') {
			buttonStyle = buttonStyle = {
				borderBottomLeftRadius: 20,
				borderTopLeftRadius: 0,
				borderBottomRightRadius: 20,
				borderTopRightRadius: 0
			};
		} else {
			buttonStyle = {
				borderBottomLeftRadius: 0,
				borderTopLeftRadius: 0,
				borderBottomRightRadius: 20,
				borderTopRightRadius: 20
			};
		}

		return (
			<div>
				<Button
					variant='danger'
					style={buttonStyle}
					size='sm'
					onClick={this.disableButton}
					disabled={this.state.disabled}
				>
					-{this.state.downvotes}
				</Button>
			</div>
		);
	}
}

function VoteButtons(props) {
	if (props.type === 'c') {
		return (
			<ButtonGroup vertical>
				<UpvoteButton id={props.id} type={props.type} />
				<DownvoteButton id={props.id} type={props.type} />
			</ButtonGroup>
		);
	} else {
		return (
			<ButtonGroup>
				<UpvoteButton id={props.id} type={props.type} />
				<DownvoteButton id={props.id} type={props.type} />
			</ButtonGroup>
		);
	}
}

export { UpvoteButton, DownvoteButton, VoteButtons };
