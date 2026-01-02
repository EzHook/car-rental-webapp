'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Car, 
  Loader2, 
  Package,
  Receipt,
  CreditCard
} from 'lucide-react';

interface Booking {
  id: number;
  carId: string;
  carName: string;
  carNumber: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  rentalDays: number;
  dailyRate: number;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentId: string;
  orderId: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine booking status based on dates and payment
  const getBookingStatus = (booking: Booking) => {
    const today = new Date();
    const dropoffDate = new Date(booking.dropoffDate);
    const pickupDate = new Date(booking.pickupDate);
    
    if (booking.paymentStatus === 'pending') return 'pending';
    if (dropoffDate < today) return 'completed';
    if (pickupDate > today) return 'upcoming';
    return 'active';
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    const status = getBookingStatus(booking);
    if (filter === 'completed') return status === 'completed';
    if (filter === 'pending') return booking.paymentStatus === 'pending';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-900/30 text-blue-400 border border-blue-700';
      case 'active':
        return 'bg-green-900/30 text-green-400 border border-green-700';
      case 'completed':
        return 'bg-gray-700/30 text-gray-300 border border-gray-600';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700';
      default:
        return 'bg-gray-700/30 text-gray-300 border border-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-gray-400">View and manage your car rental bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
              filter === 'all'
                ? 'bg-gold text-black shadow-lg shadow-gold/30'
                : 'bg-bg-card text-gray-300 hover:bg-bg-elevated border border-bg-elevated'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
              filter === 'completed'
                ? 'bg-gold text-black shadow-lg shadow-gold/30'
                : 'bg-bg-card text-gray-300 hover:bg-bg-elevated border border-bg-elevated'
            }`}
          >
            Completed ({bookings.filter(b => getBookingStatus(b) === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-gold text-black shadow-lg shadow-gold/30'
                : 'bg-bg-card text-gray-300 hover:bg-bg-elevated border border-bg-elevated'
            }`}
          >
            Pending ({bookings.filter(b => b.paymentStatus === 'pending').length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-bg-card border border-bg-elevated rounded-lg shadow-lg p-12 text-center">
            <Package className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No bookings found
            </h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet."
                : `You don't have any ${filter} bookings.`}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gold text-black rounded-lg font-bold hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/30"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const status = getBookingStatus(booking);
              return (
                <div
                  key={booking.id}
                  className="bg-bg-card border border-bg-elevated rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Header with car name and status */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {booking.carName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Car Number: {booking.carNumber}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          status
                        )}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    {/* Pickup and Dropoff Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Pickup */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-700">
                          <MapPin className="size-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pick-up</p>
                          <p className="font-medium text-white">
                            {booking.pickupLocation}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <Calendar className="size-3" />
                            <span>{formatDate(booking.pickupDate)}</span>
                            <Clock className="size-3 ml-1" />
                            <span>{booking.pickupTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Dropoff */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-900/30 rounded-lg border border-green-700">
                          <MapPin className="size-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Drop-off</p>
                          <p className="font-medium text-white">
                            {booking.dropoffLocation}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <Calendar className="size-3" />
                            <span>{formatDate(booking.dropoffDate)}</span>
                            <Clock className="size-3 ml-1" />
                            <span>{booking.dropoffTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="bg-bg-elevated rounded-lg p-4 mb-4 border border-bg-elevated">
                      <div className="flex items-center gap-2 mb-3">
                        <Receipt className="size-4 text-gold" />
                        <h4 className="font-semibold text-white">Pricing Details</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Daily Rate × {booking.rentalDays} days
                          </span>
                          <span className="font-medium text-white">₹{Number(booking.subtotal).toLocaleString()}</span>
                        </div>
                        {booking.discount > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span>Discount</span>
                            <span>-₹{Number(booking.discount).toLocaleString()}</span>
                          </div>
                        )}
                        {booking.tax > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tax</span>
                            <span className="font-medium text-white">₹{Number(booking.tax).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-bg-elevated">
                          <span className="font-semibold text-white">Total Amount</span>
                          <span className="text-xl font-bold text-gold">
                            ₹{Number(booking.totalAmount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info & Booking Details */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-bg-elevated text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <CreditCard className="size-3" />
                          <span className="capitalize">{booking.paymentMethod}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.paymentStatus === 'completed' 
                            ? 'bg-green-900/30 text-green-400 border border-green-700'
                            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                        }`}>
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span>Booking ID: <span className="font-mono text-gold">#{booking.id}</span></span>
                        <span>Booked on {formatDate(booking.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
