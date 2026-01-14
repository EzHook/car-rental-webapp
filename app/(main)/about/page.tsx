'use client';

import { Car, Users, Award, Heart, Shield, Target, Zap, TrendingUp, MapPin, Clock, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [aboutImages, setAboutImages] = useState<string[]>([]);

  const stats = [
    { number: '25,000+', label: 'Happy Customers' },
    { number: '200+', label: 'Vehicles in Fleet' },
    { number: '13+', label: 'Cities Covered' },
    { number: '24/7', label: 'Customer Support' },
  ];

  const values = [
    {
      icon: <Heart className="size-8" />,
      title: 'Customer First',
      description: 'Every decision we make starts with our customers. Your satisfaction and safety are our top priorities.'
    },
    {
      icon: <Shield className="size-8" />,
      title: 'Trust & Transparency',
      description: 'No hidden fees, no surprises. We believe in honest pricing and clear communication at every step.'
    },
    {
      icon: <Zap className="size-8" />,
      title: 'Innovation',
      description: 'We continuously embrace technology to make car rental easier, faster, and more convenient for you.'
    },
    {
      icon: <Award className="size-8" />,
      title: 'Excellence',
      description: 'From vehicle maintenance to customer service, we maintain the highest standards in everything we do.'
    },
  ];

  const timeline = [
    { year: '2018', title: 'The Beginning', desc: 'Started with 10 cars and a vision to revolutionize car rentals in India' },
    { year: '2020', title: 'Expansion', desc: 'Grew to 100+ vehicles across 5 major cities' },
    { year: '2023', title: 'Innovation', desc: 'Launched mobile app and doorstep delivery service' },
    { year: '2026', title: 'Today', desc: '500+ vehicles, 50+ cities, and 10,000+ happy customers' },
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      bio: '15+ years in automotive industry with a passion for customer service'
    },
    {
      name: 'Priya Sharma',
      role: 'COO',
      bio: 'Operations expert committed to delivering seamless rental experiences'
    },
    {
      name: 'Amit Patel',
      role: 'Head of Technology',
      bio: 'Tech innovator driving digital transformation in car rental'
    },
  ];

  // Fetch Cloudinary about images
  useEffect(() => {
    const fetchAboutImages = async () => {
      try {
        const response = await fetch('/api/about-images');
        const data = await response.json();
        if (data.success) {
          setAboutImages(data.images.map((img: any) => img.publicId));
        }
      } catch (error) {
        console.error('Failed to fetch about images:', error);
      }
    };
    fetchAboutImages();
  }, []);

  return (
    <div className="min-h-screen bg-bg-main text-white">
      {/* Hero Section - Cloudinary Background */}
      <section className="relative bg-linear-to-br from-bg-main/70 via-bg-elevated/70 to-bg-main/70 border-b border-gold/20 overflow-hidden">
        {aboutImages[0] && (
          <div className="absolute inset-0 opacity-20">
            <CldImage
              src={aboutImages[0]}
              alt="About hero background"
              fill
              className="object-cover"
              crop="fill"
              gravity="auto"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="relative px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-32 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent drop-shadow-2xl">
              Driving Dreams, Delivering Excellence
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
              We're more than just a car rental company. We're your trusted travel companion, committed to making every journey memorable, comfortable, and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section - Local Image Background */}
      <section className="relative px-4 sm:px-6 lg:px-16 py-12 sm:py-16 border-b border-gold/20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: "url('/cars/aboutCover1.jpg')" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-4 sm:p-6 bg-bg-main/95 backdrop-blur-sm border border-gold/20 rounded-xl hover:border-gold/50 transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gold mb-2 leading-none">{stat.number}</div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-400 font-semibold leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Mission & Vision - Cloudinary Background */}
      <section className="relative px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20 border-y border-gold/20 overflow-hidden">
        {aboutImages[2] && (
          <div className="absolute inset-0 opacity-8">
            <CldImage
              src={aboutImages[2]}
              alt="Mission background"
              fill
              className="object-cover"
              crop="fill"
              gravity="auto"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-bg-main/95 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 sm:p-8 hover:border-gold/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center size-12 sm:size-16 bg-gold/10 rounded-full mb-4 sm:mb-6">
                <Target className="size-6 sm:size-8 text-gold" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gold">Our Mission</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">To provide accessible, reliable, and affordable car rental solutions that empower people to explore, travel, and live life on their terms.</p>
            </div>
            <div className="bg-bg-main/95 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 sm:p-8 hover:border-gold/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center size-12 sm:size-16 bg-gold/10 rounded-full mb-4 sm:mb-6">
                <TrendingUp className="size-6 sm:size-8 text-gold" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gold">Our Vision</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">To be India's most trusted car rental company, revolutionizing travel through innovation, sustainability, and customer-centric services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Local Background */}
      <section className="relative px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-8"
          style={{ backgroundImage: "url('/values-bg.jpg')" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gold">Our Core Values</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="group text-center p-6 sm:p-8 bg-bg-main/95 backdrop-blur-sm border border-gold/20 rounded-2xl hover:border-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-2">
                <div className="inline-flex items-center justify-center size-16 sm:size-20 bg-gold/10 rounded-2xl mb-4 sm:mb-6 text-gold group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{value.title}</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
