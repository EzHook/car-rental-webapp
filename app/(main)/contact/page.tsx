'use client';

import { Mail, Phone, MapPin, Clock, Send, Shield, Star, Car, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: <MapPin className="size-6" />,
      title: 'Our Offices',
      details: [
        'Mumbai HQ: Bandra Kurla Complex',
        'Delhi: Connaught Place',
        'Bangalore: MG Road',
        'Pune: Koregaon Park'
      ]
    },
    {
      icon: <Phone className="size-6" />,
      title: 'Contact Numbers',
      details: [
        '+91 98765 43210 (24/7)',
        '+91 98765 43211 (Sales)',
        '+91 98765 43212 (Support)'
      ]
    },
    {
      icon: <Mail className="size-6" />,
      title: 'Email Us',
      details: [
        'hello@rentaldrive.in',
        'support@rentaldrive.in',
        'bookings@rentaldrive.in'
      ]
    },
    {
      icon: <Clock className="size-6" />,
      title: 'Working Hours',
      details: [
        'Monday - Sunday: 24/7',
        'Emergencies: Always Available',
        'Response Time: Under 2 Hours'
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, send to your backend:
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-bg-main via-bg-elevated to-bg-main border-b border-gold/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative px-6 lg:px-16 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <span className="text-gold font-semibold text-sm">📞 Get In Touch</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Let's Talk About Your Next Journey
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Have questions? Need help with bookings? Our team is ready to assist you 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Contact Information</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Reach out to us anytime. Whether you need booking assistance, vehicle information, 
              or have special requirements, our dedicated team is here to help.
            </p>

            {/* Contact Details */}
            <div className="space-y-8 mt-12">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="group p-8 bg-linear-to-br from-bg-elevated to-bg-main border border-gold/20 rounded-2xl hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10 transition-all duration-300">
                  <div className="inline-flex items-center gap-4 mb-6 p-4 bg-gold/10 rounded-xl w-fit">
                    <div className="size-12 bg-gold/20 rounded-lg flex items-center justify-center">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{info.title}</h4>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {info.details.map((detail, dIdx) => (
                      <p key={dIdx} className="text-gray-300 hover:text-gold transition-colors group-hover:translate-x-2">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-linear-to-br from-bg-elevated to-bg-main border border-gold/20 rounded-2xl p-8 lg:p-12 hover:border-gold/50 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 text-gold">Send Us a Message</h3>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-6 bg-green-500/20 border border-green-500/50 rounded-xl text-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="size-6 shrink-0" />
                    <h4 className="text-lg font-bold">Thank you for your message!</h4>
                  </div>
                  <p>Our team will get back to you within 2 hours. Have a great day!</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-6 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100">
                  <p>Something went wrong. Please try again or contact us directly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-bg-main border border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-bg-main border border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-main border border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Service Interested In *</label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-main border border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white"
                  >
                    <option value="">Select a service</option>
                    <option value="self-drive">Self-Drive Rental</option>
                    <option value="pickup-drop">Pick-up & Drop-off</option>
                    <option value="chauffeur">Private Chauffeur</option>
                    <option value="corporate">Corporate Packages</option>
                    <option value="outstation">Outstation Trips</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-main border border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 resize-vertical transition-all duration-300"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-light text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-gold/30 hover:scale-105 hover:shadow-gold/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-6 lg:px-16 py-20 bg-linear-to-br from-bg-elevated to-bg-main border-t border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gold">Need Help Immediately?</h2>
            <p className="text-gray-300 text-lg">Connect with us through these popular channels</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: <Car />, label: 'Book a Car', href: '/login' },
              { icon: <Users />, label: 'Corporate', href: '/services' },
              { icon: <Award />, label: 'Reviews', href: '/about' },
              { icon: <Shield />, label: 'Safety', href: '/services' }
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group flex flex-col items-center p-6 bg-bg-main border border-gold/20 rounded-xl hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 text-center"
              >
                <div className="size-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  {item.icon}
                </div>
                <span className="font-semibold text-white group-hover:text-gold transition-colors">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="px-6 lg:px-16 py-16 border-t border-gold/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              '10,000+ Happy Customers',
              '500+ Vehicles',
              '50+ Cities',
              '24/7 Support'
            ].map((stat, idx) => (
              <div key={idx} className="p-4">
                <p className="text-lg font-bold text-gold">{stat}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
            <span>© 2026 Rental Drive. All rights reserved.</span>
            <span>•</span>
            <span>Secure Payments</span>
            <span>•</span>
            <span>COVID Safe</span>
          </div>
        </div>
      </section>
    </div>
  );
}
