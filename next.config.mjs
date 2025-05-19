/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure we're using the App Router only
  // Next.js 15 uses App Router by default, so we don't need experimental.appDir
  output: 'standalone',
}

export default nextConfig
