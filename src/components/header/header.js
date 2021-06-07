import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Menu } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/initSupabase';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

export const Header = ({ paths, user }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const classes = useStyles();

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<div className={classes.root}>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6' className={classes.title}>
						Project Car DB
					</Typography>
					{user ? (
						<Button color='inherit'>
							<Link to='/profile' style={{ textDecoration: 'none', marginLeft: 10 }}>
								<Typography style={{ color: '#fff', fontSize: '0.875rem' }}>Profile</Typography>
							</Link>
						</Button>
					) : null}
					{user ? (
						<Button color='inherit' onClick={async () => await supabase.auth.signOut()}>
							Sign Out
						</Button>
					) : (
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<Link to='/login' style={{ textDecoration: 'none', marginLeft: 10 }}>
								<Typography style={{ color: '#fff', fontSize: '0.875rem' }}>Sign In</Typography>
							</Link>
							<Link to='/signup' style={{ textDecoration: 'none', marginLeft: 10 }}>
								<Typography style={{ color: '#fff', fontSize: '0.875rem' }}>Sign Up</Typography>
							</Link>
						</div>
					)}
					<Button color='inherit' aria-controls='simple-menu' aria-haspopup onClick={handleClick}>
						Menu
					</Button>
					<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
						{paths.map((path, i) => {
							return (
								<MenuItem key={i} onClick={handleClose}>
									<Link to={`${path}`}>{path}</Link>
								</MenuItem>
							);
						})}
					</Menu>
				</Toolbar>
			</AppBar>
		</div>
	);
};
