'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Star, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import CarCard from '@/components/CarCard';

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

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id as string;
  
  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [recommendedCars, setRecommendedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchCarDetails();
    fetchRecommendedCars();
  }, [carId]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`/api/cars/${carId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car details');
      }
      const data = await response.json();
      setCar(data.car);
      setReviews(data.reviews || []);
      setAvgRating(data.avg_rating || 0);
      setReviewCount(data.review_count || 0);
    } catch (error: any) {
      console.error('Error fetching car:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (response.ok) {
        const data = await response.json();
        const filtered = data.cars.filter((c: any) => c.id.toString() !== carId).slice(0, 6);
        setRecommendedCars(filtered);
      }
    } catch (error) {
      console.error('Error fetching recommended cars:', error);
    }
  };

  const handleRentNow = () => {
    if (!isAuthenticated) {
      // Show login modal or redirect to login
      if (confirm('You need to login to rent a car. Go to login page?')) {
        router.push(`/login?redirect=/cars/${carId}`);
      }
      return;
    }

    if (!car?.is_available) {
      alert('This car is not available for rent at the moment.');
      return;
    }

    // Navigate to payment page with car ID
    router.push(`/payment/${carId}`);
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      if (confirm('You need to login to write a review. Go to login page?')) {
        router.push(`/login?redirect=/cars/${carId}`);
      }
      return;
    }
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (reviewComment.trim().length < 10) {
      alert('Please write at least 10 characters in your review.');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`/api/cars/${carId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      alert('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
      
      // Refresh reviews
      fetchCarDetails();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCarLike = (carId: string) => {
    console.log('Car liked:', carId);
  };

  const handleRecommendedCarRent = (carId: string) => {
    router.push(`/cars/${carId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary-blue" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Car not found'}
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary-blue hover:underline"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const carImages = [car.image_url, car.image_url, car.image_url];

  return (
    <div className="px-6 lg:px-16 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="size-5" />
        <span className="font-semibold">Back</span>
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Side - Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-linear-to-br from-[#54a6ff] to-[#1e3a8a] rounded-xl overflow-hidden">
            <div className="p-8">
              <div className="mb-4">
                <h3 className="text-white text-2xl lg:text-3xl font-semibold mb-2">
                  {car.name}
                </h3>
                <p className="text-white/90 text-sm">
                  {car.description || 'Comfort and luxury combined in one vehicle'}
                </p>
              </div>
              <div className="relative h-64 lg:h-80">
                <Image
                  src={carImages[selectedImageIndex]}
                  alt={car.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-4">
            {carImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-video bg-white rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? 'border-primary-blue ring-2 ring-primary-blue/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${car.name} view ${index + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Car Details */}
        <div className="space-y-6">
          {/* Title and Like Button */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-5 ${
                        star <= Math.round(avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {avgRating.toFixed(1)} ({reviewCount} Review{reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Heart
                className={`size-6 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {car.description || 'Experience luxury and performance with this amazing vehicle.'}
          </p>

          {/* Availability Badge */}
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              car.is_available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {car.is_available ? '✓ Available' : '✗ Not Available'}
            </span>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400 text-sm">Type Car</span>
              <p className="text-gray-700 font-semibold">{car.type}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Capacity</span>
              <p className="text-gray-700 font-semibold">{car.capacity} Person</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Transmission</span>
              <p className="text-gray-700 font-semibold">{car.transmission}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Fuel Capacity</span>
              <p className="text-gray-700 font-semibold">{car.fuel_capacity}</p>
            </div>
          </div>

          {/* Price and Rent Button */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                ₹{car.price.toFixed(2)}
                </span>
                <span className="text-gray-400">/ day</span>
              </div>
              {car.original_price && (
                <span className="text-gray-400 line-through text-sm">
                  ₹{car.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={handleRentNow}
              disabled={!car.is_available}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                car.is_available
                  ? 'bg-primary-blue hover:bg-[#264ac6] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {car.is_available ? 'Rent Now' : 'Not Available'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
            <span className="bg-primary-blue text-white text-sm font-bold px-3 py-1 rounded">
              {reviewCount}
            </span>
          </div>
          <button
            onClick={handleWriteReview}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg font-semibold hover:bg-[#264ac6] transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Write Your Review</h3>
            
            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`size-8 cursor-pointer transition-colors ${
                        star <= reviewRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review (minimum 10 characters)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none"
                placeholder="Share your experience with this car..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || reviewComment.trim().length < 10}
                className="px-4 py-2 bg-primary-blue text-white rounded-lg font-semibold hover:bg-[#264ac6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submittingReview && <Loader2 className="size-4 animate-spin" />}
                Submit Review
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="size-14 rounded-full bg-primary-blue/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-blue">
                      {review.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{review.user_name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews yet. Be the first to review this car!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendation Car Section */}
      {recommendedCars.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recommended Cars</h2>
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-primary-blue hover:underline text-sm font-semibold"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCars.map((recommendedCar) => (
              <CarCard
                key={recommendedCar.id}
                id={recommendedCar.id.toString()}
                name={recommendedCar.name}
                type={recommendedCar.type}
                image={recommendedCar.image_url}
                fuelCapacity={recommendedCar.fuel_capacity}
                transmission={recommendedCar.transmission as 'Manual' | 'Automatic'}
                capacity={recommendedCar.capacity}
                price={recommendedCar.price}
                originalPrice={recommendedCar.original_price ?? undefined}
                onLike={handleCarLike}
                onRentNow={handleRecommendedCarRent}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
