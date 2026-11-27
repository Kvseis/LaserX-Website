/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: '/images/scroll-film/:scene(metal|metal-hd|wood)-24-:sheet(\\d+).webp',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    }];
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.0.107'],
};

export default nextConfig;
