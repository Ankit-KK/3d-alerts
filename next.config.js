/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'three',
    '@react-three/drei',
    '@react-three/postprocessing',
    '@react-three/rapier',
    'postprocessing',
  ],
};

module.exports = nextConfig;
