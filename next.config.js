/** @type {import('next').NextConfig} */
const supabaseWarning =
  /Critical dependency: the request of a dependency is an expression/;

/** Filters out Supabase realtime-js "Critical dependency" warnings from compilation. */
function FilterSupabaseWarningsPlugin() {}
FilterSupabaseWarningsPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('FilterSupabaseWarnings', (compilation) => {
    compilation.hooks.afterSeal.tap('FilterSupabaseWarnings', () => {
      if (!Array.isArray(compilation.warnings)) return;
      const kept = compilation.warnings.filter(
        (w) => !supabaseWarning.test(String(w.message || ''))
      );
      compilation.warnings.splice(0, compilation.warnings.length, ...kept);
    });
  });
};

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // Suppress "Critical dependency..." from @supabase/realtime-js (dynamic requires).
    // Safe to ignore: app works at runtime; see https://github.com/supabase/realtime-js/issues/265
    config.ignoreWarnings = [
      ...(Array.isArray(config.ignoreWarnings) ? config.ignoreWarnings : []),
      { message: supabaseWarning },
    ];
    config.stats = {
      ...(config.stats || {}),
      warningsFilter: [supabaseWarning],
    };
    config.plugins.push(new FilterSupabaseWarningsPlugin());

    // Fix: "Module not found: Can't resolve 'bufferutil'"
    // 1. On the client side, we want to ignore these Node.js-specific modules.
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        'bufferutil': false,
        'utf-8-validate': false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
