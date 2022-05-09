/** @type {import('next').NextConfig} */
const { version } = require("./package.json");
module.exports = {
	reactStrictMode: true,
	webpack: (config) => {
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
	env: {
		APP_VERSION: version,
	},
};
