'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Fuel, Users } from 'lucide-react';

interface CarCardProps {
  id: string;
  name: string;
  type: string;
  image: string;
  fuelCapacity: string;
  transmission: 'Manual' | 'Automatic';
  capacity: number;
  price: number;
  originalPrice?: number;
  isLiked?: boolean;
  onLike?: (id: string) => void;
  onRentNow: (id: string) => void;
}

export default function CarCard({
  id,
  name,
  type,
  image,
  fuelCapacity,
  transmission,
  capacity,
  price,
  originalPrice,
  isLiked = false,
  onLike,
  onRentNow,
}: CarCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onLike) {
      onLike(id);
    }
  };

  const handleRentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRentNow(id);
  };

  const handleCardClick = () => {
    router.push(`/cars/${id}`);
  };

  // Convert to number if needed
const priceNum = typeof price === 'number' ? price : parseFloat(price);
  const originalPriceNum = originalPrice ? (typeof originalPrice === 'number' ? originalPrice : parseFloat(originalPrice)) : null;
  const hasDiscount = originalPriceNum && originalPriceNum > priceNum;

  return (
    <div 
      onClick={handleCardClick}
      className="bg-bg-card border border-gray-800 rounded-lg p-6 shadow-lg hover:shadow-[#DAA520]/20 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:border-[#DAA520]/30"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#DAA520] transition-colors">{name}</h3>
          <p className="text-sm text-gray-400 font-medium">{type}</p>
        </div>
        <button
          onClick={handleLikeClick}
          className="p-2 hover:bg-bg-main rounded-full transition-colors"
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart
            className={`size-6 ${
              liked ? 'fill-[#DAA520] text-[#DAA520]' : 'text-gray-500'
            } transition-colors hover:text-[#DAA520]`}
          />
        </button>
      </div>

      {/* Car Image */}
      <div className="relative w-full h-40 mb-6 bg-bg-main rounded-lg">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Specifications */}
      <div className="flex items-center justify-between mb-6 text-gray-400">
        {/* Fuel Capacity */}
        <div className="flex items-center gap-1.5">
          <Fuel className="size-5 text-[#DAA520]" />
          <span className="text-sm font-medium text-gray-300">{fuelCapacity}</span>
        </div>

        {/* Transmission */}
        <div className="flex items-center gap-1.5">
          <svg
            className="size-5 text-[#DAA520]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span className="text-sm font-medium text-gray-300">{transmission}</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-1.5">
          <Users className="size-5 text-[#DAA520]" />
          <span className="text-sm font-medium text-gray-300">{capacity} People</span>
        </div>
      </div>

      {/* Price and Button */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">
              ₹{priceNum.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400">/ day</span>
          </div>
          {hasDiscount && originalPriceNum && (
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPriceNum.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={handleRentClick}
          className="bg-[#DAA520] hover:bg-gold-light text-black px-5 py-2.5 rounded-md font-bold text-sm transition-all duration-300 shadow-lg shadow-[#DAA520]/30 hover:shadow-gold-light/40 hover:scale-105"
        >
          Rent Now
        </button>
      </div>
    </div>
  );
}
