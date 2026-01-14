'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, ArrowLeft, Save, Images } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Sport',
    fuelCapacity: '',
    transmission: 'Manual',
    capacity: '',
    price: '',
    originalPrice: '',
    licensePlate: '',
    description: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchCar();
  }, [carId]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/admin/cars/${carId}`);
      if (response.ok) {
        const data = await response.json();
        const car = data.car;
        
        setFormData({
          name: car.name,
          type: car.type,
          fuelCapacity: car.fuel_capacity,
          transmission: car.transmission,
          capacity: car.capacity.toString(),
          price: car.price.toString(),
          originalPrice: car.original_price?.toString() || '',
          licensePlate: car.license_plate,
          description: car.description || '',
          isAvailable: car.is_available,
        });
        
        // Handle existing images
        const existingImages = car.image_urls || [];
        setExistingImageUrls(existingImages);
        setImagePreviews(existingImages);
      } else {
        alert('Car not found');
        router.push('/admin/cars');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load car details');
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Check total images (existing + new)
    const totalImages = imagePreviews.length + files.length;
    if (totalImages > 5) {
      alert(`You can only have a maximum of 5 images. You currently have ${imagePreviews.length} images.`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    let validationErrors: string[] = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        validationErrors.push(`${file.name} is not an image file`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        validationErrors.push(`${file.name} exceeds 5MB`);
        return;
      }

      validFiles.push(file);
    });

    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
    }

    if (validFiles.length === 0) return;

    // Create previews for new files
    const newPreviews: string[] = [];
    let loadedCount = 0;

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = reader.result as string;
        loadedCount++;
        
        if (loadedCount === validFiles.length) {
          setImageFiles(prev => [...prev, ...validFiles]);
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    // Check if it's an existing image or new upload
    if (index < existingImageUrls.length) {
      // Remove from existing images
      setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new uploads
      const newFileIndex = index - existingImageUrls.length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadNewImagesToCloudinary = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setUploading(true);

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload one or more images. Please try again.');
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imagePreviews.length === 0) {
      alert('Please select at least one car image');
      return;
    }

    setLoading(true);

    try {
      // Upload new images
      const newUploadedUrls = await uploadNewImagesToCloudinary();
      
      if (imageFiles.length > 0 && newUploadedUrls.length === 0) {
        setLoading(false);
        return;
      }

      // Combine existing and newly uploaded URLs
      const allImageUrls = [...existingImageUrls, ...newUploadedUrls];

      const response = await fetch(`/api/admin/cars/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls: allImageUrls,
          capacity: parseInt(formData.capacity),
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update car');
      }

      alert('Car updated successfully!');
      router.push('/admin/cars');
    } catch (error: any) {
      console.error('Error updating car:', error);
      alert(error.message || 'Failed to update car');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center h-64">
        <Loader2 className="size-12 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm">Back to Cars</span>
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-2">Edit Car</h1>
          <p className="text-sm sm:text-base text-gray-400">Update car details and availability</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
          {/* Multiple Images Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Car Images (Max 5) <span className="text-red-400">*</span>
            </label>
            
            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative border-2 border-bg-elevated rounded-lg p-2 bg-bg-elevated group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-32 object-cover rounded transition-opacity group-hover:opacity-75" 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                    >
                      <X className="size-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-gold text-black text-xs px-2 py-1 rounded font-semibold shadow-md">
                        Primary
                      </div>
                    )}
                    {index < existingImageUrls.length ? (
                      <div className="absolute bottom-2 right-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded">
                        Existing
                      </div>
                    ) : (
                      <div className="absolute bottom-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            {imagePreviews.length < 5 && (
              <div className="border-2 border-dashed border-bg-elevated rounded-lg p-8 sm:p-12 text-center hover:border-gold transition-colors cursor-pointer relative bg-bg-elevated/50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="size-12 sm:size-16 text-gold mx-auto mb-4" />
                <p className="text-sm sm:text-base text-white mb-2 font-semibold">
                  {imagePreviews.length === 0 
                    ? 'Click to upload or drag and drop' 
                    : `Add more images (${5 - imagePreviews.length} remaining)`}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">PNG, JPG up to 5MB each</p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Car Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Car Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="e.g., Tesla Model S"
              />
            </div>

            {/* Car Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Car Type <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
              >
                <option value="Sport" className="bg-bg-elevated">Sport</option>
                <option value="SUV" className="bg-bg-elevated">SUV</option>
                <option value="Sedan" className="bg-bg-elevated">Sedan</option>
                <option value="Hatchback" className="bg-bg-elevated">Hatchback</option>
                <option value="Coupe" className="bg-bg-elevated">Coupe</option>
                <option value="MPV" className="bg-bg-elevated">MPV</option>
              </select>
            </div>

            {/* Fuel Capacity */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Fuel Capacity <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fuelCapacity}
                onChange={(e) => setFormData({ ...formData, fuelCapacity: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="e.g., 90L"
              />
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Transmission <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
              >
                <option value="Manual" className="bg-bg-elevated">Manual</option>
                <option value="Automatic" className="bg-bg-elevated">Automatic</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Capacity (People) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="12"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="e.g., 4"
              />
            </div>

            {/* License Plate */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                License Plate <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="e.g., ABC-1234"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Price per Day (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="e.g., 99.00"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Original Price (₹) <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="e.g., 120.00"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none text-white placeholder:text-gray-500"
              placeholder="Enter car description..."
            />
          </div>

          {/* Availability Toggle */}
          <div className="mb-8 p-4 bg-bg-elevated rounded-lg border border-bg-elevated">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-5 h-5 text-gold focus:ring-2 focus:ring-gold rounded accent-gold"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-white block">
                  Available for Rent
                </span>
                <span className="text-xs text-gray-400">
                  {formData.isAvailable ? 'Car is currently available for customers' : 'Car is marked as unavailable'}
                </span>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full sm:w-auto px-6 py-2.5 bg-gold text-black rounded-lg font-bold hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold/30 hover:shadow-gold-light/40 hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  {uploading ? `Uploading ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}...` : 'Updating Car...'}
                </>
              ) : (
                <>
                  <Save className="size-5" />
                  Update Car
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading || uploading}
              className="w-full sm:w-auto px-6 py-2.5 bg-bg-elevated text-gray-300 rounded-lg font-semibold hover:bg-bg-card hover:text-white transition-colors disabled:opacity-50 border border-bg-elevated"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
