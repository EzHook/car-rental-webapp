'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg-main">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-8 bg-bg-main">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center size-16 bg-gold rounded-full mb-4 shadow-lg shadow-gold/30">
              <Shield className="size-8 text-black" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-2">RENTAL DRIVE</h1>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Admin Panel</h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Demo Credentials Info */}
          <div className="bg-bg-card border border-gold/30 rounded-lg p-4">
            <p className="text-sm font-semibold text-gold mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-300">
              <p><span className="font-semibold text-gold">Username:</span> admin@morent.com</p>
              <p><span className="font-semibold text-gold">Password:</span> Admin@12345</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
                Username / Email
              </label>
              <input
                id="username"
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 border-bg-card bg-bg-elevated border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="admin@morent.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-elevated border border-bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-black py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold/30 hover:shadow-gold-light/40 hover:scale-105"
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="size-5" />
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          {/* Back to Site */}
          <div className="text-center pt-4">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-400 hover:text-gold font-semibold transition-colors"
            >
              ← Back to Main Site
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex relative bg-linear-to-br from-bg-elevated to-bg-secondary border-l border-bg-elevated">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="inline-flex items-center justify-center size-24 mb-6 bg-gold/10 rounded-full border-2 border-gold">
            <Shield className="size-12 text-gold" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gold">Admin Dashboard</h2>
          <p className="text-lg text-gray-300 mb-8 text-center max-w-md">
            Manage your car rental business with powerful admin tools
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mt-8 w-full max-w-md">
            <div className="bg-bg-card border border-bg-elevated rounded-lg p-6 text-center hover:border-gold/50 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
              <div className="text-sm font-semibold text-gray-300 group-hover:text-gold transition-colors">Analytics</div>
            </div>
            <div className="bg-bg-card border border-bg-elevated rounded-lg p-6 text-center hover:border-gold/50 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🚗</div>
              <div className="text-sm font-semibold text-gray-300 group-hover:text-gold transition-colors">Manage Cars</div>
            </div>
            <div className="bg-bg-card border border-bg-elevated rounded-lg p-6 text-center hover:border-gold/50 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📦</div>
              <div className="text-sm font-semibold text-gray-300 group-hover:text-gold transition-colors">Bookings</div>
            </div>
            <div className="bg-bg-card border border-bg-elevated rounded-lg p-6 text-center hover:border-gold/50 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
              <div className="text-sm font-semibold text-gray-300 group-hover:text-gold transition-colors">Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
