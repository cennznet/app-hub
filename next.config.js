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
  async redirects() {
    return [
      {
        source: "/bridge/connect",
        destination: "/bridge",
        permanent: true,
      },
      {
        source: "/bridge/emery",
        destination: "/bridge",
        permanent: true,
      },
    ];
  },
};
