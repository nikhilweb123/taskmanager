/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    // Suppress "Critical dependency: the request of a dependency is an expression"
    // from @supabase/realtime-js (dynamic imports Webpack can't statically analyze).
    // Safe to ignore: app works at runtime; see https://github.com/supabase/realtime-js/issues/265
    config.ignoreWarnings = [
      ...(Array.isArray(config.ignoreWarnings) ? config.ignoreWarnings : []),
      { module: /node_modules[\\/]@supabase[\\/]realtime-js[\\/]/ },
    ];
    return config;
  },
};

module.exports = nextConfig;
