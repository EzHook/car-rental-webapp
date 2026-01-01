'use client';

import { 
  LayoutDashboard, 
  Car, 
  Package, 
  PlusCircle, 
  List,
  Users,
  ChevronLeft,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Shield className="size-8 text-primary-blue" />
            <div>
              <h1 className="text-xl font-bold text-primary-blue">MORENT</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center justify-center w-full">
            <Shield className="size-8 text-primary-blue" />
          </Link>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors z-10"
      >
        <ChevronLeft
          className={`size-4 text-gray-600 transition-transform ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
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
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Car className="size-4" />
            <span>View Main Site</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
