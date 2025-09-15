import { ReactNode } from 'react';

import MainLayoutClient from './_components/MainLayoutClient';
import { Toaster } from 'react-hot-toast';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-50">
      <div className="relative h-dvh w-full overflow-hidden bg-[var(--background)] md:w-[500px]">
        <MainLayoutClient>{children}</MainLayoutClient>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            backgroundColor: '#242424',
            color: '#fff',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            className: 'bg-green-500 text-white shadow-lg',
          },
          error: {
            className: 'bg-red-500 text-white shadow-lg',
          },
          blank: {
            className: 'bg-blue-500 text-white shadow-lg',
          },
        }}
      />
    </div>
  );
}
