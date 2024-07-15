/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/windsor",
  env: {
    DOMAIN_API: process.env.DOMAIN_API,
  },
  async redirects() {
    return [
      {
        source: "/windsor",
        destination: "/windsor/auth/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
