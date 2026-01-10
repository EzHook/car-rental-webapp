import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-bg-elevated">
      {/* Main Footer Content */}
      <div className="px-6 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold text-gold mb-4">RENTAL DRIVE</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              India's premier car rental service offering self-drive, pickup-dropoff, 
              and chauffeur-driven solutions across 50+ cities.
            </p>
          </div>

          {/* Header Navigation Links - REPLACED */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-6">Navigate</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Keep other sections as placeholders or remove if not needed */}
          {/* Community Section - Optional */}
          <div className="lg:col-span-3 hidden lg:block">
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li><span className="text-gray-400 text-sm">24/7 Support</span></li>
              <li><span className="text-gray-400 text-sm">Careers</span></li>
              <li><span className="text-gray-400 text-sm">Press</span></li>
            </ul>
          </div>

          {/* Socials Section */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold text-lg mb-6">Follow Us</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Updated Year */}
      <div className="border-t border-bg-elevated">
        <div className="px-6 lg:px-16 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white font-semibold text-sm">
              ©2026 RENTAL DRIVE. All rights reserved
            </p>
            <div className="flex items-center gap-8">
              <Link 
                href="/privacy-policy" 
                className="text-gray-400 font-semibold hover:text-gold transition-colors text-sm"
              >
                Privacy & Policy
              </Link>
              <Link 
                href="/terms-conditions" 
                className="text-gray-400 font-semibold hover:text-gold transition-colors text-sm"
              >
                Terms & Condition
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
