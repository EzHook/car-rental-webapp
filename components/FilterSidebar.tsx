'use client';

import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface FilterOptions {
  type: string[];
  capacity: string[];
  maxPrice: number;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export default function FilterSidebar({ isOpen, onClose, onToggle, onApplyFilters }: FilterSidebarProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Sport', 'SUV']);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>(['2 Person', '8 or More']);
  const [maxPrice, setMaxPrice] = useState(100);

  const carTypes = [
    { name: 'Sport', count: 10 },
    { name: 'SUV', count: 12 },
    { name: 'MPV', count: 16 },
    { name: 'Sedan', count: 20 },
    { name: 'Coupe', count: 14 },
    { name: 'Hatchback', count: 14 },
  ];

  const capacityOptions = [
    { name: '2 Person', count: 10 },
    { name: '4 Person', count: 14 },
    { name: '6 Person', count: 12 },
    { name: '8 or More', count: 16 },
  ];

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCapacityChange = (capacity: string) => {
    setSelectedCapacities((prev) =>
      prev.includes(capacity) ? prev.filter((c) => c !== capacity) : [...prev, capacity]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      type: selectedTypes,
      capacity: selectedCapacities,
      maxPrice,
    });
  };

  return (
    <>
      {/* Backdrop for mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className="relative shrink-0">
        {/* Sidebar */}
        <div
          className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto bg-bg-secondary z-50 lg:z-auto transition-all duration-300 ease-in-out border-r border-bg-elevated overflow-y-auto ${
            isOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0'
          }`}
        >
          <div className={`p-6 ${isOpen ? 'block' : 'lg:hidden'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
              <button
                onClick={onToggle}
                className="lg:hidden p-2 hover:bg-bg-elevated rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <X className="size-5 text-gray-400 hover:text-gold" />
              </button>
            </div>

            {/* TYPE Section */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-4">
                TYPE
              </h3>
              <div className="space-y-4">
                {carTypes.map((type) => (
                  <label
                    key={type.name}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.name)}
                      onChange={() => handleTypeChange(type.name)}
                      className="size-5 rounded border-2 border-bg-elevated text-gold focus:ring-2 focus:ring-gold cursor-pointer accent-gold"
                    />
                    <span className="text-base text-gray-300 font-semibold group-hover:text-gold transition-colors">
                      {type.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">({type.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* CAPACITY Section */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-4">
                CAPACITY
              </h3>
              <div className="space-y-4">
                {capacityOptions.map((capacity) => (
                  <label
                    key={capacity.name}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCapacities.includes(capacity.name)}
                      onChange={() => handleCapacityChange(capacity.name)}
                      className="size-5 rounded border-2 border-bg-elevated text-gold focus:ring-2 focus:ring-gold cursor-pointer accent-gold"
                    />
                    <span className="text-base text-gray-300 font-semibold group-hover:text-gold transition-colors">
                      {capacity.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">({capacity.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PRICE Section */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-4">
                PRICE
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #DAA520 0%, #DAA520 ${(maxPrice / 200) * 100}%, #2a2a2a ${(maxPrice / 200) * 100}%, #2a2a2a 100%)`,
                  }}
                />
                <p className="text-xl font-semibold text-white">
                  Max. ₹{maxPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Apply Button - Mobile */}
            <button
              onClick={handleApply}
              className="w-full bg-gold hover:bg-gold-light text-black py-3 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-gold/30 lg:hidden"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Toggle Button - Desktop (outside sidebar) */}
        <button
          onClick={onToggle}
          className={`hidden lg:flex absolute top-8 bg-bg-card border border-bg-elevated rounded-r-lg p-2 hover:bg-bg-elevated hover:border-gold/50 transition-all duration-300 shadow-lg z-10 ${
            isOpen ? 'left-80' : 'left-0'
          }`}
          aria-label={isOpen ? 'Close filters' : 'Open filters'}
        >
          {isOpen ? (
            <ChevronLeft className="size-5 text-gold" />
          ) : (
            <ChevronRight className="size-5 text-gold" />
          )}
        </button>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #DAA520;
          cursor: pointer;
          border: 3px solid #1a1a1a;
          box-shadow: 0 2px 8px rgba(218, 165, 32, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #DAA520;
          cursor: pointer;
          border: 3px solid #1a1a1a;
          box-shadow: 0 2px 8px rgba(218, 165, 32, 0.4);
        }

        .slider::-webkit-slider-thumb:hover {
          background: #FFD700;
          box-shadow: 0 2px 12px rgba(255, 215, 0, 0.6);
        }

        .slider::-moz-range-thumb:hover {
          background: #FFD700;
          box-shadow: 0 2px 12px rgba(255, 215, 0, 0.6);
        }
      `}</style>
    </>
  );
}
