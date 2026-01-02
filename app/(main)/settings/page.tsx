'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Upload, FileText, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface UserData {
  id: number;
  fullName: string;
  phone: string;
  countryCode: string;
  aadharCardUrl?: string;
  panCardUrl?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      
      const data = await response.json();
      setUser(data.user);
      setFormData({
        fullName: data.user.fullName || '',
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Profile updated successfully!');
        await fetchUserData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    type: 'aadhar' | 'pan'
  ) => {
    const setUploading = type === 'aadhar' ? setUploadingAadhar : setUploadingPan;
    setUploading(true);
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/user/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage(`${type === 'aadhar' ? 'Aadhar' : 'PAN'} card uploaded successfully!`);
        await fetchUserData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  // Helper function to check if URL is a PDF
  const isPDF = (url: string) => {
    return url?.toLowerCase().endsWith('.pdf');
  };

  // Render document preview
  const renderDocumentPreview = (url: string, title: string) => {
    if (isPDF(url)) {
      return (
        <div className="space-y-3">
          <div className="h-40 bg-bg-elevated rounded-lg flex items-center justify-center border border-bg-elevated">
            <div className="text-center">
              <FileText className="size-12 text-gold mx-auto mb-2" />
              <p className="text-sm text-gray-300">PDF Document</p>
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold-light transition-all duration-300 text-sm font-semibold shadow-lg shadow-gold/30"
          >
            <ExternalLink className="size-4" />
            View Document
          </a>
        </div>
      );
    } else {
      return (
        <div className="relative h-40 bg-bg-elevated rounded-lg overflow-hidden border border-bg-elevated">
          <Image
            src={url}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      );
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-bg-card border border-bg-elevated rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-bg-elevated to-bg-secondary px-6 py-8 border-b border-bg-elevated">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-400 mt-1">Manage your profile and documents</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-6 mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="size-5 text-green-400" />
              <span className="text-green-300">{successMessage}</span>
            </div>
          )}

          {/* Profile Information */}
          <div className="p-6 border-b border-bg-elevated">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="size-5 text-gold" />
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-bg-elevated rounded-lg bg-bg-elevated">
                  <Phone className="size-4 text-gray-400" />
                  <span className="text-gray-300">
                    {user?.countryCode} {user?.phone}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="mt-6 px-6 py-2 bg-gold hover:bg-gold-light text-black rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-gold/30"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

          {/* Document Upload */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="size-5 text-gold" />
              Identity Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aadhar Card */}
              <div className="border border-bg-elevated rounded-lg p-4 bg-bg-elevated">
                <h3 className="font-medium text-white mb-3">Aadhar Card</h3>
                
                {user?.aadharCardUrl ? (
                  <div className="space-y-3">
                    {renderDocumentPreview(user.aadharCardUrl, 'Aadhar Card')}
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'aadhar');
                        }}
                        className="hidden"
                        disabled={uploadingAadhar}
                      />
                      <span className="inline-flex items-center gap-2 px-4 py-2 border border-bg-elevated rounded-lg cursor-pointer hover:bg-bg-card hover:border-gold/50 transition-all text-sm text-gray-300">
                        <Upload className="size-4" />
                        Replace Document
                      </span>
                    </label>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'aadhar');
                      }}
                      className="hidden"
                      disabled={uploadingAadhar}
                    />
                    <div className="border-2 border-dashed border-bg-elevated rounded-lg p-8 text-center hover:border-gold hover:bg-bg-card transition-all cursor-pointer">
                      {uploadingAadhar ? (
                        <Loader2 className="size-8 animate-spin text-gold mx-auto" />
                      ) : (
                        <>
                          <Upload className="size-8 text-gold mx-auto mb-2" />
                          <p className="text-sm text-gray-300">Click to upload Aadhar</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF</p>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>

              {/* PAN Card */}
              <div className="border border-bg-elevated rounded-lg p-4 bg-bg-elevated">
                <h3 className="font-medium text-white mb-3">PAN Card</h3>
                
                {user?.panCardUrl ? (
                  <div className="space-y-3">
                    {renderDocumentPreview(user.panCardUrl, 'PAN Card')}
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'pan');
                        }}
                        className="hidden"
                        disabled={uploadingPan}
                      />
                      <span className="inline-flex items-center gap-2 px-4 py-2 border border-bg-elevated rounded-lg cursor-pointer hover:bg-bg-card hover:border-gold/50 transition-all text-sm text-gray-300">
                        <Upload className="size-4" />
                        Replace Document
                      </span>
                    </label>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'pan');
                      }}
                      className="hidden"
                      disabled={uploadingPan}
                    />
                    <div className="border-2 border-dashed border-bg-elevated rounded-lg p-8 text-center hover:border-gold hover:bg-bg-card transition-all cursor-pointer">
                      {uploadingPan ? (
                        <Loader2 className="size-8 animate-spin text-gold mx-auto" />
                      ) : (
                        <>
                          <Upload className="size-8 text-gold mx-auto mb-2" />
                          <p className="text-sm text-gray-300">Click to upload PAN</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF</p>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
