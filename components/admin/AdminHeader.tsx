'use client';

import { Bell, LogOut, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminHeaderProps {
  admin: {
    username: string;
    role: string;
  } | null;
}

export default function AdminHeader({ admin }: AdminHeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="bg-bg-secondary border-b border-bg-elevated sticky top-0 z-40 h-16 shadow-lg">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - can add search or breadcrumbs */}
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-semibold text-gold hidden md:block">Admin Panel</h2>
          
          {/* Search */}
          <div className="relative hidden lg:block flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gold size-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500 text-sm"
            />
          </div>
        </div>

        {/* Right side - notifications and user menu */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-bg-elevated rounded-lg transition-colors">
            <Bell className="size-5 text-gray-400 hover:text-gold transition-colors" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-gold rounded-full animate-pulse"></span>
          </button>

          {admin && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-bg-elevated rounded-lg p-2 transition-colors"
              >
                <div className="size-8 bg-gold rounded-full flex items-center justify-center shadow-md shadow-gold/30">
                  <User className="size-4 text-black" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-white">{admin.username}</p>
                  <p className="text-xs text-gray-400 capitalize">{admin.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-bg-card rounded-lg shadow-xl border border-bg-elevated py-2 z-20">
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
          )}
        </div>
      </div>
    </header>
  );
}
