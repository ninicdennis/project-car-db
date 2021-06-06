import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/initSupabase';
import ProfileAvatar from '@material-ui/core/Avatar';
export const UserProfile = props => {
	const [userExist, setUserExist] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userDetails, setUserDeatils] = useState({});
	const [avatarUrl, setAvatarUrl] = useState(null);
	useEffect(() => {
		try {
			setLoading(true);
			const getUserProfile = async () => {
				const { data, error } = await supabase.from('profiles').select().eq('username', props.match.params.username);
				if (error) throw error;
				else {
					if (data.length === 1) {
						console.log('User found, loading...');
						const carDetails = await supabase.from('car-details').select('year, make, model').eq('id', data[0].id);
						// console.log(data[0]);
						// console.log(carDetails.data[0]);
						setUserDeatils({
							username: data[0].username,
							ymm: carDetails.data[0],
						});
						downloadImage(data[0].avatar_url);
						setUserExist(true);
					} else {
						setUserExist(false);
						console.log('No user by that username.');
					}
				}
			};
			getUserProfile();
		} catch (e) {
			console.log('Error: ', e);
		} finally {
			setLoading(false);
		}
	}, []);

	const downloadImage = async path => {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path);
			if (error) {
				throw error;
			}
			const url = URL.createObjectURL(data);
			setAvatarUrl(url);
		} catch (error) {
			console.log('Error downloading image: ', error.message);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	} else if (!userExist) {
		return <div>User Not Found</div>;
	} else {
		return (
			<div>
				<div>User: {userDetails.username}</div>
				<ProfileAvatar variant='rounded' src={avatarUrl} alt='Avatar' className='avatar image' style={{ height: 150, width: 150 }} />
				<div>
					{userDetails.ymm.year} {userDetails.ymm.make} {userDetails.ymm.model}
				</div>
			</div>
		);
	}
};
