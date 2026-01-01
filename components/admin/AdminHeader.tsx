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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - can add search or breadcrumbs */}
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-900 hidden md:block">Admin Panel</h2>
          
          {/* Search */}
          <div className="relative hidden lg:block flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
            />
          </div>
        </div>

        {/* Right side - notifications and user menu */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="size-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"></span>
          </button>

          {admin && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <div className="size-8 bg-primary-blue rounded-full flex items-center justify-center">
                  <User className="size-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{admin.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{admin.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
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
          )}
        </div>
      </div>
    </header>
  );
}
