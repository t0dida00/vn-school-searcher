import type { NextConfig } from "next";
import { COUNTRY_CODES } from "./app/lib/countries";

const nextConfig: NextConfig = {
 async redirects() {
    // Pages live under /<country>/ (app/[country]/); the old country-less URLs go to Finland.
    // "/" is the landing page (app/page.tsx); /countries was its old address.
    return [
      { source: '/countries', destination: '/', permanent: true },
      { source: '/school-list', destination: '/fi/university-list', permanent: true },
      { source: '/university-list', destination: '/fi/university-list', permanent: true },
      { source: '/:country/school-list', destination: '/:country/university-list', permanent: true },
      // "/vn" alone opens that country's list; listing the codes keeps this from catching /logo.png etc.
      { source: `/:country(${COUNTRY_CODES.join('|')})`, destination: '/:country/university-list', permanent: false },
      { source: '/map', destination: '/fi/map', permanent: true },
      { source: '/school/:id', destination: '/fi/school/:id', permanent: true },
    ];
  },
};

export default nextConfig;
