/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Needed for static export on some platforms
  },
};

export default nextConfig;