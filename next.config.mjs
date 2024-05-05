// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				// hostname: 'work-test-web-2024-eze6j4scpq-lz.a.run.app',
				hostname: '**',
				port: '',
				// pathname: '/images/**',
				pathname: '**',
			},
		],
	},
}

export default nextConfig
