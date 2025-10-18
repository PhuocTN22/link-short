/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static export
  images: { unoptimized: true },
  trailingSlash: true, // tránh 404 khi serve static
};
export default nextConfig;
