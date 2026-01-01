'use client';

import { Search, SlidersHorizontal, Heart, Bell, Settings, LogOut, User, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  onFilterClick?: () => void;
}

export default function Header({ onFilterClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isPaymentPage = pathname?.startsWith('/payment');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setShowUserMenu(false);
      setShowMobileMenu(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between gap-8 px-6 lg:px-16 py-6">
        <Link href="/" className="shrink-0">
          <h1 className="text-3xl font-bold text-primary-blue">MORENT</h1>
        </Link>

        {!isPaymentPage && (
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Search something here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-700 placeholder:text-gray-400 text-sm"
              />
            </div>
            
            {onFilterClick && (
              <button 
                onClick={onFilterClick}
                className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shrink-0"
                aria-label="Filter"
              >
                <SlidersHorizontal className="size-5 text-gray-600" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-5 shrink-0">
          {/* Only show these icons when user is logged in */}
          {user && (
            <>
              <button className="p-2 rounded-full hover:bg-gray-50 transition-colors">
                <Heart className="size-6 text-gray-600" />
              </button>
              
              <button className="relative p-2 rounded-full hover:bg-gray-50 transition-colors">
                <Bell className="size-6 text-gray-600" />
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Settings Icon - Now clickable */}
              <Link 
                href="/settings"
                className="p-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                <Settings className="size-6 text-gray-600" />
              </Link>
            </>
          )}
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="size-11 rounded-full bg-gray-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-blue transition-all flex items-center justify-center"
              >
                <User className="size-6 text-gray-600" />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">
                        {user.fullName || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.countryCode} {user.phone}
                      </p>
                    </div>
                    
                    <Link
                      href="/bookings"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    >
                      <Package className="size-4" />
                      My Bookings
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    >
                      <Settings className="size-4" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary-blue hover:bg-[#264ac6] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary-blue">MORENT</h1>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="size-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center"
                >
                  <User className="size-5 text-gray-600" />
                </button>

                {showMobileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMobileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          {user.fullName || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.countryCode} {user.phone}
                        </p>
                      </div>
                      
                      <Link
                        href="/bookings"
                        onClick={() => setShowMobileMenu(false)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <Package className="size-5" />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setShowMobileMenu(false)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <Settings className="size-5" />
                        <span>Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                      >
                        <LogOut className="size-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary-blue text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {!isPaymentPage && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  placeholder="Search something here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-600 placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
