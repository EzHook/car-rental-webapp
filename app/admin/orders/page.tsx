'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Search, Filter, Calendar, DollarSign, Loader2, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

interface Order {
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
  car_name: string;
  car_license_plate: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
      confirmed: 'bg-blue-900/30 text-blue-400 border-blue-700',
      ongoing: 'bg-purple-900/30 text-purple-400 border-purple-700',
      completed: 'bg-green-900/30 text-green-400 border-green-700',
      cancelled: 'bg-red-900/30 text-red-400 border-red-700',
    };
    return (
      <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const icons = {
      paid: <CheckCircle className="size-3 sm:size-4" />,
      pending: <Clock className="size-3 sm:size-4" />,
      failed: <XCircle className="size-3 sm:size-4" />,
    };
    const styles = {
      paid: 'bg-green-900/30 text-green-400 border-green-700',
      pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
      failed: 'bg-red-900/30 text-red-400 border-red-700',
    };
    return (
      <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border inline-flex items-center gap-1.5 ${styles[paymentStatus as keyof typeof styles] || styles.pending}`}>
        {icons[paymentStatus as keyof typeof icons]}
        <span className="hidden sm:inline">{paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}</span>
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.car_license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.razorpay_order_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.total_price.toString()), 0);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center h-64">
        <Loader2 className="size-12 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-2">Orders Management</h1>
        <p className="text-sm sm:text-base text-gray-400">View and manage all rental orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-400">Total Orders</p>
            <Calendar className="size-4 sm:size-5 text-gold" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{orders.length}</p>
        </div>

        <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-400">Paid Orders</p>
            <CheckCircle className="size-4 sm:size-5 text-green-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {orders.filter(o => o.payment_status === 'paid').length}
          </p>
        </div>

        <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-400">Pending</p>
            <Clock className="size-4 sm:size-5 text-yellow-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {orders.filter(o => o.payment_status === 'pending').length}
          </p>
        </div>

        <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-400">Revenue</p>
            <DollarSign className="size-4 sm:size-5 text-green-400" />
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold">₹{totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gold" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm"
          >
            <option value="all" className="bg-bg-elevated">All Status</option>
            <option value="pending" className="bg-bg-elevated">Pending</option>
            <option value="confirmed" className="bg-bg-elevated">Confirmed</option>
            <option value="ongoing" className="bg-bg-elevated">Ongoing</option>
            <option value="completed" className="bg-bg-elevated">Completed</option>
            <option value="cancelled" className="bg-bg-elevated">Cancelled</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm"
          >
            <option value="all" className="bg-bg-elevated">All Payments</option>
            <option value="paid" className="bg-bg-elevated">Paid</option>
            <option value="pending" className="bg-bg-elevated">Pending</option>
            <option value="failed" className="bg-bg-elevated">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden lg:block bg-bg-card border border-bg-elevated rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-elevated border-b border-bg-elevated">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-elevated">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-bg-elevated transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-white">#{order.id}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{order.user_name}</p>
                    <p className="text-xs text-gray-400">{order.user_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{order.car_name}</p>
                    <p className="text-xs text-gray-400">{order.car_license_plate}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-300">
                      {new Date(order.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-sm text-gray-300">
                      {new Date(order.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-gold">₹{parseFloat(order.total_price.toString()).toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentBadge(order.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold text-black text-sm font-bold rounded-lg hover:bg-gold-light transition-all duration-300 shadow-md shadow-gold/30"
                    >
                      <Eye className="size-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="size-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Orders Cards - Mobile & Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-bg-card border border-bg-elevated rounded-xl p-8 text-center">
            <Package className="size-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-white">Order #{order.id}</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.payment_status)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Customer</p>
                  <p className="text-sm font-medium text-white">{order.user_name}</p>
                  <p className="text-xs text-gray-400">{order.user_email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Car</p>
                  <p className="text-sm font-medium text-white">{order.car_name}</p>
                  <p className="text-xs text-gray-400">{order.car_license_plate}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-bg-elevated">
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm text-gray-300">
                      {new Date(order.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(order.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="text-lg font-bold text-gold">₹{parseFloat(order.total_price.toString()).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-black text-sm font-bold rounded-lg hover:bg-gold-light transition-all duration-300 shadow-md shadow-gold/30"
              >
                <Eye className="size-4" />
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
