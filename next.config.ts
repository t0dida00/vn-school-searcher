import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production builds from overwriting Turbopack's active dev cache.
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
 async redirects() {
    return [
      {
        source: '/',
        destination: '/school-list',
        permanent: true, // or false if it's temporary
      },
    ];
  },
};

export default nextConfig;
