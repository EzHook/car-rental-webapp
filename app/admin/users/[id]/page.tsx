'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Loader2, 
  Phone, 
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  User,
  Shield,
  Download,
  ExternalLink,
  CreditCard,
  UserCheck,
  UserX
} from 'lucide-react';
import Link from 'next/link';

interface UserDetails {
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

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        alert('User not found');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async () => {
    if (!user) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents_verified: !user.documents_verified,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        alert(`User ${user.documents_verified ? 'unverified' : 'verified'} successfully!`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update verification status');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Failed to update verification status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center h-64">
        <Loader2 className="size-12 animate-spin text-gold" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <p className="text-gray-400">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm">Back to Users</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-2">
              User Details
            </h1>
            <p className="text-sm sm:text-base text-gray-400">View and manage user information</p>
          </div>
          <button
            onClick={toggleVerification}
            disabled={updating}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-lg ${
              user.documents_verified
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30'
                : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {updating ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Updating...
              </>
            ) : user.documents_verified ? (
              <>
                <XCircle className="size-5" />
                <span className="hidden sm:inline">Mark as Unverified</span>
                <span className="sm:hidden">Unverify</span>
              </>
            ) : (
              <>
                <CheckCircle className="size-5" />
                <span className="hidden sm:inline">Mark as Verified</span>
                <span className="sm:hidden">Verify</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-bg-elevated">
            <div className="size-16 sm:size-20 bg-gold/20 rounded-full flex items-center justify-center">
              <User className="size-8 sm:size-10 text-gold" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {user.full_name || 'N/A'}
              </h2>
              <p className="text-sm text-gray-400">User ID: #{user.id}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6 pb-6 border-b border-bg-elevated">
            <h3 className="text-lg font-bold text-gold flex items-center gap-2">
              <Phone className="size-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                <p className="text-base font-medium text-white">
                  {user.country_code} {user.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gold flex items-center gap-2">
              <FileText className="size-5" />
              Document Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Aadhar Number</p>
                <p className="text-base font-medium text-white">
                  {user.aadhar_number || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">PAN Number</p>
                <p className="text-base font-medium text-white">
                  {user.pan_number || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status Card */}
          <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="size-5 text-gold" />
              Verification Status
            </h3>
            <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg">
              {user.documents_verified ? (
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-green-900/30 rounded-full flex items-center justify-center">
                    <UserCheck className="size-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Verified</p>
                    <p className="text-xs text-gray-400">Documents approved</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gray-700/30 rounded-full flex items-center justify-center">
                    <UserX className="size-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Unverified</p>
                    <p className="text-xs text-gray-400">Pending verification</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Info Card */}
          <div className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-gold" />
              Account Info
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Joined Date</p>
                <p className="text-sm font-medium text-white">
                  {new Date(user.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-white">
                  {new Date(user.updated_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="mt-6 bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
          <CreditCard className="size-5" />
          Uploaded Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aadhar Card */}
          <div className="bg-bg-elevated border border-bg-elevated rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-blue-400" />
                <h4 className="font-semibold text-white">Aadhar Card</h4>
              </div>
              {user.aadhar_card_url && (
                <span className="px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-700 text-xs rounded-full">
                  Uploaded
                </span>
              )}
            </div>
            {user.aadhar_card_url ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-400 break-all">{user.aadhar_card_url}</p>
                <div className="flex gap-2">
                  <a
                    href={user.aadhar_card_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-900/30 text-blue-400 border border-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-900/50 transition-colors"
                  >
                    <ExternalLink className="size-4" />
                    View
                  </a>
                  <a
                    href={user.aadhar_card_url}
                    download
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-900/30 text-blue-400 border border-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-900/50 transition-colors"
                  >
                    <Download className="size-4" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No document uploaded</p>
            )}
          </div>

          {/* PAN Card */}
          <div className="bg-bg-elevated border border-bg-elevated rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-purple-400" />
                <h4 className="font-semibold text-white">PAN Card</h4>
              </div>
              {user.pan_card_url && (
                <span className="px-2 py-1 bg-purple-900/30 text-purple-400 border border-purple-700 text-xs rounded-full">
                  Uploaded
                </span>
              )}
            </div>
            {user.pan_card_url ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-400 break-all">{user.pan_card_url}</p>
                <div className="flex gap-2">
                  <a
                    href={user.pan_card_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-900/30 text-purple-400 border border-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-900/50 transition-colors"
                  >
                    <ExternalLink className="size-4" />
                    View
                  </a>
                  <a
                    href={user.pan_card_url}
                    download
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-900/30 text-purple-400 border border-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-900/50 transition-colors"
                  >
                    <Download className="size-4" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No document uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
