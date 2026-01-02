'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Loader2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Car {
  id: number;
  name: string;
  type: string;
  image_url: string;
  fuel_capacity: string;
  transmission: string;
  capacity: number;
  price: number;
  original_price?: number;
  license_plate: string;
  description?: string;
  is_available: boolean;
  created_at: string;
}

export default function CarsListPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/admin/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data.cars);
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/cars/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCars(cars.filter(car => car.id !== id));
        setDeleteConfirm(null);
        alert('Car deleted successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete car');
    } finally {
      setDeleting(false);
    }
  };

  const toggleAvailability = async (car: Car) => {
    try {
      const response = await fetch(`/api/admin/cars/${car.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...car,
          imageUrl: car.image_url,
          fuelCapacity: car.fuel_capacity,
          originalPrice: car.original_price,
          licensePlate: car.license_plate,
          isAvailable: !car.is_available,
        }),
      });

      if (response.ok) {
        fetchCars(); // Refresh list
      }
    } catch (error) {
      console.error('Toggle availability error:', error);
    }
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.license_plate.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || car.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const carTypes = ['all', ...new Set(cars.map(car => car.type))];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-12 animate-spin text-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-2">Cars Inventory</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your car collection ({filteredCars.length} cars)</p>
        </div>
        <Link
          href="/admin/add-car"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gold text-black rounded-lg font-bold hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/30 hover:shadow-gold-light/40 hover:scale-105"
        >
          <Plus className="size-5" />
          <span className="hidden sm:inline">Add New Car</span>
          <span className="sm:hidden">Add Car</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-bg-card border border-bg-elevated rounded-lg p-4 mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gold size-5" />
            <input
              type="text"
              placeholder="Search by name, type, or license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white placeholder:text-gray-500 text-sm sm:text-base"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gold" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm sm:text-base"
            >
              {carTypes.map(type => (
                <option key={type} value={type} className="bg-bg-elevated">
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <div className="bg-bg-card border border-bg-elevated rounded-lg p-8 sm:p-12 text-center shadow-lg">
          <div className="size-16 sm:size-20 bg-bg-elevated rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="size-8 sm:size-10 text-gold" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No cars found</h3>
          <p className="text-sm sm:text-base text-gray-400 mb-6">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start by adding your first car'}
          </p>
          {cars.length === 0 && (
            <Link
              href="/admin/add-car"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-black rounded-lg font-bold hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/30"
            >
              <Plus className="size-5" />
              Add Your First Car
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCars.map((car) => (
            <div 
              key={car.id} 
              className="bg-bg-card border border-bg-elevated rounded-xl shadow-lg hover:shadow-xl hover:border-gold/30 transition-all duration-300 overflow-hidden group"
            >
              {/* Car Image */}
              <div className="relative h-40 sm:h-48 bg-linear-to-br from-bg-elevated to-bg-secondary">
                <Image
                  src={car.image_url}
                  alt={car.name}
                  fill
                  className="object-contain p-4"
                />
                {!car.is_available && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      Unavailable
                    </span>
                  </div>
                )}
              </div>

              {/* Car Details */}
              <div className="p-4">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-white flex-1 text-sm sm:text-base group-hover:text-gold transition-colors">{car.name}</h3>
                    <button
                      onClick={() => toggleAvailability(car)}
                      className="ml-2 hover:scale-110 transition-transform"
                      title={car.is_available ? 'Mark as unavailable' : 'Mark as available'}
                    >
                      {car.is_available ? (
                        <ToggleRight className="size-5 sm:size-6 text-green-400" />
                      ) : (
                        <ToggleLeft className="size-5 sm:size-6 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400">{car.type}</p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{car.license_plate}</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-400">
                  <div>⛽ {car.fuel_capacity}</div>
                  <div>⚙️ {car.transmission}</div>
                  <div>👥 {car.capacity} People</div>
                  <div className={car.is_available ? 'text-green-400' : 'text-red-400'}>
                    {car.is_available ? '✓ Available' : '✗ Unavailable'}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-bg-elevated">
                  <div>
                    <p className="text-base sm:text-lg font-bold text-gold">₹{car.price}/day</p>
                    {car.original_price && (
                      <p className="text-xs text-gray-500 line-through">₹{car.original_price}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(car.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push(`/admin/cars/${car.id}/edit`)}
                    className="flex-1 px-3 py-2 bg-bg-elevated text-gray-300 rounded-lg text-xs sm:text-sm font-semibold hover:bg-bg-secondary hover:text-gold transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="size-3 sm:size-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(car.id)}
                    className="flex-1 px-3 py-2 bg-red-900/30 text-red-400 border border-red-700 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="size-3 sm:size-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" 
            onClick={() => !deleting && setDeleteConfirm(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-card border border-bg-elevated rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Delete Car?</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6">
                Are you sure you want to delete this car? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-bg-elevated text-gray-300 rounded-lg font-semibold hover:bg-bg-secondary hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
