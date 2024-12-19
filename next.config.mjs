/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/control_escolar",
  env: {
    DOMAIN_API: process.env.DOMAIN_API,
    DOMAIN_API_PROYECTOS: process.env.DOMAIN_API_PROYECTOS,
  },
};

export default nextConfig;
