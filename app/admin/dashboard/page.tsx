'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  DollarSign, 
  Users, 
  Car,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeCars: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Package,
      color: 'blue',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      trend: '+18%',
      trendUp: true,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'purple',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Active Cars',
      value: stats.activeCars,
      icon: Car,
      color: 'orange',
      trend: '-2%',
      trendUp: false,
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-900/30 text-blue-400 border border-blue-700',
    green: 'bg-green-900/30 text-green-400 border border-green-700',
    purple: 'bg-purple-900/30 text-purple-400 border border-purple-700',
    orange: 'bg-orange-900/30 text-orange-400 border border-orange-700',
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-3/4 sm:w-1/2 lg:w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-bg-elevated rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-bg-elevated rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-2">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-gray-400">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
          
          return (
            <div
              key={stat.title}
              className="bg-bg-card border border-bg-elevated rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl hover:border-gold/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`size-11 sm:size-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="size-5 sm:size-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendIcon className="size-3 sm:size-4" />
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-gold transition-colors">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Bookings */}
        <div className="bg-bg-card border border-bg-elevated rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-white">Recent Bookings</h3>
            <Package className="size-5 text-gold" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-bg-elevated last:border-0 hover:bg-bg-elevated px-2 -mx-2 rounded transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm sm:text-base truncate">Booking #{1000 + i}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{i * 2} hours ago</p>
                </div>
                <span className="ml-2 px-2 sm:px-3 py-1 bg-green-900/30 text-green-400 border border-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                  Completed
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-gold hover:text-gold-light font-semibold transition-colors">
            View All Bookings →
          </button>
        </div>

        {/* Popular Cars */}
        <div className="bg-bg-card border border-bg-elevated rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-white">Popular Cars</h3>
            <Car className="size-5 text-gold" />
          </div>
          <div className="space-y-3">
            {['Koenigsegg', 'Nissan GT-R', 'Rolls-Royce'].map((car, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-bg-elevated last:border-0 hover:bg-bg-elevated px-2 -mx-2 rounded transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="size-10 sm:size-12 bg-linear-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-gold/30">
                    <Car className="size-5 sm:size-6 text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white text-sm sm:text-base truncate">{car}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{20 - i * 3} bookings</p>
                  </div>
                </div>
                <span className="ml-2 text-gold font-bold text-sm sm:text-base shrink-0">#{i + 1}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-gold hover:text-gold-light font-semibold transition-colors">
            View All Cars →
          </button>
        </div>
      </div>
    </div>
  );
}
