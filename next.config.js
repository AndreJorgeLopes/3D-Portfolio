const withTM = require('next-transpile-modules')(['maath', 'react-tilt']);

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['media.tenor.com'],
	},
	webpack: (config, { isServer }) => {
		// Handle worker files
		config.module.rules.push({
			test: /\.worker\.(js|ts|jsx|tsx)$/,
			use: {
				loader: 'worker-loader',
				options: {
					filename: 'static/[hash].worker.js',
					publicPath: '/_next/',
				},
			},
		});

		// Fix for @react-three/offscreen
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				module: false,
				path: false,
				crypto: false,
			};
		}

		// Fix for dynamic imports
		config.module.parser = {
			...config.module.parser,
			javascript: {
				...config.module.parser?.javascript,
				dynamicImportMode: 'eager',
			},
		};

		return config;
	},
	experimental: {
		esmExternals: 'loose',
	},
};

module.exports = withTM(nextConfig);
