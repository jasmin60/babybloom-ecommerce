/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // 💻 Local Django media fallback streams
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/media/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      
      // 📦 Whitelist the Amazon asset server causing this error
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com', pathname: '/**' },
      
      // 🍼 Whitelist standard Amazon image domains just in case
      { protocol: 'https', hostname: 'm.media-amazon.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images-amazon.com', pathname: '/**' },
      
      // 🚀 Catch-all wildcard for any other external HTTPS source images
      { protocol: 'https', hostname: '**', pathname: '/**' },
    ],
  },
  // 🛡️ Route API calls safely from Vercel HTTPS to AWS HTTP
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.218.96.115:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;