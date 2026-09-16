/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone",
  basePath: "/portal",
  env: {
    CESIUM_ION_TOKEN: process.env.CESIUM_ION_TOKEN
  }
};

export default nextConfig;