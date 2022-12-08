/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["i.pravatar.cc", "imagedelivery.net", "i.ibb.co"],
  },
};

module.exports = nextConfig;
