/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_APP_ENV: process.env.REACT_APP_APP_ENV,
    ENVIRONMENT: process.env.ENVIRONMENT
  }
};

module.exports = nextConfig;
