import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

class SortButton extends React.Component {
	constructor(props) {
		super();
		this.state = {
			buttons: props.buttons.map(item => {
				return (
					<Dropdown.Item
						key={item.name}
						eventKey={item.name}
						onSelect={item.method}
					>
						{item.name}
					</Dropdown.Item>
				);
			}),
			sort: 'best'
		};
	}

	render() {
		return (
			<div className='sortButton'>
				<DropdownButton
					className='sortPost'
					title={`Sorted by: ${this.props.value}`}
				>
					{this.state.buttons}
				</DropdownButton>
			</div>
		);
	}
}

export default SortButton;
