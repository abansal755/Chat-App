import { CssBaseline } from '@mui/material';
import { Fragment, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuthContext } from './contexts/AuthContext';
import lazyWithPreload from './utils/lazyWithPreload';
import Login from './pages/Login';
import Register from './pages/Register';
import Spinner from './components/ui/Spinner';
const DirectMessages = lazyWithPreload(() => import('./pages/DirectMessages'));
const Home = lazyWithPreload(() => import('./pages/Home'));
const Rooms = lazyWithPreload(() => import('./pages/Rooms'));

const App = () => {
	const authCtx = useAuthContext();

	return (
		<Fragment>
			<CssBaseline enableColorScheme/>
			<Switch>
				<Route path='/' exact>
					<Redirect to='/home'/>
				</Route>
				<Route path='/login'>
					{authCtx.isLoggedIn && <Redirect to='/home'/>}
					{!authCtx.isLoggedIn && <Login/>}
				</Route>
				<Route path='/register'>
					{authCtx.isLoggedIn && <Redirect to='/home'/>}
					{!authCtx.isLoggedIn && <Register/>}
				</Route>
				<Route path='/'>
					{!authCtx.isLoggedIn && <Redirect to='/login'/>}
					{authCtx.isLoggedIn && (
						<Navbar>
							<Suspense fallback={<Spinner/>}>
								<Switch>
									<Route path='/home'>
										<Home/>
									</Route>
									<Route path='/directmessages'>
										<DirectMessages/>
									</Route>
									<Route path='/rooms'>
										<Rooms/>
									</Route>
								</Switch>
							</Suspense>
						</Navbar>
					)}
				</Route>
			</Switch>
		</Fragment>
	)
}

export default App;