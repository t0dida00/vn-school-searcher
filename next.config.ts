import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
