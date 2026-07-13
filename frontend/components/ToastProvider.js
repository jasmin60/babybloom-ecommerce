'use client';
import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          borderRadius: '999px',
          background: '#3A3A3A',
          color: '#fff',
          padding: '10px 18px',
        },
      }}
    />
  );
}
