'use client';

import { useState, useEffect } from 'react';
import CarCard from '@/components/CarCard';
import HeroCard from '@/components/HeroCard';
import PickupDropoff from '@/components/PickupDropoff';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: [] as string[],
    capacity: [] as string[],
    maxPrice: 10000,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 8;

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
    router.push(`/cars/${carId}`);
  };

  // Filter cars based on applied filters
  const filteredCars = cars.filter(car => {
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
  const popularCars = cars.slice(0, 4);

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex gap-0 bg-bg-main min-h-screen">
      <div className="flex-1 px-6 lg:px-8 py-8 overflow-hidden w-full max-w-7xl mx-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-white">
                  All Cars {filters.type.length > 0 || filters.capacity.length > 0 || filters.maxPrice < 10000 ? '(Filtered)' : ''}
                </h2>
                {(filters.type.length > 0 || filters.capacity.length > 0 || filters.maxPrice < 10000) && (
                  <button
                    onClick={() => {
                      setFilters({ type: [], capacity: [], maxPrice: 10000 });
                      setCurrentPage(1);
                    }}
                    className="text-gold hover:text-gold-light hover:underline text-sm font-semibold transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Inline Filter Bar */}
              <div className="bg-bg-card border border-bg-elevated rounded-xl p-4 sm:p-6 mb-8 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  
                  {/* Car Type */}
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gold uppercase tracking-wider mb-3 block">
                      Car Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'].map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              type: prev.type.includes(type) 
                                ? prev.type.filter(t => t !== type)
                                : [...prev.type, type]
                            }));
                            setCurrentPage(1);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            filters.type.includes(type)
                              ? 'bg-gold text-black'
                              : 'bg-bg-elevated text-gray-300 hover:bg-bg-secondary border border-bg-elevated'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Capacity & Price */}
                  <div className="flex flex-col sm:flex-row gap-6 flex-1 lg:flex-none">
                    {/* Capacity */}
                    <div>
                      <label className="text-xs font-semibold text-gold uppercase tracking-wider mb-3 block">
                        Capacity
                      </label>
                      <select
                        value={filters.capacity.length > 0 ? filters.capacity[0] : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilters(prev => ({
                            ...prev,
                            capacity: val ? [val] : []
                          }));
                          setCurrentPage(1);
                        }}
                        className="w-full sm:w-40 px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white appearance-none cursor-pointer"
                      >
                        <option value="">Any Capacity</option>
                        <option value="2 Person">2 Person</option>
                        <option value="4 Person">4 Person</option>
                        <option value="6 Person">6 Person</option>
                        <option value="8 or More">8 or More</option>
                      </select>
                    </div>

                    {/* Max Price */}
                    <div>
                      <label className="text-xs font-semibold text-gold uppercase tracking-wider mb-3 block">
                        Max Price (₹{filters.maxPrice})
                      </label>
                      <div className="pt-2">
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="100"
                          value={filters.maxPrice}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              maxPrice: Number(e.target.value)
                            }));
                            setCurrentPage(1);
                          }}
                          className="w-full sm:w-48 h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-gold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300">
                  {currentCars.map((car) => (
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
                    onClick={() => setFilters({ type: [], capacity: [], maxPrice: 10000 })}
                    className="text-gold hover:text-gold-light hover:underline text-sm font-semibold transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-bg-elevated text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gold hover:text-black transition-colors"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`size-10 rounded-lg font-semibold transition-colors ${
                        currentPage === i + 1
                          ? 'bg-gold text-black'
                          : 'bg-bg-elevated text-gray-300 hover:bg-bg-card'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-bg-elevated text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gold hover:text-black transition-colors"
                  >
                    Next
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
