/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@partograma/domain', '@partograma/validators', '@partograma/ui'],
  experimental: {
    // Otimizações de performance
  },
  // Proxy para API em desenvolvimento
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
