module.exports = {
	images: {
		unoptimized: process.env.NODE_ENV === "production",
		remotePatterns: [
			{ protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
			{ protocol: 'https', hostname: 'cloud.papihairdesign.sk', port: '', pathname: '/**' },
			{ protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
			{ protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
			{ protocol: 'https', hostname: 'storage.googleapis.com', port: '', pathname: '/studio-240839726-8d197.appspot.com/**' },
			{ protocol: 'https', hostname: 'studio-240839726-ba22d.firebasestorage.app', port: '', pathname: '/**' }
		],
	},
	env: {
		NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
		NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
		NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
		NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY,
	}
};
