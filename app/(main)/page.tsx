'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

const heroData = [
  {
    id: 1,
    title: "Premium Car Rental Service",
    description: "Experience the best car rental platform. Safe, reliable, and affordable.",
    image: "/cars/cover0.jpg",
    alt: "Premium car rental"
  },
  {
    id: 2,
    title: "Drive Your Dream Car Today",
    description: "Unlimited miles, best prices, and top-quality vehicles for every journey.",
    image: "/cars/cover1.jpg",
    alt: "Dream car rental"
  },
  {
    id: 3,
    title: "Adventure Awaits You",
    description: "SUVs, sedans, and luxury cars ready for your next road trip adventure.",
    image: "/cars/cover2.jpg",
    alt: "Adventure car rental"
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentHero(index);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="text-gold text-xl">Loading...</div>
      </div>
    );
  }

  const currentSlide = heroData[currentHero];

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Hero Carousel Section - Modern Layout */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Images - Crossfade */}
        <div className="absolute inset-0">
          {heroData.map((slide, index) => (
            <div
              key={slide.id}
              className={`
                absolute inset-0 w-full h-full transition-all duration-1200 ease-in-out
                ${index === currentHero 
                  ? 'opacity-100 scale-100 blur-none z-20' 
                  : 'opacity-0 scale-110 blur-sm z-10'
                }
              `}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === currentHero}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/60 to-black/90 z-30" />

        {/* Content Container */}
        <div className="relative z-40 flex items-center justify-center h-full px-4">
          <div className="w-full max-w-5xl text-center text-white">
            {/* Main Content */}
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 bg-linear-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                {currentSlide.title}
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl mb-12 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-xl opacity-95">
                {currentSlide.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/login')}
                  className="px-10 py-5 bg-gold text-black font-bold text-lg rounded-2xl hover:bg-gold-light transition-all duration-300 shadow-2xl shadow-gold/50 hover:shadow-gold/70 hover:-translate-y-1 w-full sm:w-auto group"
                >
                  <span className="flex items-center gap-2">
                    Get Started Now
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="px-10 py-5 bg-black/30 backdrop-blur-xl border-2 border-white/50 text-white font-bold text-lg rounded-2xl hover:bg-white/10 hover:border-white/80 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
                >
                  Explore Cars
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Progress Bar Indicators */}
        <div className="absolute bottom-8 left-8 right-8 z-50">
          <div className="flex gap-4">
            {heroData.map((_, index) => (
              <div key={index} className="flex-1 h-1.5 bg-white/20 rounded-full group backdrop-blur-sm overflow-hidden">
                <div 
                  className={`
                    h-full bg-linear-to-r from-gold via-yellow-400 to-orange-400 rounded-full transition-all duration-1000 ease-linear shadow-lg
                    ${index === currentHero 
                      ? 'w-full scale-x-100 shadow-gold/50' 
                      : 'w-0 scale-x-0'
                    }
                  `}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            ))}
          </div>
          
          {/* Slide Counter */}
          {/* <div className="text-white/80 text-sm font-mono mt-2 flex gap-1 justify-center">
            <span>{currentHero + 1}</span>
            <span>/</span>
            <span className="text-gold font-bold">{heroData.length}</span>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <h2 className="text-5xl font-black text-white text-center mb-24 bg-linear-to-r from-white via-gray-200 to-white/80 bg-clip-text">
          Why Choose Rental Drive?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-bg-secondary/80 backdrop-blur-sm p-10 lg:p-12 rounded-3xl border border-white/10 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/20 hover:bg-bg-secondary transition-all duration-700">
            <div className="w-20 h-20 bg-linear-to-br from-gold/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 backdrop-blur-sm">
              <svg className="w-10 h-10 text-gold drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">Wide Selection</h3>
            <p className="text-gray-200 leading-relaxed text-lg opacity-90">
              Choose from premium sedans, SUVs, hatchbacks, and luxury cars to match every need and budget.
            </p>
          </div>
          
          <div className="group bg-bg-secondary/80 backdrop-blur-sm p-10 lg:p-12 rounded-3xl border border-white/10 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/20 hover:bg-bg-secondary transition-all duration-700">
            <div className="w-20 h-20 bg-linear-to-br from-gold/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 backdrop-blur-sm">
              <svg className="w-10 h-10 text-gold drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">Best Prices</h3>
            <p className="text-gray-200 leading-relaxed text-lg opacity-90">
              Transparent pricing with no hidden fees. Get the best rates for premium vehicles guaranteed.
            </p>
          </div>
          
          <div className="group bg-bg-secondary/80 backdrop-blur-sm p-10 lg:p-12 rounded-3xl border border-white/10 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/20 hover:bg-bg-secondary transition-all duration-700">
            <div className="w-20 h-20 bg-linear-to-br from-gold/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 backdrop-blur-sm">
              <svg className="w-10 h-10 text-gold drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.27 7.27c.883.883 2.32.883 3.203 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">24/7 Support</h3>
            <p className="text-gray-200 leading-relaxed text-lg opacity-90">
              Round-the-clock customer service with instant assistance for all your rental needs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
