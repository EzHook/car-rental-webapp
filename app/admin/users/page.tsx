'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Loader2, 
  Users as UsersIcon, 
  Phone, 
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';

interface User {
  id: number;
  phone: string;
  country_code: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  aadhar_number: string | null;
  pan_number: string | null;
  documents_verified: boolean;
  aadhar_card_url: string | null;
  pan_card_url: string | null;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.aadhar_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.pan_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVerification = 
      verificationFilter === 'all' || 
      (verificationFilter === 'verified' && user.documents_verified) ||
      (verificationFilter === 'unverified' && !user.documents_verified);
    
    return matchesSearch && matchesVerification;
  });

  const verifiedUsers = users.filter(u => u.documents_verified).length;
  const usersWithAadhar = users.filter(u => u.aadhar_card_url).length;
  const usersWithPan = users.filter(u => u.pan_card_url).length;

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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-2">Users Management</h1>
        <p className="text-sm sm:text-base text-gray-400">View and manage all registered users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-400">Total Users</p>
            <UsersIcon className="size-4 sm:size-5 text-gold" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{users.length}</p>
        </div>

        <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-400">Verified</p>
            <CheckCircle className="size-4 sm:size-5 text-green-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{verifiedUsers}</p>
        </div>

        <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-400">With Aadhar</p>
            <FileText className="size-4 sm:size-5 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{usersWithAadhar}</p>
        </div>

        <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 hover:border-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-400">With PAN</p>
            <FileText className="size-4 sm:size-5 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{usersWithPan}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gold" />
            <input
              type="text"
              placeholder="Search by name, phone, or document number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500 text-sm"
            />
          </div>

          {/* Verification Filter */}
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-gold" />
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value as any)}
              className="flex-1 px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm"
            >
              <option value="all" className="bg-bg-elevated">All Users</option>
              <option value="verified" className="bg-bg-elevated">Verified Only</option>
              <option value="unverified" className="bg-bg-elevated">Unverified Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden lg:block bg-bg-card border border-bg-elevated rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-elevated border-b border-bg-elevated">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-elevated">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-bg-elevated transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-white">#{user.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{user.full_name || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-white">{user.country_code} {user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.aadhar_card_url && (
                        <span className="px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-700 text-xs rounded-full">
                          Aadhar
                        </span>
                      )}
                      {user.pan_card_url && (
                        <span className="px-2 py-1 bg-purple-900/30 text-purple-400 border border-purple-700 text-xs rounded-full">
                          PAN
                        </span>
                      )}
                      {!user.aadhar_card_url && !user.pan_card_url && (
                        <span className="text-xs text-gray-500">No documents</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.documents_verified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-900/30 text-green-400 border border-green-700 text-xs font-semibold rounded-full">
                        <UserCheck className="size-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-700/30 text-gray-400 border border-gray-600 text-xs font-semibold rounded-full">
                        <UserX className="size-3" />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="size-4 text-gray-400" />
                      {new Date(user.created_at).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="size-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Users Cards - Mobile & Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-bg-card border border-bg-elevated rounded-xl p-8 text-center">
            <UsersIcon className="size-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-4 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-white">{user.full_name || 'N/A'}</p>
                  <p className="text-xs text-gray-400">ID: #{user.id}</p>
                </div>
                {user.documents_verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 border border-green-700 text-xs font-semibold rounded-full">
                    <UserCheck className="size-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/30 text-gray-400 border border-gray-600 text-xs font-semibold rounded-full">
                    <UserX className="size-3" />
                    Unverified
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-gray-400" />
                  <p className="text-sm text-gray-300">{user.country_code} {user.phone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-gray-400" />
                  <p className="text-sm text-gray-300">
                    Joined {new Date(user.created_at).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <FileText className="size-4 text-gray-400" />
                  {user.aadhar_card_url && (
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-700 text-xs rounded-full">
                      Aadhar
                    </span>
                  )}
                  {user.pan_card_url && (
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 border border-purple-700 text-xs rounded-full">
                      PAN
                    </span>
                  )}
                  {!user.aadhar_card_url && !user.pan_card_url && (
                    <span className="text-xs text-gray-500">No documents uploaded</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => router.push(`/admin/users/${user.id}`)}
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
