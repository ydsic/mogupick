import { ReactNode } from 'react';

import MainLayoutClient from './_components/MainLayoutClient';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-100">
      <div className="relative h-dvh w-full overflow-hidden bg-white px-4 md:w-[500px]">
        <MainLayoutClient>{children}</MainLayoutClient>
      </div>
    </div>
  );
}
