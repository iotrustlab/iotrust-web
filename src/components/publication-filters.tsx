"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Publication } from '@/lib/data';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import themes from '@/data/themes.json';

interface PublicationFiltersProps {
  publications: Publication[];
  onFilteredPublications: (filteredPublications: Publication[], searchQuery?: string) => void;
}

export function PublicationFilters({ publications, onFilteredPublications }: PublicationFiltersProps) {
  const [sortBy, setSortBy] = useState<'year' | 'title'>('year');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize theme filter from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    if (themeParam && themes.find(t => t.id === themeParam)) {
      setThemeFilter(themeParam);
    }
  }, []);

  // Update URL when theme filter changes
  useEffect(() => {
    if (themeFilter !== 'all') {
      const url = new URL(window.location.href);
      url.searchParams.set('theme', themeFilter);
      window.history.replaceState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('theme');
      window.history.replaceState({}, '', url.toString());
    }
  }, [themeFilter]);

  // Get unique years from publications
  const years = [...new Set(publications.map(pub => pub.year))]
    .filter((year): year is number => typeof year === 'number' && year > 0)
    .sort((a, b) => b - a);

  // Get unique types from publications
  const types = [...new Set(publications.map(pub => pub.type))];

  const handleSort = (key: 'year' | 'title') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder(key === 'year' ? 'desc' : 'asc');
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Clear search when Escape is pressed
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      e.preventDefault();
    }
  };
  
  // Clear search button
  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...publications];

    // Apply search filter (case insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(query) ||
        pub.abstract.toLowerCase().includes(query) ||
        pub.authors.some(author => author.toLowerCase().includes(query)) ||
        pub.venue.toLowerCase().includes(query) ||
        pub.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    // Apply theme filter
    if (themeFilter !== 'all') {
      filtered = filtered.filter(pub => pub.themeIds?.includes(themeFilter));
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(pub => pub.type === typeFilter);
    }

    // Apply year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter(pub => pub.year === parseInt(yearFilter));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'year') {
        return sortOrder === 'asc'
          ? a.year - b.year
          : b.year - a.year;
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

    onFilteredPublications(filtered, searchQuery.trim());
  }, [publications, searchQuery, themeFilter, typeFilter, yearFilter, sortBy, sortOrder, onFilteredPublications]);

  // Apply filters when any filter/sort option changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [sortBy, sortOrder, themeFilter, typeFilter, yearFilter, searchQuery, applyFiltersAndSort]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Only close if clicking outside the dropdown containers
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          id="publications-search"
          ref={searchInputRef}
          type="search"
          className="w-full rounded-md border border-gray-200 bg-white p-3 pl-10 text-sm text-gray-950 transition-colors placeholder:text-gray-500 focus:border-brand-500 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500"
          placeholder="Search publications"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
        />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-3 text-sm lg:flex-row">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap lg:flex-1">
          {/* Theme Filter */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(showDropdown === 'theme' ? null : 'theme');
              }}
              className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-800 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-white/[0.06] md:w-56"
            >
              <span className="truncate">
                Theme: {themeFilter === 'all' ? 'All' : themes.find(t => t.id === themeFilter)?.title.split(':')[0] || 'All'}
              </span>
              <ChevronDown size={16} className="ml-1 flex-shrink-0" />
            </button>

            {showDropdown === 'theme' && (
              <div className="absolute z-50 mt-1 max-h-96 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-950 md:w-80">
                <div
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThemeFilter('all');
                    setShowDropdown(null);
                  }}
                >
                  <div className="flex items-center">
                    <span className="flex-1">All Themes</span>
                    {themeFilter === 'all' && <Check size={16} />}
                  </div>
                </div>
                {themes.map(theme => (
                  <div
                    key={theme.id}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setThemeFilter(theme.id);
                      setShowDropdown(null);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="flex-1 text-sm">{theme.title}</span>
                      {themeFilter === theme.id && <Check size={16} className="flex-shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(showDropdown === 'type' ? null : 'type');
              }}
              className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-800 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-white/[0.06] md:w-40"
            >
              <span>Type: {typeFilter === 'all' ? 'All' : typeFilter}</span>
              <ChevronDown size={16} />
            </button>
            
            {showDropdown === 'type' && (
              <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-950">
                <div 
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                  onClick={(e) => { 
                    e.stopPropagation();
                    setTypeFilter('all'); 
                    setShowDropdown(null); 
                  }}
                >
                  <div className="flex items-center">
                    <span className="flex-1">All</span>
                    {typeFilter === 'all' && <Check size={16} />}
                  </div>
                </div>
                {types.map(type => (
                  <div 
                    key={type}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                    onClick={(e) => { 
                      e.stopPropagation();
                      setTypeFilter(type); 
                      setShowDropdown(null); 
                    }}
                  >
                    <div className="flex items-center">
                      <span className="flex-1">{type}</span>
                      {typeFilter === type && <Check size={16} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Year Filter */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(showDropdown === 'year' ? null : 'year');
              }}
              className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-800 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-white/[0.06] md:w-40"
            >
              <span>Year: {yearFilter === 'all' ? 'All' : yearFilter}</span>
              <ChevronDown size={16} />
            </button>
            
            {showDropdown === 'year' && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-950">
                <div 
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                  onClick={(e) => { 
                    e.stopPropagation();
                    setYearFilter('all'); 
                    setShowDropdown(null); 
                  }}
                >
                  <div className="flex items-center">
                    <span className="flex-1">All</span>
                    {yearFilter === 'all' && <Check size={16} />}
                  </div>
                </div>
                {years.map(year => (
                  <div 
                    key={year}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                    onClick={(e) => { 
                      e.stopPropagation();
                      setYearFilter(year.toString()); 
                      setShowDropdown(null); 
                    }}
                  >
                    <div className="flex items-center">
                      <span className="flex-1">{year}</span>
                      {yearFilter === year.toString() && <Check size={16} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sort Options */}
        <div className="flex gap-3">
          <button
            onClick={() => handleSort('year')}
            className={`rounded-md border px-3 py-2 font-medium transition-colors ${
              sortBy === 'year' 
                ? 'border-brand-500 text-brand-700 dark:text-brand-300'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/[0.06]'
            }`}
          >
            Year {sortBy === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          
          <button
            onClick={() => handleSort('title')}
            className={`rounded-md border px-3 py-2 font-medium transition-colors ${
              sortBy === 'title' 
                ? 'border-brand-500 text-brand-700 dark:text-brand-300'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/[0.06]'
            }`}
          >
            Title {sortBy === 'title' && (sortOrder === 'asc' ? 'A-Z' : 'Z-A')}
          </button>
        </div>
      </div>
    </div>
  );
} 
