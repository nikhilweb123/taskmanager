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
  webpack: (config) => {
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
    // ws (used by Supabase) tries to require these optional dependencies.
    // Marking them as external prevents Webpack from trying to bundle them,
    // avoiding the build error. ws handles their absence gracefully at runtime.
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    return config;
  },
};

module.exports = nextConfig;
