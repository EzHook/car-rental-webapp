import { Car, Users, Award, Heart, Shield, Target, Zap, TrendingUp, MapPin, Clock, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-bg-main via-bg-elevated to-bg-main border-b border-gold/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative px-6 lg:px-16 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <span className="text-gold font-semibold text-sm">🚗 About Rental Drive</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Driving Dreams, Delivering Excellence
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We're more than just a car rental company. We're your trusted travel companion, committed to making every journey memorable, comfortable, and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 lg:px-16 py-16 bg-linear-to-br from-gold/10 via-bg-elevated to-bg-main border-b border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-bg-main border border-gold/20 rounded-xl hover:border-gold/50 transition-all duration-300 hover:scale-105">
                <div className="text-4xl lg:text-5xl font-bold text-gold mb-2">{stat.number}</div>
                <div className="text-gray-400 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
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
                  Today, we're proud to serve thousands of customers across 50+ cities in India. But our mission remains the same: to make car rental simple, affordable, and enjoyable for everyone. Whether you're planning a weekend getaway, need a car for business travel, or want the luxury of a chauffeur-driven ride, we're here to make it happen.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-linear-to-br from-gold/20 to-gold/5 border-2 border-gold/30 rounded-2xl p-8 flex items-center justify-center">
                <Car className="size-48 text-gold opacity-80" />
              </div>
              <div className="absolute -bottom-6 -right-6 size-32 bg-gold rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -top-6 -left-6 size-32 bg-gold-light rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 lg:px-16 py-20 bg-linear-to-br from-bg-elevated to-bg-main border-y border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-bg-main border border-gold/20 rounded-2xl p-8 hover:border-gold/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center size-16 bg-gold/10 rounded-full mb-6">
                <Target className="size-8 text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gold">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To provide accessible, reliable, and affordable car rental solutions that empower people to explore, travel, and live life on their terms. We consistently deliver quality vehicles, friendly service, and great value that make customers confident that Rental Drive is their best choice.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-bg-main border border-gold/20 rounded-2xl p-8 hover:border-gold/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center size-16 bg-gold/10 rounded-full mb-6">
                <TrendingUp className="size-8 text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gold">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To be India's most trusted and preferred car rental company, revolutionizing the way people travel and explore. We aspire to set industry benchmarks through innovation, sustainability, and customer-centric services, making self-drive and chauffeur rentals the first choice for travelers nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Our Core Values</h2>
            <p className="text-gray-300 text-lg">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="group text-center p-8 bg-linear-to-br from-bg-elevated to-bg-main border border-gold/20 rounded-2xl hover:border-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-2"
              >
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

      {/* Timeline */}
      <section className="px-6 lg:px-16 py-20 bg-linear-to-br from-bg-elevated to-bg-main border-y border-gold/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Our Journey</h2>
            <p className="text-gray-300 text-lg">Milestones that shaped who we are today</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-gold via-gold/50 to-gold/20 transform -translate-x-1/2"></div>

            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex flex-col lg:flex-row gap-8 items-center ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="inline-block bg-bg-main border border-gold/20 rounded-xl p-6 hover:border-gold/50 transition-all duration-300">
                      <div className="text-2xl font-bold text-gold mb-2">{item.year}</div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative">
                    <div className="size-6 bg-gold rounded-full border-4 border-bg-main shadow-lg shadow-gold/30"></div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Meet Our Leadership</h2>
            <p className="text-gray-300 text-lg">The team driving our vision forward</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="group text-center p-8 bg-linear-to-br from-bg-elevated to-bg-main border border-gold/20 rounded-2xl hover:border-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-2"
              >
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

      {/* Why Choose Us */}
      <section className="px-6 lg:px-16 py-20 bg-linear-to-br from-bg-elevated to-bg-main border-t border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Why Choose Rental Drive?</h2>
            <p className="text-gray-300 text-lg">What makes us different</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Shield />, text: 'Fully insured vehicles with comprehensive coverage' },
              { icon: <Star />, text: 'Well-maintained, sanitized, and regularly serviced cars' },
              { icon: <Clock />, text: '24/7 customer support and roadside assistance' },
              { icon: <CheckCircle />, text: 'Transparent pricing with no hidden charges' },
              { icon: <MapPin />, text: 'Doorstep delivery and pickup available' },
              { icon: <Award />, text: 'Award-winning service and customer satisfaction' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-6 bg-bg-main border border-gold/20 rounded-xl hover:border-gold/40 transition-all duration-300"
              >
                <div className="shrink-0 size-12 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                  {item.icon}
                </div>
                <p className="text-gray-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-16 py-20 bg-linear-to-br from-gold/10 via-bg-elevated to-bg-main border-t border-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers and discover why Rental Drive is India's trusted choice for car rentals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg shadow-gold/30 hover:scale-105"
            >
              <Car className="size-5" />
              Start Your Journey
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-gold hover:bg-gold/10 text-gold px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
