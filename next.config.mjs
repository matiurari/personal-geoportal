/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone",
  basePath: "/portal",
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.BASE_URL,
  }
};

export default nextConfig;