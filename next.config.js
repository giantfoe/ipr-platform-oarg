/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ozgltzadlpeyexrvvqdr.supabase.co'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig  