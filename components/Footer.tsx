import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="px-6 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold text-primary-blue mb-4">MORENT</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Our vision is to provide convenience and help increase your sales business.
            </p>
          </div>

          {/* About Section */}
          <div className="lg:col-span-2">
            <h3 className="text-gray-900 font-semibold text-lg mb-6">About</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/how-it-works" 
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link 
                  href="/featured" 
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link 
                  href="/partnership" 
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Partnership
                </Link>
              </li>
              <li>
                <Link 
                  href="/business-relation" 
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Bussiness Relation
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div className="lg:col-span-3">
            <h3 className="text-gray-900 font-semibold text-lg mb-6">Community</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/events" 
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/podcast" 
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Podcast
                </Link>
              </li>
              <li>
                <Link 
                  href="/invite" 
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Invite a friend
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Section */}
          <div className="lg:col-span-3">
            <h3 className="text-gray-900 font-semibold text-lg mb-6">Socials</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://discord.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-blue transition-colors text-sm"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="px-6 lg:px-16 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-900 font-semibold text-sm">
              ©2022 MORENT. All rights reserved
            </p>
            <div className="flex items-center gap-8">
              <Link 
                href="/privacy-policy" 
                className="text-gray-900 font-semibold hover:text-primary-blue transition-colors text-sm"
              >
                Privacy & Policy
              </Link>
              <Link 
                href="/terms-conditions" 
                className="text-gray-900 font-semibold hover:text-primary-blue transition-colors text-sm"
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
