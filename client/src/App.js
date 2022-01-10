import { CssBaseline } from '@mui/material';
import { Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuthContext } from './contexts/AuthContext';
import DirectMessages from './pages/DirectMessages';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';

const App = () => {
	const authCtx = useAuthContext();

	return (
		<Fragment>
			<CssBaseline enableColorScheme/>
			<Switch>
				<Route path='/' exact>
					<Redirect to='/dashboard/home'/>
				</Route>
				<Route path='/login'>
					{authCtx.isLoggedIn && <Redirect to='/dashboard/home'/>}
					{!authCtx.isLoggedIn && <Login/>}
				</Route>
				<Route path='/register'>
					{authCtx.isLoggedIn && <Redirect to='/dashboard/home'/>}
					{!authCtx.isLoggedIn && <Register/>}
				</Route>
				<Route path='/dashboard'>
					{!authCtx.isLoggedIn && <Redirect to='/login'/>}
					{authCtx.isLoggedIn && (
						<Navbar>
							<Switch>
								<Route path='/dashboard/home'>
									<Home/>
								</Route>
								<Route path='/dashboard/directmessages'>
									<DirectMessages/>
								</Route>
								<Route path='/dashboard/rooms'>
									<Rooms/>
								</Route>
							</Switch>
						</Navbar>
					)}
				</Route>
			</Switch>
		</Fragment>
	)
}

export default App;