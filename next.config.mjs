import bundleAnalyzer from '@next/bundle-analyzer';
import NextPWA from 'next-pwa';

const prod = process.env.NODE_ENV === 'production';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = NextPWA({
  dest: 'public',
  disable: !prod,
});

const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'lh3.googleusercontent.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'avatars.githubusercontent.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default withBundleAnalyzer(
  withPWA({
    ...nextConfig,
  }),
);
