'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Phone, Loader2 } from 'lucide-react';

// Separate component that uses searchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const CLIENT_ID = process.env.NEXT_PUBLIC_PHONE_EMAIL_CLIENT_ID;

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    if (accessToken) {
      handlePhoneEmailCallback(accessToken);
    }
  }, [searchParams]);

  const handlePhoneEmailCallback = async (accessToken: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/phone-email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          client_id: CLIENT_ID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Check if user needs to complete profile
      if (data.needsProfileCompletion) {
        router.push('/complete-profile');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const openPhoneEmailAuth = () => {
    const currentUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    const AUTH_URL = `https://www.phone.email/auth/log-in?client_id=${CLIENT_ID}&redirect_url=${encodeURIComponent(currentUrl)}`;
    
    const width = 500;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      AUTH_URL,
      'phoneEmailLogin',
      `toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      setError('Popup was blocked. Please allow popups for this site.');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-blue mb-2">MORENT</h1>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">
              Sign in with your phone number using secure OTP verification
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg text-sm">
              Verifying your phone number...
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={openPhoneEmailAuth}
              disabled={loading}
              className="w-full bg-primary-blue hover:bg-[#264ac6] text-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              <Phone className="size-6" />
              Sign In with Phone
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-primary-blue">1.</span>
                <span>Click Sign In with Phone button</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-blue">2.</span>
                <span>Enter your phone number with country code</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-blue">3.</span>
                <span>Receive OTP on your phone via SMS</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-blue">4.</span>
                <span>Enter OTP to verify and login</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:block relative bg-linear-to-br from-[#54a6ff] to-[#1e3a8a]">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-lg text-white/90 mb-8 text-center max-w-md">
            Secure phone-based authentication powered by Phone.Email - 100% free SMS OTP
          </p>
          
          {/* Car Image */}
          <div className="relative w-full max-w-2xl h-96">
            <Image
              src="/cars/carsCover.png"
              alt="Car rental"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary-blue" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
