import { Car, Users, Award, Heart, Shield, Target, Zap, TrendingUp, MapPin, Clock, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Vehicles in Fleet' },
    { number: '50+', label: 'Cities Covered' },
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

  return (
    <div className="min-h-screen bg-bg-main text-white">
      {/* Hero Section - Main Title Background Image */}
      <section className="relative bg-linear-to-br from-bg-main/70 via-bg-elevated/70 to-bg-main/70 border-b border-gold/20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('/cars/aboutCover0.jpg')" }}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="relative px-6 lg:px-16 py-20 lg:py-32 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent drop-shadow-2xl">
              Driving Dreams, Delivering Excellence
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              We're more than just a car rental company. We're your trusted travel companion, committed to making every journey memorable, comfortable, and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section - FIXED RESPONSIVE */}
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

      {/* Our Story - Replace Icon with Image */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold">Our Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Founded in 2018, Rental Drive was born from a simple observation: car rental shouldn't be complicated, expensive, or stressful. Our founders, passionate travelers themselves, experienced firsthand the frustrations of traditional car rental services—hidden fees, poor vehicle conditions, and lack of transparency.
                </p>
                <p>
                  We set out to change that. Starting with just 10 vehicles in Mumbai, we built our company on three pillars: quality vehicles, transparent pricing, and exceptional customer service. Every car in our fleet is meticulously maintained, every price is clearly stated, and every customer interaction is handled with care and professionalism.
                </p>
                <p>
                  Today, we're proud to serve thousands of customers across 50+ cities in India. But our mission remains the same: to make car rental simple, affordable, and enjoyable for everyone.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div 
                className="aspect-4/3 w-full bg-linear-to-br from-gold/20 to-gold/5 border-4 border-gold/30 rounded-3xl overflow-hidden hover:border-gold/60 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-gold/20"
                style={{ backgroundImage: "url('/cars/aboutCover6.jpg')" }}
              >
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -inset-2 bg-linear-to-r from-gold/20 to-gold-light/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative px-6 lg:px-16 py-20 border-y border-gold/20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: "url('/mission-bg.jpg')" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-bg-main/95 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 hover:border-gold/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center size-16 bg-gold/10 rounded-full mb-6">
                <Target className="size-8 text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gold">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">To provide accessible, reliable, and affordable car rental solutions that empower people to explore, travel, and live life on their terms.</p>
            </div>
            <div className="bg-bg-main/95 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 hover:border-gold/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center size-16 bg-gold/10 rounded-full mb-6">
                <TrendingUp className="size-8 text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gold">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">To be India's most trusted car rental company, revolutionizing travel through innovation, sustainability, and customer-centric services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative px-6 lg:px-16 py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-8"
          style={{ backgroundImage: "url('/values-bg.jpg')" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Our Core Values</h2>
            <p className="text-gray-300 text-lg">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="group text-center p-8 bg-bg-main/95 backdrop-blur-sm border border-gold/20 rounded-2xl hover:border-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-2">
                <div className="inline-flex items-center justify-center size-20 bg-gold/10 rounded-2xl mb-6 text-gold group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-white">{value.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - NO Background Image */}
      <section className="px-6 lg:px-16 py-20 border-y border-gold/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Our Journey</h2>
            <p className="text-gray-300 text-lg">Milestones that shaped who we are today</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-gold via-gold/50 to-gold/20 transform -translate-x-1/2"></div>
            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex flex-col lg:flex-row gap-8 items-center ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="inline-block bg-bg-main border border-gold/20 rounded-xl p-6 hover:border-gold/50 transition-all duration-300">
                      <div className="text-2xl font-bold text-gold mb-2">{item.year}</div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="size-6 bg-gold rounded-full border-4 border-bg-main shadow-lg shadow-gold/30"></div>
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="relative px-6 lg:px-16 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: "url('/cars/aboutCover2.jpg')" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Meet Our Leadership</h2>
            <p className="text-gray-300 text-lg">The team driving our vision forward</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group text-center p-8 bg-bg-main/95 backdrop-blur-sm border border-gold/20 rounded-2xl hover:border-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-2">
                <div className="size-32 mx-auto mb-6 bg-linear-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center border-2 border-gold/30 group-hover:scale-105 transition-transform duration-300">
                  <Users className="size-16 text-gold" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">{member.name}</h4>
                <div className="text-gold font-semibold mb-3">{member.role}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
