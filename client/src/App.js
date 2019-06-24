import React, { Component } from 'react';
import NavBar from './components/NavBar';
import LoginForm from './containers/LoginForm';
import SignUpForm from './containers/SignUpForm';
//import ThemePage from './containers/ThemePage';
import Home from './containers/Home';
import { Route, HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
	render() {
		const contentStyle = {
			paddingTop: '5%',
			paddingBottom: '5%',
			marginLeft: '3%',
			marginRight: '3%'
		};

		return (
			<HashRouter>
				<div>
					<NavBar />
					{/* <NavBar />
				<LoginForm />
				<Themes /> */}

					{/*<ThemePage theme='Arts' />*/}

					<div style={contentStyle}>
						<Route exact path='/' component={Home} />
						<Route path='/login' component={LoginForm} />
						<Route path='/signup' component={SignUpForm} />
					</div>
				</div>
			</HashRouter>
		);
	}
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
