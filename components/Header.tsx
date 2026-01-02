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
    <header className="bg-bg-main border-b border-bg-elevated sticky top-0 z-50 shadow-lg shadow-black/20">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between gap-8 px-6 lg:px-16 py-6">
        <Link href="/" className="shrink-0">
          <h1 className="text-3xl font-bold text-gold hover:text-gold-light transition-colors ">RENTAL DRIVE</h1>
        </Link>

        {!isPaymentPage && (
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gold" />
              <input
                type="text"
                placeholder="Search something here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-bg-card border border-bg-elevated rounded-full focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-grey-400 text-sm"
              />
            </div>
            
            {onFilterClick && (
              <button 
                onClick={onFilterClick}
                className="p-3 bg-bg-card border border-bg-elevated rounded-full hover:bg-bg-elevated hover:border-gold/50 transition-all shrink-0"
                aria-label="Filter"
              >
                <SlidersHorizontal className="size-5 text-gold" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-5 shrink-0">
          {/* Only show these icons when user is logged in */}
          {user && (
            <>
              <button className="p-2 rounded-full hover:bg-bg-elevated transition-colors">
                <Heart className="size-6 text-gray-400 hover:text-gold transition-colors" />
              </button>
              
              <button className="relative p-2 rounded-full hover:bg-bg-elevated transition-colors">
                <Bell className="size-6 text-gray-400 hover:text-gold transition-colors" />
                <span className="absolute top-2 right-2 size-2 bg-gold rounded-full animate-pulse"></span>
              </button>
              
              {/* Settings Icon - Now clickable */}
              <Link 
                href="/settings"
                className="p-2 rounded-full hover:bg-bg-elevated transition-colors"
              >
                <Settings className="size-6 text-gray-400 hover:text-gold transition-colors" />
              </Link>
            </>
          )}
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="size-11 rounded-full bg-bg-elevated overflow-hidden cursor-pointer hover:ring-2 hover:ring-gold transition-all flex items-center justify-center"
              >
                <User className="size-6 text-gold" />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-bg-card rounded-lg shadow-xl border border-bg-elevated py-2 z-20">
                    <div className="px-4 py-2 border-b border-bg-elevated">
                      <p className="font-semibold text-white">
                        {user.fullName || 'User'}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {user.countryCode} {user.phone}
                      </p>
                    </div>
                    
                    <Link
                      href="/bookings"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left hover:bg-bg-elevated flex items-center gap-2 text-gray-300 hover:text-gold transition-colors"
                    >
                      <Package className="size-4" />
                      My Bookings
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left hover:bg-bg-elevated flex items-center gap-2 text-gray-300 hover:text-gold transition-colors"
                    >
                      <Settings className="size-4" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-bg-elevated flex items-center gap-2 text-gray-300 hover:text-gold transition-colors"
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
              className="bg-gold hover:bg-gold-light text-black px-6 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-gold/30"
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
            <h1 className="text-2xl font-bold text-gold">Car Rental</h1>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="size-10 rounded-full bg-bg-elevated overflow-hidden flex items-center justify-center"
                >
                  <User className="size-5 text-gold" />
                </button>

                {showMobileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMobileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-bg-card rounded-lg shadow-xl border border-bg-elevated py-2 z-20">
                      <div className="px-4 py-3 border-b border-bg-elevated">
                        <p className="font-semibold text-white">
                          {user.fullName || 'User'}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {user.countryCode} {user.phone}
                        </p>
                      </div>
                      
                      <Link
                        href="/bookings"
                        onClick={() => setShowMobileMenu(false)}
                        className="w-full px-4 py-2.5 text-left hover:bg-bg-elevated flex items-center gap-3 text-gray-300 hover:text-gold transition-colors"
                      >
                        <Package className="size-5" />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setShowMobileMenu(false)}
                        className="w-full px-4 py-2.5 text-left hover:bg-bg-elevated flex items-center gap-3 text-gray-300 hover:text-gold transition-colors"
                      >
                        <Settings className="size-5" />
                        <span>Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left hover:bg-bg-elevated flex items-center gap-3 text-gray-300 hover:text-gold transition-colors"
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
                className="bg-gold hover:bg-gold-light text-black px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300"
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold size-5" />
                <input
                  type="text"
                  placeholder="Search something here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-card border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
