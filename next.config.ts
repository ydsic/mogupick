import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'k.kakaocdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'k.kakaocdn.net', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'mogupick-prod-uploads-apne2.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
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
    const target =
      process.env.PROXY_TARGET_ORIGIN ||
      'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080';
    return [
      {
        source: '/proxy/:path*',
        destination: `${target}/:path*`,
      },
      // OAuth 인가 요청 직접 접근 (프론트가 /oauth2/authorization/* 로 접근할 경우)
      {
        source: '/oauth2/:path*',
        destination: `${target}/oauth2/:path*`,
      },
      // Spring Security 기본 콜백 경로 (/login/oauth2/code/*) 처리
      {
        source: '/login/oauth2/:path*',
        destination: `${target}/login/oauth2/:path*`,
      },
    ];
  },
};

export default nextConfig;
