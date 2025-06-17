// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
  },
  reactStrictMode: true,

  // Modern way to tweak webpack in Next 14+
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      // Force polling so Hot Reload works reliably inside Docker/VMs
      config.watchOptions = {
        poll: 1000,         // check once per second
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
