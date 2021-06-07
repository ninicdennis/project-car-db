import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/initSupabase';

export default function Banner({ url, size, onUpload, style }) {
	const [bannerUrl, setBannerUrl] = useState(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (url) downloadImage(url);
	}, [url]);

	async function downloadImage(path) {
		try {
			const { data, error } = await supabase.storage.from('banners').download(path);
			console.log(data, error);
			if (error) {
				throw error;
			}
			const url = URL.createObjectURL(data);
			console.log(url);
			setBannerUrl(url);
		} catch (error) {
			console.log('Error downloading image: ', error.message);
		}
	}

	async function uploadBanner(event) {
		try {
			setUploading(true);

			if (!event.target.files || event.target.files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = event.target.files[0];
			const fileExt = file.name.split('.').pop();
			const fileName = `${Math.random()}.${fileExt}`;
			const filePath = `${fileName}`;

			const { error: uploadError } = await supabase.storage.from('banners').upload(filePath, file);

			if (uploadError) {
				throw uploadError;
			}

			onUpload(filePath);
		} catch (error) {
			alert(error.message);
		} finally {
			setUploading(false);
		}
	}

	return (
		<div style={style}>
			{bannerUrl ? (
				<img src={bannerUrl} alt='Banner' className='avatar image' style={{ height: 600, width: '100%', objectFit: 'contain' }} />
			) : (
				<div className='avatar no-image' style={{ height: size, width: size }} />
			)}
			<div style={{ width: size }}>
				<label className='button primary block' htmlFor='double'>
					{uploading ? 'Uploading ...' : 'Upload'}
				</label>
				<input
					style={{
						visibility: 'hidden',
						position: 'absolute',
					}}
					type='file'
					id='double'
					accept='image/*'
					onChange={uploadBanner}
					disabled={uploading}
				/>
			</div>
		</div>
	);
}
