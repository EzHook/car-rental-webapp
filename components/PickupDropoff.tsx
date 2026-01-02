'use client';

import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface PickupDropoffData {
  location: string;
  date: string;
  time: string;
}

export default function PickupDropoff() {
  const [selectedOption, setSelectedOption] = useState<'pickup' | 'dropoff'>('pickup');
  const [pickup, setPickup] = useState<PickupDropoffData>({
    location: '',
    date: '',
    time: '',
  });
  const [dropoff, setDropoff] = useState<PickupDropoffData>({
    location: '',
    date: '',
    time: '',
  });

  const locations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Goa',
    'Pune',
    'Hyderabad',
    'Chennai',
  ];

  const times = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  ];

  const handleSwap = () => {
    const tempPickup = { ...pickup };
    setPickup(dropoff);
    setDropoff(tempPickup);
  };

  return (
    <div className="bg-bg-card border border-bg-elevated rounded-lg p-6 shadow-lg">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pick-Up Section */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="radio"
              id="pickup"
              name="rental-type"
              checked={selectedOption === 'pickup'}
              onChange={() => setSelectedOption('pickup')}
              className="w-4 h-4 text-gold accent-gold cursor-pointer"
            />
            <label htmlFor="pickup" className="font-semibold text-white cursor-pointer">
              Pick - Up
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Locations
              </label>
              <select
                value={pickup.location}
                onChange={(e) => setPickup({ ...pickup, location: e.target.value })}
                className="w-full px-4 py-3 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm cursor-pointer hover:border-gold/50 transition-colors"
              >
                <option value="" className="bg-bg-elevated text-gray-400">Select your city</option>
                {locations.map((location) => (
                  <option key={location} value={location} className="bg-bg-elevated text-white">
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={pickup.date}
                onChange={(e) => setPickup({ ...pickup, date: e.target.value })}
                className="w-full px-4 py-3 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm cursor-pointer hover:border-gold/50 transition-colors scheme-dark"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Time
              </label>
              <select
                value={pickup.time}
                onChange={(e) => setPickup({ ...pickup, time: e.target.value })}
                className="w-full px-4 py-3 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm cursor-pointer hover:border-gold/50 transition-colors"
              >
                <option value="" className="bg-bg-elevated text-gray-400">Select your time</option>
                {times.map((time) => (
                  <option key={time} value={time} className="bg-bg-elevated text-white">
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="shrink-0 lg:mt-8">
          <button
            onClick={handleSwap}
            className="bg-gold hover:bg-gold-light text-black p-4 rounded-lg transition-all duration-300 shadow-lg shadow-gold/30 hover:shadow-gold-light/40 hover:scale-105"
            aria-label="Swap pickup and dropoff"
          >
            <ArrowUpDown className="size-5" />
          </button>
        </div>

        {/* Drop-Off Section */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="radio"
              id="dropoff"
              name="rental-type"
              checked={selectedOption === 'dropoff'}
              onChange={() => setSelectedOption('dropoff')}
              className="w-4 h-4 text-gold accent-gold cursor-pointer"
            />
            <label htmlFor="dropoff" className="font-semibold text-white cursor-pointer">
              Drop - Off
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Locations
              </label>
              <select
                value={dropoff.location}
                onChange={(e) => setDropoff({ ...dropoff, location: e.target.value })}
                className="w-full px-4 py-3 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm cursor-pointer hover:border-gold/50 transition-colors"
              >
                <option value="" className="bg-bg-elevated text-gray-400">Select your city</option>
                {locations.map((location) => (
                  <option key={location} value={location} className="bg-bg-elevated text-white">
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={dropoff.date}
                onChange={(e) => setDropoff({ ...dropoff, date: e.target.value })}
                className="w-full px-4 py-3 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm cursor-pointer hover:border-gold/50 transition-colors scheme-dark"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Time
              </label>
              <select
                value={dropoff.time}
                onChange={(e) => setDropoff({ ...dropoff, time: e.target.value })}
                className="w-full px-4 py-3 bg-bg-elevated border border-bg-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white text-sm cursor-pointer hover:border-gold/50 transition-colors"
              >
                <option value="" className="bg-bg-elevated text-gray-400">Select your time</option>
                {times.map((time) => (
                  <option key={time} value={time} className="bg-bg-elevated text-white">
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
