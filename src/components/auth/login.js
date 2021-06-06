import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/initSupabase';

export const Login = props => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [err, setErr] = useState({ error: false });

	useEffect(() => {
		if (props.isUser) {
			props.history.push('/profile');
		}
	}, [props.isUser]);

	const login = async () => {
		setErr({ error: false });
		const { user, error } = await supabase.auth.signIn({
			email,
			password,
		});
		if (error) {
			console.log('Error:', error);
			setErr({ error: true, msg: error.message });
		} else {
			props.history.push('/profile');
		}
	};

	return (
		<div>
			<p>Email: </p>
			{err.error ? <p>{err.msg}</p> : null}
			<input onChange={e => setEmail(e.target.value)} />
			<p>Password: </p>
			<input onChange={e => setPassword(e.target.value)} />
			<button onClick={login}>Login</button>
		</div>
	);
};
