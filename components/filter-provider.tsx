'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';

type FilterType = Task['status'];

interface FilterContextType {
  filters: FilterType[];
  toggleFilter: (filter: FilterType) => void;
  removeFilter: (filter: FilterType) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const toggleFilter = (filter: FilterType) => {
    setFilters((prev) => {
      if (prev.includes(filter)) {
        return prev.filter((f) => f !== filter);
      }
      return [...prev, filter];
    });
  };

  const removeFilter = (filter: FilterType) => {
    setFilters((prev) => prev.filter((f) => f !== filter));
  };

  return (
    <FilterContext.Provider value={{ filters, toggleFilter, removeFilter, dateRange, setDateRange }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
