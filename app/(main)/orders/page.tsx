'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Clock, CreditCard, Package, Loader2 } from 'lucide-react';
import { cars } from '@/utils/db';

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
}

export default function OrdersPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCarImage = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    return car?.image || '/cars/default-car.png';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-primary-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="size-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-primary-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#264ac6] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-6 lg:px-16 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage your car rental bookings</p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="size-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start exploring our collection of cars and make your first booking!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-primary-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#264ac6] transition-colors"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Car Image */}
                    <div className="relative w-full lg:w-48 h-32 bg-linear-to-br from-[#54a6ff] to-[#1e3a8a] rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={getCarImage(booking.carId)}
                        alt={booking.carName}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{booking.carName}</h3>
                          <p className="text-sm text-gray-500">Booking ID: #{booking.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.paymentStatus)} self-start`}>
                          {booking.paymentStatus.toUpperCase()}
                        </span>
                      </div>

                      {/* Rental Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="size-5 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Pick-up</p>
                            <p className="text-sm font-semibold text-gray-900">{booking.pickupLocation}</p>
                            <p className="text-xs text-gray-600">{formatDate(booking.pickupDate)} • {booking.pickupTime}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="size-5 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Drop-off</p>
                            <p className="text-sm font-semibold text-gray-900">{booking.dropoffLocation}</p>
                            <p className="text-xs text-gray-600">{formatDate(booking.dropoffDate)} • {booking.dropoffTime}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="size-5 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Rental Duration</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {booking.rentalDays} {booking.rentalDays === 1 ? 'day' : 'days'}
                            </p>
                            <p className="text-xs text-gray-600">₹{booking.dailyRate.toFixed(2)}/day</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CreditCard className="size-5 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                            <p className="text-lg font-bold text-primary-blue">₹{booking.totalAmount.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">Car: {booking.carNumber}</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="size-4" />
                          <span>Booked on {formatDate(booking.createdAt)}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors">
                            View Details
                          </button>
                          <button className="px-4 py-2 text-sm text-white bg-primary-blue hover:bg-[#264ac6] rounded-lg font-semibold transition-colors">
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
