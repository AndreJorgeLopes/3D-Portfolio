const withTM = require("next-transpile-modules")(["maath", "react-tilt"]);
const isProd = process.env.NODE_ENV === "production";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["media.tenor.com"],
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? "/3D-Portfolio" : "",
  basePath: isProd ? "/3D-Portfolio" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/3D-Portfolio" : "",
  },
  output: "export",
  webpack: (config, { isServer }) => {
    // Handle worker files
    config.module.rules.push({
      test: /\.worker\.(js|ts|jsx|tsx)$/,
      use: {
        loader: "worker-loader",
        options: {
          filename: "static/[hash].worker.js",
          publicPath: "/_next/",
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

    return config;
  },
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = withTM(nextConfig);
