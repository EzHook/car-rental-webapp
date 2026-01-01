'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FilterSidebar from '@/components/FilterSidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilters = (filters: any) => {
    // Handle filter application - you can implement this based on your needs
    console.log('Filters applied:', filters);
    setIsFilterOpen(false);
  };

  return (
    <>
      <Header onFilterClick={() => setIsFilterOpen(true)} />
      {children}
      <Footer />
    </>
  );
}
