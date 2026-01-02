'use client';

import { 
  LayoutDashboard, 
  Car, 
  Package, 
  PlusCircle, 
  List,
  Users,
  ChevronLeft,
  Shield,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    label: 'Add Car',
    icon: PlusCircle,
    href: '/admin/add-car',
  },
  {
    label: 'Cars List',
    icon: List,
    href: '/admin/cars',
  },
  {
    label: 'Orders',
    icon: Package,
    href: '/admin/orders',
  },
  {
    label: 'Users',
    icon: Users,
    href: '/admin/users',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-bg-card border border-bg-elevated rounded-lg shadow-lg hover:bg-bg-elevated transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="size-6 text-gold" />
        ) : (
          <Menu className="size-6 text-gold" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-bg-secondary border-r border-bg-elevated transition-all duration-300 
          flex flex-col h-screen shadow-xl
          
          ${isCollapsed ? 'w-20' : 'w-64'}
          
          fixed lg:sticky top-0 left-0 z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 border-b border-bg-elevated flex items-center justify-between px-4 bg-bg-secondary shrink-0">
          {!isCollapsed && (
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-2"
            >
              <div className="size-8 bg-gold rounded-lg flex items-center justify-center shadow-md shadow-gold/30">
                <Shield className="size-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gold">RENTAL DRIVE</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link 
              href="/admin/dashboard" 
              className="flex items-center justify-center w-full"
            >
              <div className="size-8 bg-gold rounded-lg flex items-center justify-center shadow-md shadow-gold/30">
                <Shield className="size-5 text-black" />
              </div>
            </Link>
          )}
        </div>

        {/* Collapse Button - Desktop Only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block absolute -right-3 top-20 bg-bg-card border border-bg-elevated rounded-full p-1 hover:bg-bg-elevated hover:border-gold/50 transition-all z-10 shadow-lg"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={`size-4 text-gold transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-bg-elevated scrollbar-track-transparent">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gold text-black shadow-lg shadow-gold/30 font-bold'
                        : 'text-gray-300 hover:bg-bg-elevated hover:text-gold'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className="size-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-bg-elevated bg-bg-secondary shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors font-medium"
            >
              <Car className="size-4" />
              <span>View Main Site</span>
            </Link>
          </div>
        )}

        {/* Mobile Close Button at Bottom */}
        <div className="lg:hidden p-4 border-t border-bg-elevated shrink-0">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-elevated text-gray-300 rounded-lg hover:bg-bg-card hover:text-gold transition-colors font-medium"
          >
            <X className="size-4" />
            <span>Close Menu</span>
          </button>
        </div>
      </aside>
    </>
  );
}
