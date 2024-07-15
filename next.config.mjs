/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/windsor",
  env: {
    DOMAIN_API: process.env.DOMAIN_API,
  },
};

export default nextConfig;
