/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.module.rules.push({
			test: /\.(woff|woff2|eot|ttf|otf)$/i,
			type: "asset/resource",
		});
		return config;
	},
	eslint: {
		dirs: ["pages", "components", "providers"],
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/swap",
				permanent: true,
			},
		];
	},
};
