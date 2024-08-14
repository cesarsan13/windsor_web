/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/control_escolar",
  env: {
    DOMAIN_API: process.env.DOMAIN_API,
  },
};

export default nextConfig;
