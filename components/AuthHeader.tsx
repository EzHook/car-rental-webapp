'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AuthHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-bg-main border-b border-bg-elevated sticky top-0 z-50 shadow-lg shadow-black/20">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-4 lg:px-16 py-4 lg:py-6">
        <Link href="/" className="shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gold hover:text-gold-light transition-colors">
            RENTAL DRIVE
          </h1>
        </Link>

        {/* Navigation Links with Underline */}
        <nav className="hidden md:flex lg:gap-8 xl:gap-12 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative px-1 py-2 text-sm md:text-base lg:text-lg font-semibold transition-all duration-300 group whitespace-nowrap
                ${isActive(item.href) 
                  ? 'text-gold after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-gold after:rounded-full' 
                  : 'text-gray-300 hover:text-gold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-0 after:h-1 after:bg-gold after:rounded-full group-hover:after:w-full after:transition-all after:duration-300'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Get Started Button */}
        <Link
          href="/login"
          className="hidden md:block bg-gold hover:bg-gold-light text-black px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-bold text-base md:text-lg transition-all duration-300 shadow-lg shadow-gold/30 hover:scale-105 hover:shadow-gold/40 whitespace-nowrap"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Header - Improved Phone Responsiveness */}
      <div className="md:hidden px-4 py-3">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <h1 className="text-xl font-bold text-gold">RENTAL DRIVE</h1>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow-md shadow-gold/20 hover:scale-105 whitespace-nowrap"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile Navigation - Horizontal Scrollable */}
        <nav className="flex overflow-x-auto pb-3 mt-3 scrollbar-hide gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative px-3 py-2 text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 min-w-max
                ${isActive(item.href)
                  ? 'text-gold after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-gold after:rounded-full'
                  : 'text-gray-300 hover:text-gold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-0 after:h-1 after:bg-gold after:rounded-full group-hover:after:w-full after:transition-all after:duration-300'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
