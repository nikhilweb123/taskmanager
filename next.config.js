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
      (warning) => {
        const msg = String(warning.message || '');
        const mod = warning.module;
        const id =
          mod && typeof mod.identifier === 'function'
            ? mod.identifier()
            : mod?.resource ?? '';
        const idStr = String(id);
        const isCritical = /Critical dependency: the request of a dependency is an expression/.test(msg);
        const isRealtime = /@supabase[\\/]realtime-js|RealtimeClient\.js/.test(idStr);
        return Boolean(isCritical && isRealtime);
      },
      // Fallback: suppress by message if module check fails (e.g. Vercel webpack)
      { message: /Critical dependency: the request of a dependency is an expression/ },
    ];
    return config;
  },
};

module.exports = nextConfig;
