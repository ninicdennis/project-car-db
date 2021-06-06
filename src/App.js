import React, { useState, useEffect } from 'react';
import './App.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Header } from './components/header/header';
import { Dashboard } from './components/dashboard/dashboard';
import { Home } from './components/home/home';
import { Signup } from './components/auth/signup';
import { Login } from './components/auth/login';
import { Profile } from './components/profile/profile';
import { supabase } from './utils/initSupabase';
const App = () => {
	const [session, setSession] = useState(null);
	const paths = ['/', '/home', '/signup', '/login', '/profile'];

	useEffect(() => {
		setSession(supabase.auth.session());
		supabase.auth.onAuthStateChange((_event, sesh) => {
			setSession(sesh);
		});
	}, []);

	return (
		<BrowserRouter>
			<Header paths={paths} user={session} />
			<Switch>
				<Route exact path='/' component={Dashboard} />
				<Route exact path='/home' component={Home} />
				<Route exact path='/signup' render={props => <Signup {...props} isUser={session ? true : false} />} />
				<Route exact path='/login' render={props => <Login {...props} isUser={session ? true : false} />} />
				<Route exact path='/profile' render={props => <Profile {...props} user={session ? session.user : false} />} />
			</Switch>
		</BrowserRouter>
	);
};
export default App;
