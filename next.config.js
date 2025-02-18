/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output:
    "standalone" /* ここの部分を追加（reactStrictMode~のところは不要かも？） */,
};

module.exports = nextConfig;
Config;
