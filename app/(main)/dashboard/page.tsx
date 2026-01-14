'use client';

import { useState, useEffect } from 'react';
import CarCard from '@/components/CarCard';
import FilterSidebar from '@/components/FilterSidebar';
import HeroCard from '@/components/HeroCard';
import PickupDropoff from '@/components/PickupDropoff';
import { Loader2 } from 'lucide-react';

interface Car {
  id: number;
  name: string;
  type: string;
  image_urls: string[];
  fuel_capacity: string;
  transmission: string;
  capacity: number;
  price: number;
  original_price: number | null;
  is_available: boolean;
}

export default function DashboardPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: [] as string[],
    capacity: [] as string[],
    maxPrice: 1000,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data = await response.json();
      setCars(data.cars || []);
    } catch (error: any) {
      console.error('Error fetching cars:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    console.log('Applied filters:', newFilters);
  };

  const handleRentalClick = () => {
    const carsSection = document.getElementById('cars-section');
    carsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEasyRentClick = () => {
    const carsSection = document.getElementById('cars-section');
    carsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCarLike = (carId: string) => {
    console.log('Car liked:', carId);
  };

  const handleRentNow = (carId: string) => {
    window.location.href = `/cars/${carId}`;
  };

  // Filter cars based on applied filters
  const filteredCars = cars.filter(car => {
    if (!car.is_available) return false;

    if (filters.type.length > 0 && !filters.type.includes(car.type)) {
      return false;
    }

    if (filters.capacity.length > 0) {
      const hasMatchingCapacity = filters.capacity.some(cap => {
        if (cap === '2 Person') return car.capacity === 2;
        if (cap === '4 Person') return car.capacity === 4;
        if (cap === '6 Person') return car.capacity === 6;
        if (cap === '8 or More') return car.capacity >= 8;
        return false;
      });
      if (!hasMatchingCapacity) return false;
    }

    if (car.price > filters.maxPrice) {
      return false;
    }

    return true;
  });

  // Popular cars - show first 4 available cars
  const popularCars = cars
    .filter(car => car.is_available)
    .slice(0, 4);

  return (
    <div className="flex gap-0 bg-bg-main min-h-screen">
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        onApplyFilters={handleApplyFilters}
      />

      <div className="flex-1 px-6 lg:px-8 py-8 overflow-hidden">
        {/* Hero Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <HeroCard
            title="The Best Platform for Car Rental"
            description="Ease of doing a car rental safely and reliably. Of course at a low price."
            buttonText="Rental Car"
            onButtonClick={handleRentalClick}
            carImage="/cars/ertiga.png"
            backgroundGradient="from-bg-secondary to-bg-main"
            buttonColor="bg-gold hover:bg-gold-dark text-black font-semibold"
          />

          <HeroCard
            title="Easy way to rent a car at a low price"
            description="Providing cheap car rental services and safe and comfortable facilities."
            buttonText="Rental Car"
            onButtonClick={handleEasyRentClick}
            carImage="/cars/i20.png"
            backgroundGradient="from-bg-elevated to-bg-secondary"
            buttonColor="bg-gold-light hover:bg-gold text-black font-semibold"
          />
        </div>

        <PickupDropoff />

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-12 animate-spin text-gold" />
          </div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-lg p-6 text-center my-8">
            <p className="text-red-200 font-semibold mb-2">Failed to load cars</p>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <button
              onClick={fetchCars}
              className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold-dark transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Popular Cars Section */}
            <div className="mt-8" id="cars-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Popular Cars</h2>
                <button 
                  onClick={() => {
                    const allCarsSection = document.getElementById('all-cars-section');
                    allCarsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gold hover:text-gold-light hover:underline text-sm font-semibold transition-colors"
                >
                  View All
                </button>
              </div>

              {popularCars.length > 0 ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
                  isFilterOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                }`}>
                  {popularCars.map((car) => (
                    <CarCard
                      key={car.id}
                      id={car.id.toString()}
                      name={car.name}
                      type={car.type}
                      image={car.image_urls[0]}
                      fuelCapacity={car.fuel_capacity}
                      transmission={car.transmission as 'Manual' | 'Automatic'}
                      capacity={car.capacity}
                      price={car.price}
                      originalPrice={car.original_price ?? undefined}
                      onLike={handleCarLike}
                      onRentNow={handleRentNow}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-bg-secondary rounded-lg border border-bg-elevated">
                  <p className="text-gray-400">No popular cars available at the moment</p>
                </div>
              )}
            </div>

            {/* All Cars Section */}
            <div className="mt-12" id="all-cars-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  All Cars {filters.type.length > 0 || filters.capacity.length > 0 ? '(Filtered)' : ''}
                </h2>
                {(filters.type.length > 0 || filters.capacity.length > 0) && (
                  <button
                    onClick={() => setFilters({ type: [], capacity: [], maxPrice: 1000 })}
                    className="text-gold hover:text-gold-light hover:underline text-sm font-semibold transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {filteredCars.length > 0 ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
                  isFilterOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                }`}>
                  {filteredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      id={car.id.toString()}
                      name={car.name}
                      type={car.type}
                      image={car.image_urls[0]}
                      fuelCapacity={car.fuel_capacity}
                      transmission={car.transmission as 'Manual' | 'Automatic'}
                      capacity={car.capacity}
                      price={car.price}
                      originalPrice={car.original_price ?? undefined}
                      onLike={handleCarLike}
                      onRentNow={handleRentNow}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-bg-secondary rounded-lg border border-bg-elevated">
                  <p className="text-gray-400 mb-2">No cars match your filters</p>
                  <button
                    onClick={() => setFilters({ type: [], capacity: [], maxPrice: 1000 })}
                    className="text-gold hover:text-gold-light hover:underline text-sm font-semibold transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {filteredCars.length > 12 && (
                <div className="text-center mt-8">
                  <button className="px-6 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold-light/30 hover:scale-105">
                    Show More Cars
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
