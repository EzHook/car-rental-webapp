'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import AuthHeader from '@/components/AuthHeader';
import Footer from '@/components/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show AuthHeader on public routes, Header on protected routes
  const isPublicRoute = ['/', '/login', '/signup', '/about', '/services', '/contact'].includes(pathname);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="text-gold text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {isPublicRoute && !user ? (
        <AuthHeader />
      ) : (
        <Header />
      )}
      
      <main className="min-h-[calc(100vh-140px)]">
        {children}
      </main>
      
      <Footer />
    </>
  );
}
