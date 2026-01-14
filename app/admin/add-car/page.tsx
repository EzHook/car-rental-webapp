'use client';

import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate total number of images (max 5)
    if (imageFiles.length + files.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }

    // Validate and process each file
    const validFiles: File[] = [];
    let validationErrors: string[] = [];

    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        validationErrors.push(`${file.name} is not an image file`);
        return;
      }

      // Validate file size (max 5MB)
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

    // Create previews for valid files
    const newPreviews: string[] = [];
    let loadedCount = 0;

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = reader.result as string;
        loadedCount++;
        
        // Update state only after all files are loaded
        if (loadedCount === validFiles.length) {
          setImageFiles(prev => [...prev, ...validFiles]);
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setUploading(true);

    try {
      // Upload all images in parallel for better performance
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
    
    if (imageFiles.length === 0) {
      alert('Please select at least one car image');
      return;
    }

    setLoading(true);

    try {
      // Upload all images first
      const imageUrls = await uploadImagesToCloudinary();
      
      if (imageUrls.length === 0) {
        setLoading(false);
        return;
      }

      // Add car to database with array of image URLs
      const response = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls, // Array of URLs instead of single imageUrl
          capacity: parseInt(formData.capacity),
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add car');
      }

      alert('Car added successfully!');
      router.push('/admin/cars');
    } catch (error: any) {
      console.error('Error adding car:', error);
      alert(error.message || 'Failed to add car');
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-2">Add New Car</h1>
          <p className="text-sm sm:text-base text-gray-400">Fill in the details to add a new car to your inventory</p>
        </div>

        {/* Form */}
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
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {imageFiles[index]?.name.length > 15 
                        ? imageFiles[index]?.name.substring(0, 15) + '...'
                        : imageFiles[index]?.name}
                    </div>
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
                <p className="text-xs sm:text-sm text-gray-400">
                  PNG, JPG, WEBP up to 5MB each • First image will be primary
                </p>
              </div>
            )}
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
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
                placeholder="e.g., Nissan GT-R"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Car Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
              >
                <option value="Sport" className="bg-bg-elevated">Sport</option>
                <option value="SUV" className="bg-bg-elevated">SUV</option>
                <option value="Sedan" className="bg-bg-elevated">Sedan</option>
                <option value="Hatchback" className="bg-bg-elevated">Hatchback</option>
                <option value="MPV" className="bg-bg-elevated">MPV</option>
                <option value="Coupe" className="bg-bg-elevated">Coupe</option>
              </select>
            </div>

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
                placeholder="e.g., 80L"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Transmission <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
              >
                <option value="Manual" className="bg-bg-elevated">Manual</option>
                <option value="Automatic" className="bg-bg-elevated">Automatic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Capacity (People) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min="2"
                max="8"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="e.g., 4"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                License Plate <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500"
                placeholder="e.g., MH-01-AB-1234"
              />
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Original Price (₹) - Optional
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
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none text-white placeholder:text-gray-500"
              placeholder="Enter car description..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full sm:w-auto px-6 py-2.5 bg-gold text-black rounded-lg font-bold hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold/30 hover:shadow-gold-light/40 hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  {uploading ? `Uploading ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}...` : 'Adding Car...'}
                </>
              ) : (
                <>
                  <Upload className="size-5" />
                  Add Car
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
