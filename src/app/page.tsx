'use client';
import Signup from '@/pages/Signup';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('✅ SW registered:', reg);
        })
        .catch(err => {
          console.error('❌ SW registration failed:', err);
        });
    }
  }, []);

  return <main>
    <Signup />
  </main>;
}
