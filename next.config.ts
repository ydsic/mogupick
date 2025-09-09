import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'k.kakaocdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'k.kakaocdn.net', pathname: '/**' },
    ],
  },
  webpack(config) {
    config.module.rules.unshift({
      test: /\.svg$/i,
      oneOf: [
        { resourceQuery: /url/, type: 'asset/resource' },
        {
          use: [{ loader: '@svgr/webpack', options: { svgo: true, titleProp: true, ref: true } }],
        },
      ],
    });

    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        'C:/hiberfil.sys',
        'C:/pagefile.sys',
        'C:/swapfile.sys',
        'C:/DumpStack.log.tmp',
      ],
    };

    return config;
  },
  async rewrites() {
    const target = process.env.PROXY_TARGET_ORIGIN || 'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080';
    return [
      // Proxy to backend to avoid mixed-content in HTTPS pages
      {
        source: '/proxy/:path*',
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
