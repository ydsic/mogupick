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
};

export default nextConfig;
