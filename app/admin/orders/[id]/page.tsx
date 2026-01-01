'use client';

import { useState, useEffect, JSX } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, User, Car, Calendar, DollarSign, CreditCard, 
  MapPin, Phone, Mail, Clock, CheckCircle, XCircle, 
  Loader2, Building2, Smartphone, Wallet, Tag, Receipt 
} from 'lucide-react';

interface OrderDetail {
  id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  payment_status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  created_at: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  car_name: string;
  car_type: string;
  car_license_plate: string;
  car_image_url: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_time: string;
  dropoff_time: string;
  rental_days: number;
  daily_rate: number;
  subtotal: number;
  discount: number;
  tax: number;
  payment_details: {
    method: string;
    card_id: string | null;
    bank: string | null;
    wallet: string | null;
    vpa: string | null;
    email: string;
    contact: string;
    amount: number;
    currency: string;
    status: string;
    created_at: number;
  } | null;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        alert('Booking not found');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!confirm(`Update booking status to ${newStatus}?`)) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('Booking status updated successfully!');
        fetchOrderDetail();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, JSX.Element> = {
      card: <CreditCard className="size-5" />,
      upi: <Smartphone className="size-5" />,
      netbanking: <Building2 className="size-5" />,
      wallet: <Wallet className="size-5" />,
    };
    return icons[method] || <DollarSign className="size-5" />;
  };

  const getPaymentMethodName = (method: string, details: any) => {
    if (method === 'card') {
      return `Card Payment ${details.bank ? `- ${details.bank}` : ''}`;
    } else if (method === 'upi') {
      return `UPI ${details.vpa ? `(${details.vpa})` : ''}`;
    } else if (method === 'netbanking') {
      return `Net Banking ${details.bank ? `- ${details.bank}` : ''}`;
    } else if (method === 'wallet') {
      return `${details.wallet || 'Digital Wallet'}`;
    }
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center h-64">
        <Loader2 className="size-12 animate-spin text-primary-blue" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-center text-gray-500">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-5" />
          Back to Orders
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking #{order.id}</h1>
            <p className="text-gray-600">
              Created on {new Date(order.created_at).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          {/* Status Update Dropdown */}
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(e.target.value)}
            disabled={updating}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="size-5 text-primary-blue" />
              Payment Information
            </h2>
            
            <div className="space-y-4">
              {/* Payment Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Payment Status</span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  order.payment_status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : order.payment_status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>

              {/* Payment Method */}
              {order.payment_details && (
                <div className="p-4 bg-primary-blue/5 rounded-lg border border-primary-blue/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary-blue/10 rounded-lg text-primary-blue">
                      {getPaymentMethodIcon(order.payment_details.method)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Method</p>
                      <p className="text-base font-bold text-gray-900">
                        {getPaymentMethodName(order.payment_details.method, order.payment_details)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Amount Paid</p>
                      <p className="font-semibold text-gray-900">
                        ₹{(order.payment_details.amount / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Currency</p>
                      <p className="font-semibold text-gray-900">{order.payment_details.currency.toUpperCase()}</p>
                    </div>
                    {order.payment_details.card_id && (
                      <div className="col-span-2">
                        <p className="text-gray-600">Card ID</p>
                        <p className="font-mono text-sm text-gray-900">{order.payment_details.card_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Razorpay IDs */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Razorpay Order ID</p>
                  <p className="text-sm font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {order.razorpay_order_id}
                  </p>
                </div>
                {order.razorpay_payment_id && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Razorpay Payment ID</p>
                    <p className="text-sm font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                      {order.razorpay_payment_id}
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-gray-900">
                  <Receipt className="size-5 text-gray-400" />
                  <span className="font-semibold">Price Breakdown</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Daily Rate × {order.rental_days} {order.rental_days === 1 ? 'day' : 'days'}
                    </span>
                    <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="size-4" />
                        Discount
                      </span>
                      <span className="font-medium">-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax & Fees</span>
                    <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{order.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup & Dropoff Locations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-primary-blue" />
              Pickup & Drop-off Details
            </h2>
            
            <div className="space-y-4">
              {/* Pickup */}
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="size-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-green-700 mb-1">PICKUP</p>
                  <p className="text-base font-bold text-gray-900 mb-1">{order.pickup_location}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{new Date(order.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{order.pickup_time}</span>
                  </div>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <MapPin className="size-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-red-700 mb-1">DROP-OFF</p>
                  <p className="text-base font-bold text-gray-900 mb-1">{order.dropoff_location}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{new Date(order.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{order.dropoff_time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="size-5 text-primary-blue" />
              Customer Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="size-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-base font-semibold text-gray-900">{order.user_name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-base text-gray-900">{order.user_email}</p>
                </div>
              </div>
              
              {order.user_phone && (
                <div className="flex items-start gap-3">
                  <Phone className="size-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-base text-gray-900">{order.user_phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Car Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="size-5 text-primary-blue" />
              Car Details
            </h2>
            
            <img 
              src={order.car_image_url} 
              alt={order.car_name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Car Name</p>
                <p className="text-base font-bold text-gray-900">{order.car_name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <p className="text-base text-gray-900">{order.car_type}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">License Plate</p>
                <p className="text-base font-mono text-gray-900">{order.car_license_plate}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Daily Rate</p>
                <p className="text-base font-bold text-primary-blue">₹{order.daily_rate.toFixed(2)}/day</p>
              </div>
            </div>
          </div>

          {/* Rental Duration */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-primary-blue" />
              Rental Duration
            </h2>
            
            <div className="text-center p-6 bg-primary-blue/5 rounded-lg border border-primary-blue/20">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Duration</p>
              <p className="text-4xl font-bold text-primary-blue">{order.rental_days}</p>
              <p className="text-sm text-gray-600 mt-1">{order.rental_days === 1 ? 'Day' : 'Days'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
