import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Themes from '../containers/Themes';
import LoginButton from './LoginButton';
import SignUpButton from './SignUpButton';

const NavBar = () => {
	return (
		<header>
			<Navbar bg='light' expand='lg' fixed='top'>
				<Navbar.Brand>
					<NavLink
						style={{ color: 'black', textDecoration: 'none' }}
						to='/'
					>
						PrPose
					</NavLink>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='mr-auto'>
						<Nav.Link>
							<NavLink to='/'>Home</NavLink>
						</Nav.Link>
						<NavDropdown title='Themes' className='navDropdown'>
							<Themes />
						</NavDropdown>
					</Nav>
					<LoginButton />
					<SignUpButton />
				</Navbar.Collapse>
			</Navbar>
		</header>
	);
};

export default NavBar;
