import { Car, MapPin, Clock, Shield, Star, CheckCircle, Phone, Calendar, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      icon: <MapPin className="size-12 text-gold" />,
      title: 'Pick-up & Drop-off Service',
      description: 'Enjoy ultimate convenience with our door-to-door car rental service. We bring the vehicle to your location and pick it up when you\'re done.',
      features: [
        'Free delivery within city limits',
        'Flexible pickup timing',
        'Contactless handover option',
        'GPS-tracked delivery',
        'No hidden charges'
      ],
      badge: 'Most Popular'
    },
    {
      icon: <Car className="size-12 text-gold" />,
      title: 'Self-Drive Car Rental',
      description: 'Experience the freedom of driving your preferred car without the hassle of ownership. Perfect for weekend trips, daily commutes, or special occasions.',
      features: [
        'Wide range of vehicles',
        'Hourly, daily & monthly plans',
        'Unlimited kilometers options',
        'Comprehensive insurance included',
        'Well-maintained & sanitized cars'
      ],
      badge: 'Flexible Plans'
    },
    {
      icon: <Users className="size-12 text-gold" />,
      title: 'Private Chauffeur Service',
      description: 'Sit back and relax with our premium chauffeur-driven car service. Professional drivers, luxury vehicles, and complete peace of mind.',
      features: [
        'Verified & trained chauffeurs',
        'Luxury & executive vehicles',
        'Airport transfers & outstation trips',
        '24/7 availability',
        'Corporate packages available'
      ],
      badge: 'Premium'
    }
  ];

  const benefits = [
    { icon: <Shield />, title: 'Fully Insured', desc: 'All vehicles covered with comprehensive insurance' },
    { icon: <Clock />, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
    { icon: <Star />, title: 'Quality Fleet', desc: 'Well-maintained & regularly serviced cars' },
    { icon: <CheckCircle />, title: 'Easy Booking', desc: 'Simple online reservation in minutes' },
  ];

  const whyChooseUs = [
    'No hidden costs - transparent pricing',
    'Latest models from top brands',
    'Instant booking confirmation',
    'Flexible cancellation policy',
    'Pan-India service availability',
    'Sanitized & eco-friendly vehicles'
  ];

  return (
    <div className="min-h-screen bg-bg-main text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bg-main via-bg-elevated to-bg-main border-b border-gold/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative px-6 lg:px-16 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <span className="text-gold font-semibold text-sm">🚗 Premium Car Rental Services</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Drive Your Way, Every Day
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              From flexible self-drive rentals to luxury chauffeur services, we've got your every journey covered.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg shadow-gold/30 hover:scale-105"
            >
              <Calendar className="size-5" />
              Book Your Ride Now
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Our Services</h2>
            <p className="text-gray-300 text-lg">Choose the perfect rental solution for your needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-bg-elevated to-bg-main border border-gold/20 rounded-2xl p-8 hover:border-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-2"
              >
                {/* Badge */}
                {service.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gold/20 border border-gold/40 rounded-full">
                    <span className="text-gold text-xs font-semibold">{service.badge}</span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6 p-4 bg-gold/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle className="size-5 text-gold shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-semibold transition-colors group-hover:gap-4"
                >
                  Learn More
                  <span className="transition-transform">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 lg:px-16 py-20 bg-gradient-to-br from-bg-elevated to-bg-main border-y border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Why Choose Rental Drive?</h2>
            <p className="text-gray-300 text-lg">Experience the difference with our premium services</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-bg-main border border-gold/20 rounded-xl hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
              >
                <div className="inline-flex items-center justify-center size-16 bg-gold/10 rounded-full mb-4 text-gold">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">{benefit.title}</h4>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChooseUs.map((point, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-bg-main border border-gold/20 rounded-lg hover:border-gold/40 transition-colors"
              >
                <Sparkles className="size-5 text-gold shrink-0" />
                <span className="text-gray-300">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">How It Works</h2>
            <p className="text-gray-300 text-lg">Get on the road in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Car',
                desc: 'Browse our wide selection of vehicles and pick the perfect one for your journey.',
                icon: <Car className="size-8" />
              },
              {
                step: '02',
                title: 'Book Online',
                desc: 'Complete your reservation in minutes with our easy online booking system.',
                icon: <Calendar className="size-8" />
              },
              {
                step: '03',
                title: 'Hit the Road',
                desc: 'Pick up your car or opt for doorstep delivery and start your adventure!',
                icon: <MapPin className="size-8" />
              }
            ].map((step, idx) => (
              <div key={idx} className="relative text-center">
                {/* Connector Line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-gold/50 to-gold/20"></div>
                )}

                {/* Step Circle */}
                <div className="relative inline-flex items-center justify-center size-32 bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold rounded-full mb-6 text-gold">
                  <div className="absolute -top-3 -right-3 size-12 bg-gold rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-gold/30">
                    {step.step}
                  </div>
                  {step.icon}
                </div>

                <h4 className="text-2xl font-bold mb-3 text-white">{step.title}</h4>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-16 py-20 bg-gradient-to-br from-gold/10 via-bg-elevated to-bg-main border-t border-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of happy customers who trust Rental Drive for their travel needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg shadow-gold/30 hover:scale-105"
            >
              <Car className="size-5" />
              Book Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-gold hover:bg-gold/10 text-gold px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300"
            >
              <Phone className="size-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
