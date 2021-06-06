import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/initSupabase';

export const Signup = props => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUser] = useState('');
	const [err, setErr] = useState({ error: false });

	useEffect(() => {
		console.log(props);
		if (props.isUser) {
			props.history.push('/profile');
		}
	}, [props.isUser]);

	const signUp = async () => {
		if (!username) {
			setErr({ error: true, msg: 'Please type in a username.' });
		} else if (username.length < 6) {
			setErr({ error: true, msg: 'Username must be longer than 6 characters.' });
		} else {
			try {
				setErr({ error: false });
				const { user, error } = await supabase.auth.signUp({
					email,
					password,
				});
				if (error) {
					console.log('Error:', error);
					setErr({ error: true, msg: error.message });
				} else {
					const dbPush = await supabase.from('profiles').upsert(
						{
							id: user.id,
							username,
							updated_at: new Date(),
						},
						{ returning: 'minimal' }
					);
					if (dbPush.error) {
						throw error;
					} else {
						props.history.push('/profile');
					}
				}
			} catch (e) {
				console.log('Error: ', e);
				setErr({ error: true, msg: 'Something went wrong. Please try again.' });
			}
		}
	};

	return (
		<div>
			<p>Email: </p>
			{err.error ? <p>{err.msg}</p> : null}
			<input onChange={e => setEmail(e.target.value)} />
			<p>Password: </p>
			<input onChange={e => setPassword(e.target.value)} />
			<p>Username: </p>
			<input onChange={e => setUser(e.target.value)} />
			<button onClick={signUp}>Sign up!</button>
		</div>
	);
};
