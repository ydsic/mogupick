import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import SessionProviderClient from './provider/SessionProviderClient';

import './globals.css';

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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#000000', // 다크 모드에 맞춘 검정색
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '모바일 앱',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} touch-manipulation antialiased`}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <SessionProviderClient>{children}</SessionProviderClient>
      </body>
    </html>
  );
}
