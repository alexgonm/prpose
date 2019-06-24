import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';

function ThemeNav(props) {
	return (
		<NavDropdown.Item>
			<NavLink to={`/t/${props.theme}`}>{props.theme}</NavLink>
		</NavDropdown.Item>
	);
}

export default ThemeNav;
