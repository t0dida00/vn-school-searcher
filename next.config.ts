import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 async redirects() {
    // Pages live under /<country>/ (app/[country]/); the old country-less URLs go to Finland.
    // "/" is temporary so it can later pick a country (or a country chooser) without browsers caching it.
    return [
      { source: '/', destination: '/fi/university-list', permanent: false },
      { source: '/school-list', destination: '/fi/university-list', permanent: true },
      { source: '/university-list', destination: '/fi/university-list', permanent: true },
      { source: '/:country/school-list', destination: '/:country/university-list', permanent: true },
      { source: '/map', destination: '/fi/map', permanent: true },
      { source: '/school/:id', destination: '/fi/school/:id', permanent: true },
    ];
  },
};

export default nextConfig;
