const prod = process.env.NODE_ENV === 'production';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: !prod,
});

const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};

module.exports = withBundleAnalyzer(
  withPWA({
    ...nextConfig,
  })
);
