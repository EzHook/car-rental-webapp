'use client';

import { Suspense, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Shield, Loader2, MapPin } from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Car {
  id: number;
  name: string;
  type: string;
  image_url: string;
  fuel_capacity: string;
  transmission: string;
  capacity: number;
  price: number;
  original_price: number | null;
  description: string;
  is_available: boolean;
}

function PaymentContent() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id as string;
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  
  // Form states
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });
  
  const [rentalInfo, setRentalInfo] = useState({
    pickupLocation: '',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '',
    dropoffLocation: '',
    dropoffDate: '',
    dropoffTime: '',
  });
  
  const [agreements, setAgreements] = useState({
    marketing: false,
    terms: false,
  });

  useEffect(() => {
    loadUserData();
    fetchCarData();
  }, [carId]);

  const fetchCarData = async () => {
    try {
      const response = await fetch(`/api/cars/${carId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car details');
      }
      const data = await response.json();
      setCar(data.car);
    } catch (error) {
      console.error('Error fetching car:', error);
      alert('Failed to load car details');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          if (response.ok) {
            const data = await response.json();
            const city = data.address.city || 
                        data.address.town || 
                        data.address.village || 
                        data.address.state || 
                        'Unknown Location';
            
            setRentalInfo({
              ...rentalInfo,
              pickupLocation: city,
            });
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          alert('Failed to detect your location. Please select manually.');
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setDetectingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Location access denied. Please enable location permissions in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out.');
            break;
          default:
            alert('An error occurred while detecting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <Loader2 className="size-12 animate-spin text-gold" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Car not found</h1>
          <button onClick={() => router.push('/')} className="text-gold hover:text-gold-light hover:underline transition-colors">
            Go back to home
          </button>
        </div>
      </div>
    );
  }

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

    const pickupDate = new Date(rentalInfo.pickupDate);
    const dropoffDate = new Date(rentalInfo.dropoffDate);
    
    if (dropoffDate <= pickupDate) {
      alert('Drop-off date must be after pick-up date');
      return;
    }

    setIsProcessing(true);

    try {
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
          color: '#DAA520',
        },
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: {
                  carId: car.id.toString(),
                  carName: car.name,
                  carNumber: 'TBD',
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
              router.push('/bookings');
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
      
      <div className="min-h-screen bg-bg-main px-6 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Info */}
            <div className="bg-bg-card border border-bg-elevated rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Billing Info</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Please enter your billing info</p>
                </div>
                <span className="text-xs text-gold">Step 1 of 3</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={billingInfo.name}
                    onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Town / City</label>
                  <input
                    type="text"
                    placeholder="Town or city"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Rental Info */}
            <div className="bg-bg-card border border-bg-elevated rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Rental Info</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Please select your rental date</p>
                </div>
                <span className="text-xs text-gold">Step 2 of 3</span>
              </div>

              {/* Pick-Up */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="radio"
                    id="pickup"
                    checked
                    readOnly
                    className="size-4 text-gold accent-gold"
                  />
                  <label htmlFor="pickup" className="text-sm font-bold text-white">Pick - Up</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Locations</label>
                    <div className="flex gap-2">
                      <select
                        value={rentalInfo.pickupLocation}
                        onChange={(e) => setRentalInfo({ ...rentalInfo, pickupLocation: e.target.value })}
                        className="flex-1 px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
                      >
                        <option value="" className="bg-bg-elevated">Select your city</option>
                        <option value="Mumbai" className="bg-bg-elevated">Mumbai</option>
                        <option value="Delhi" className="bg-bg-elevated">Delhi</option>
                        <option value="Bangalore" className="bg-bg-elevated">Bangalore</option>
                        <option value="Goa" className="bg-bg-elevated">Goa</option>
                        <option value="Pune" className="bg-bg-elevated">Pune</option>
                        <option value="Hyderabad" className="bg-bg-elevated">Hyderabad</option>
                      </select>
                      <button
                        onClick={getCurrentLocation}
                        disabled={detectingLocation}
                        className="px-3 py-2.5 bg-gold text-black rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Use current location"
                      >
                        {detectingLocation ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <MapPin className="size-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Click pin icon to detect your location</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={rentalInfo.pickupDate}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, pickupDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white scheme-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Time</label>
                    <select
                      value={rentalInfo.pickupTime}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, pickupTime: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
                    >
                      <option value="" className="bg-bg-elevated">Select your time</option>
                      <option value="09:00" className="bg-bg-elevated">09:00 AM</option>
                      <option value="10:00" className="bg-bg-elevated">10:00 AM</option>
                      <option value="11:00" className="bg-bg-elevated">11:00 AM</option>
                      <option value="12:00" className="bg-bg-elevated">12:00 PM</option>
                      <option value="13:00" className="bg-bg-elevated">01:00 PM</option>
                      <option value="14:00" className="bg-bg-elevated">02:00 PM</option>
                      <option value="15:00" className="bg-bg-elevated">03:00 PM</option>
                      <option value="16:00" className="bg-bg-elevated">04:00 PM</option>
                      <option value="17:00" className="bg-bg-elevated">05:00 PM</option>
                      <option value="18:00" className="bg-bg-elevated">06:00 PM</option>
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
                    className="size-4 text-gold accent-gold"
                  />
                  <label htmlFor="dropoff" className="text-sm font-bold text-white">Drop - Off</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Locations</label>
                    <select
                      value={rentalInfo.dropoffLocation}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, dropoffLocation: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
                    >
                      <option value="" className="bg-bg-elevated">Select your city</option>
                      <option value="Mumbai" className="bg-bg-elevated">Mumbai</option>
                      <option value="Delhi" className="bg-bg-elevated">Delhi</option>
                      <option value="Bangalore" className="bg-bg-elevated">Bangalore</option>
                      <option value="Goa" className="bg-bg-elevated">Goa</option>
                      <option value="Pune" className="bg-bg-elevated">Pune</option>
                      <option value="Hyderabad" className="bg-bg-elevated">Hyderabad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={rentalInfo.dropoffDate}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, dropoffDate: e.target.value })}
                      min={rentalInfo.pickupDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white scheme-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Time</label>
                    <select
                      value={rentalInfo.dropoffTime}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, dropoffTime: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
                    >
                      <option value="" className="bg-bg-elevated">Select your time</option>
                      <option value="09:00" className="bg-bg-elevated">09:00 AM</option>
                      <option value="10:00" className="bg-bg-elevated">10:00 AM</option>
                      <option value="11:00" className="bg-bg-elevated">11:00 AM</option>
                      <option value="12:00" className="bg-bg-elevated">12:00 PM</option>
                      <option value="13:00" className="bg-bg-elevated">01:00 PM</option>
                      <option value="14:00" className="bg-bg-elevated">02:00 PM</option>
                      <option value="15:00" className="bg-bg-elevated">03:00 PM</option>
                      <option value="16:00" className="bg-bg-elevated">04:00 PM</option>
                      <option value="17:00" className="bg-bg-elevated">05:00 PM</option>
                      <option value="18:00" className="bg-bg-elevated">06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="bg-bg-card border border-bg-elevated rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Confirmation</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    We are getting to the end. Just few clicks and your rental is ready!
                  </p>
                </div>
                <span className="text-xs text-gold">Step 3 of 3</span>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={(e) => setAgreements({ ...agreements, marketing: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-2 border-bg-elevated text-gold focus:ring-2 focus:ring-gold accent-gold"
                  />
                  <span className="text-xs text-gray-300">
                    I agree with sending Marketing and newsletter emails. No spam, promised!
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={(e) => setAgreements({ ...agreements, terms: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-2 border-bg-elevated text-gold focus:ring-2 focus:ring-gold accent-gold"
                  />
                  <span className="text-xs text-gray-300">
                    I agree with our terms and conditions and privacy policy.
                  </span>
                </label>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full md:w-auto bg-gold hover:bg-gold-light text-black px-8 py-2.5 text-sm rounded-lg font-bold transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold/30"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay with Razorpay'
                )}
              </button>

              <div className="flex items-start gap-3 mt-6 p-4 bg-bg-elevated rounded-lg border border-bg-elevated">
                <Shield className="size-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">All your data are safe</h3>
                  <p className="text-xs text-gray-400">
                    We are using Razorpay's secure payment gateway to ensure your data is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Rental Summary */}
          <div className="lg:col-span-1">
            <div className="bg-bg-card border border-bg-elevated rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-1">Rental Summary</h2>
              <p className="text-xs text-gray-400 mb-6">
                Prices may change depending on the length of the rental and the price of your rental car.
              </p>

              {/* Car Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-28 h-20 bg-linear-to-br from-bg-elevated to-bg-secondary rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={car.image_url}
                    alt={car.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{car.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="size-3 fill-gold text-gold" />
                    ))}
                    <Star className="size-3 fill-gray-600 text-gray-600" />
                    <span className="text-xs text-gray-400 ml-1">440+ Reviewer</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-bg-elevated pt-6">
                {/* Daily Rate */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Daily Rate</span>
                  <span className="text-sm text-white font-semibold">₹{dailyRate.toFixed(2)}</span>
                </div>

                {/* Rental Duration */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Rental Duration</span>
                  <span className="text-sm text-white font-semibold">
                    {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Subtotal</span>
                  <span className="text-sm text-white font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-400">Tax</span>
                  <span className="text-sm text-white font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Apply promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2.5 text-xs text-white font-semibold hover:bg-bg-elevated rounded-lg transition-colors"
                    >
                      Apply now
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-green-400 mt-2">Discount applied: -₹{discount.toFixed(2)}</p>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-6 border-t border-bg-elevated">
                  <div>
                    <p className="text-base font-bold text-white">Total Rental Price</p>
                    <p className="text-xs text-gray-400 mt-0.5">Overall price including discount</p>
                  </div>
                  <span className="text-2xl font-bold text-gold">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
