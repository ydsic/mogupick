import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import SessionProviderClient from './_provider/SessionProviderClient';

import './globals.css';
import { Suspense } from 'react';
import { Providers } from './_provider/ReactQeuryProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '모구픽 | 세상의 모든 구독을 한 곳에',
  description: '세상의 모든 구독을 한 곳에, 모구픽',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '모구픽',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
          crossOrigin=""
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} touch-manipulation bg-white antialiased`}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <SessionProviderClient>{children}</SessionProviderClient>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
