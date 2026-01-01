'use client';

import { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface FilterContextType {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

const FilterContext = createContext<FilterContextType>({
  isFilterOpen: false,
  setIsFilterOpen: () => {},
});

export const useFilter = () => useContext(FilterContext);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const pathname = usePathname();

  // Hide header and footer on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <FilterContext.Provider value={{ isFilterOpen, setIsFilterOpen }}>
      {!isAuthPage && <Header onFilterClick={() => setIsFilterOpen(true)} />}
      <main className={isAuthPage ? '' : 'min-h-screen bg-main-bg'}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </FilterContext.Provider>
  );
}
