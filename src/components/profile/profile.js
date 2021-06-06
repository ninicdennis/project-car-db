import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/initSupabase';
import { useAuth } from '../../utils/sweet-state/authStore';
import Avatar from './uploadAvatar';

export const Profile = props => {
	const [state, actions] = useAuth();
	const [profile, setProfile] = useState({});
	const [year, setYear] = useState('');
	const [make, setMake] = useState('');
	const [model, setModel] = useState('');
	const [loading, setLoading] = useState(false);
	const [avatar_url, setAvatarUrl] = useState(null);
	useEffect(() => {
		const userTest = async () => {
			const loggedUser = supabase.auth.user();
			if (loggedUser === null) {
				props.history.push('/login');
			}
		};
		userTest();
	}, [props.user]);

	useEffect(() => {
		const grabUserDetails = async () => {
			const user = supabase.auth.user();
			const { data, error, status } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id);
			const carDetails = await supabase.from('car-details').select('year, make, model').eq('id', user.id);
			if (error || carDetails.error) {
				console.log('Something happened.');
			} else {
				console.log(data, status);
				setProfile(data[0]);
				setAvatarUrl(data[0].avatar_url);
				const { year, make, model } = carDetails.data[0];
				console.log(year, make, model);
				setYear(year);
				setMake(make);
				setModel(model);
			}
		};
		grabUserDetails();
	}, []);

	const updateProfileAvatar = async avatar => {
		try {
			const user = supabase.auth.user();
			const { data, error } = await supabase.from('profiles').update({ avatar_url: avatar }).eq('id', user.id);
			if (error) {
				throw error;
			}
		} catch (e) {
			console.log('Error: ', e);
		}
	};

	const saveCarInfo = async () => {
		setLoading(true);
		try {
			const user = supabase.auth.user();
			const { data, error } = await supabase.from('car-details').update({ year, make, model }).match({ id: user.id });
			console.log(data);
			if (error) {
				throw error;
			}
		} catch (e) {
			console.log('Something happened ');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div>Welcome: {profile.username}</div>
			<Avatar
				url={avatar_url}
				size={150}
				onUpload={url => {
					setAvatarUrl(url);
					updateProfileAvatar(url);
				}}
			/>
			<div>
				<p>Enter Your Vehicle Description:</p>
				<p>Year</p>
				<input type='text' value={year} onChange={e => setYear(e.target.value)} />
				<p>Make</p>
				<input type='text' value={make} onChange={e => setMake(e.target.value)} />
				<p>Model</p>
				<input type='text' value={model} onChange={e => setModel(e.target.value)} />
				<button onClick={() => saveCarInfo()}>Save Info</button>
				{loading ? 'Loading' : ''}
			</div>
		</div>
	);
};
