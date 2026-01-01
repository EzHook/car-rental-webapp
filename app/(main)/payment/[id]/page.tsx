'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Shield } from 'lucide-react';
import { cars } from '@/utils/db';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id as string;
  
  const car = cars.find((c) => c.id === carId);
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });
  
  const [rentalInfo, setRentalInfo] = useState({
    pickupLocation: '',
    pickupDate: '',
    pickupTime: '',
    dropoffLocation: '',
    dropoffDate: '',
    dropoffTime: '',
  });
  
  const [agreements, setAgreements] = useState({
    marketing: false,
    terms: false,
  });

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setBillingInfo({
          ...billingInfo,
          name: data.user.fullName || '',
          phone: data.user.phone || '',
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h1>
          <button onClick={() => router.push('/')} className="text-primary-blue hover:underline">
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  // Calculate rental days dynamically
  const calculateRentalDays = () => {
    if (!rentalInfo.pickupDate || !rentalInfo.dropoffDate) return 1;
    
    const pickupDate = new Date(rentalInfo.pickupDate);
    const dropoffDate = new Date(rentalInfo.dropoffDate);
    const days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days : 1;
  };

  const rentalDays = calculateRentalDays();
  const dailyRate = car.price;
  const subtotal = dailyRate * rentalDays;
  const tax = 0;
  const total = subtotal + tax - discount;

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1);
    } else {
      alert('Invalid promo code');
    }
  };

  const handlePayment = async () => {
    // Validation
    if (!agreements.terms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (!billingInfo.name || !billingInfo.phone || !billingInfo.address || !billingInfo.city) {
      alert('Please fill in all billing information');
      return;
    }

    if (!rentalInfo.pickupLocation || !rentalInfo.pickupDate || !rentalInfo.pickupTime ||
        !rentalInfo.dropoffLocation || !rentalInfo.dropoffDate || !rentalInfo.dropoffTime) {
      alert('Please fill in all rental information');
      return;
    }

    // Validate dates
    const pickupDate = new Date(rentalInfo.pickupDate);
    const dropoffDate = new Date(rentalInfo.dropoffDate);
    
    if (dropoffDate <= pickupDate) {
      alert('Drop-off date must be after pick-up date');
      return;
    }

    setIsProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MORENT',
        description: `Car Rental - ${car.name} (${rentalDays} ${rentalDays === 1 ? 'day' : 'days'})`,
        order_id: orderData.orderId,
        prefill: {
          name: billingInfo.name,
          contact: billingInfo.phone,
        },
        theme: {
          color: '#3563E9',
        },
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: {
                  carId: car.id,
                  carName: car.name,
                  carNumber: car.licensePlate || 'TBD',
                  pickupLocation: rentalInfo.pickupLocation,
                  pickupDate: rentalInfo.pickupDate,
                  pickupTime: rentalInfo.pickupTime,
                  dropoffLocation: rentalInfo.dropoffLocation,
                  dropoffDate: rentalInfo.dropoffDate,
                  dropoffTime: rentalInfo.dropoffTime,
                  dailyRate: dailyRate,
                  discount: discount,
                  tax: tax,
                },
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              alert(`Payment successful! Your booking is confirmed for ${rentalDays} ${rentalDays === 1 ? 'day' : 'days'}.\n\nBooking ID: ${verifyData.booking.id}`);
              router.push('/');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            alert('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <div className="px-6 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Info */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Billing Info</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Please enter your billing info</p>
                </div>
                <span className="text-xs text-gray-500">Step 1 of 3</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={billingInfo.name}
                    onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">Town / City</label>
                  <input
                    type="text"
                    placeholder="Town or city"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Rental Info */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Rental Info</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Please select your rental date</p>
                </div>
                <span className="text-xs text-gray-500">Step 2 of 3</span>
              </div>

              {/* Pick-Up */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="radio"
                    id="pickup"
                    checked
                    readOnly
                    className="size-4 text-primary-blue accent-primary-blue"
                  />
                  <label htmlFor="pickup" className="text-sm font-bold text-gray-900">Pick - Up</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Locations</label>
                    <select
                      value={rentalInfo.pickupLocation}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, pickupLocation: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-600"
                    >
                      <option value="">Select your city</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Goa">Goa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Date</label>
                    <input
                      type="date"
                      value={rentalInfo.pickupDate}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, pickupDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Time</label>
                    <select
                      value={rentalInfo.pickupTime}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, pickupTime: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-600"
                    >
                      <option value="">Select your time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Drop-Off */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="radio"
                    id="dropoff"
                    checked
                    readOnly
                    className="size-4 text-primary-blue accent-primary-blue"
                  />
                  <label htmlFor="dropoff" className="text-sm font-bold text-gray-900">Drop - Off</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Locations</label>
                    <select
                      value={rentalInfo.dropoffLocation}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, dropoffLocation: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-600"
                    >
                      <option value="">Select your city</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Goa">Goa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Date</label>
                    <input
                      type="date"
                      value={rentalInfo.dropoffDate}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, dropoffDate: e.target.value })}
                      min={rentalInfo.pickupDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Time</label>
                    <select
                      value={rentalInfo.dropoffTime}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, dropoffTime: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-600"
                    >
                      <option value="">Select your time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Confirmation</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    We are getting to the end. Just few clicks and your rental is ready!
                  </p>
                </div>
                <span className="text-xs text-gray-500">Step 3 of 3</span>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={(e) => setAgreements({ ...agreements, marketing: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-2 border-gray-300 text-primary-blue focus:ring-2 focus:ring-primary-blue accent-primary-blue"
                  />
                  <span className="text-xs text-gray-600">
                    I agree with sending Marketing and newsletter emails. No spam, promised!
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={(e) => setAgreements({ ...agreements, terms: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-2 border-gray-300 text-primary-blue focus:ring-2 focus:ring-primary-blue accent-primary-blue"
                  />
                  <span className="text-xs text-gray-600">
                    I agree with our terms and conditions and privacy policy.
                  </span>
                </label>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full md:w-auto bg-primary-blue hover:bg-[#264ac6] text-white px-8 py-2.5 text-sm rounded-lg font-semibold transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin size-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Pay with Razorpay'
                )}
              </button>

              <div className="flex items-start gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
                <Shield className="size-5 text-gray-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">All your data are safe</h3>
                  <p className="text-xs text-gray-600">
                    We are using Razorpay's secure payment gateway to ensure your data is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Rental Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Rental Summary</h2>
              <p className="text-xs text-gray-500 mb-6">
                Prices may change depending on the length of the rental and the price of your rental car.
              </p>

              {/* Car Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-28 h-20 bg-linear-to-br from-[#54a6ff] to-[#1e3a8a] rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="size-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="size-3 fill-gray-300 text-gray-300" />
                    <span className="text-xs text-gray-600 ml-1">440+ Reviewer</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {/* Daily Rate */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Daily Rate</span>
                  <span className="text-sm text-gray-900 font-semibold">₹{dailyRate.toFixed(2)}</span>
                </div>

                {/* Rental Duration */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Rental Duration</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm text-gray-900 font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm text-gray-900 font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Apply promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2.5 text-xs text-gray-900 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Apply now
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-green-600 mt-2">Discount applied: -₹{discount.toFixed(2)}</p>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-base font-bold text-gray-900">Total Rental Price</p>
                    <p className="text-xs text-gray-500 mt-0.5">Overall price including discount</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
