import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/initSupabase';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Container } from '@material-ui/core';

const useStyles = makeStyles({
	root: {
		width: 500,
		minWidth: 325,
		maxWidth: 600,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

export const Signup = props => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUser] = useState('');
	const [err, setErr] = useState({ error: false });

	const classes = useStyles();

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
						const detailPush = await supabase.from('car-details').insert({ id: user.id, year: null, make: null, model: null });
						console.log(detailPush);
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
		// <div>
		// 	<p>Email: </p>
		// 	{err.error ? <p>{err.msg}</p> : null}
		// 	<input onChange={e => setEmail(e.target.value)} />
		// 	<p>Password: </p>
		// 	<input onChange={e => setPassword(e.target.value)} />
		// 	<p>Username: </p>
		// 	<input onChange={e => setUser(e.target.value)} />
		// 	<button onClick={signUp}>Sign up!</button>
		// </div>
		<Container maxWidth='md' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
			<Card className={classes.root}>
				<CardContent>
					<Typography className={classes.title} color='textSecondary' gutterBottom>
						Car Project DB
					</Typography>
					<Typography variant='h5' component='h2'>
						Sign Up
					</Typography>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<TextField onChange={e => setEmail(e.target.value)} label='Email' style={{ margin: 10 }} />
						<TextField onChange={e => setUser(e.target.value)} label='Username' style={{ margin: 10 }} />
						<TextField onChange={e => setPassword(e.target.value)} type='password' label='Password' style={{ margin: 10 }} />
					</div>
					<Typography color='textSecondary' style={{ wordWrap: 'normal' }}>
						{err.error ? <p>{err.msg}</p> : null}
					</Typography>
				</CardContent>
				<CardActions>
					<Button size='small' variant='contained' onClick={signUp}>
						Sign Up !
					</Button>
				</CardActions>
			</Card>
		</Container>
	);
};
