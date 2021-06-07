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

export const Login = props => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [err, setErr] = useState({ error: false });

	const classes = useStyles();

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
		<Container maxWidth='md' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
			<Card className={classes.root}>
				<CardContent>
					<Typography className={classes.title} color='textSecondary' gutterBottom>
						Car Project DB
					</Typography>
					<Typography variant='h5' component='h2'>
						Sign In
					</Typography>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<TextField onChange={e => setEmail(e.target.value)} label='Email' style={{ margin: 10 }} />
						<TextField onChange={e => setPassword(e.target.value)} type='password' label='Password' style={{ margin: 10 }} />
					</div>
					<Typography color='textSecondary' style={{ wordWrap: 'normal' }}>
						{err.error ? <p>{err.msg}</p> : null}
					</Typography>
				</CardContent>
				<CardActions>
					<Button size='small' variant='contained' onClick={login}>
						Sign In !
					</Button>
				</CardActions>
			</Card>
		</Container>
	);
};
