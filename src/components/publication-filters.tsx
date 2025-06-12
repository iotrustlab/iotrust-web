"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Publication } from '@/lib/data';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface PublicationFiltersProps {
  publications: Publication[];
  onFilteredPublications: (filteredPublications: Publication[], searchQuery?: string) => void;
}

export function PublicationFilters({ publications, onFilteredPublications }: PublicationFiltersProps) {
  const [sortBy, setSortBy] = useState<'year' | 'title'>('year');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get unique years from publications
  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);
  
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
  }, [publications, searchQuery, typeFilter, yearFilter, sortBy, sortOrder, onFilteredPublications]);

  // Apply filters when any filter/sort option changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [sortBy, sortOrder, typeFilter, yearFilter, searchQuery, applyFiltersAndSort]);

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
          className="w-full p-3 pl-10 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by title, authors, keywords... (Ctrl+K)"
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
      
      <div className="flex flex-col md:flex-row gap-3 text-sm">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          {/* Type Filter */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Type dropdown clicked, current state:', showDropdown);
                setShowDropdown(showDropdown === 'type' ? null : 'type');
              }}
              className="flex items-center justify-between px-3 py-2 w-full md:w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span>Type: {typeFilter === 'all' ? 'All' : typeFilter}</span>
              <ChevronDown size={16} />
            </button>
            
            {showDropdown === 'type' && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                <div 
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
                console.log('Year dropdown clicked, current state:', showDropdown);
                setShowDropdown(showDropdown === 'year' ? null : 'year');
              }}
              className="flex items-center justify-between px-3 py-2 w-full md:w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span>Year: {yearFilter === 'all' ? 'All' : yearFilter}</span>
              <ChevronDown size={16} />
            </button>
            
            {showDropdown === 'year' && (
              <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                <div 
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
            className={`px-3 py-2 border rounded-md ${
              sortBy === 'year' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-gray-300 dark:border-gray-700'
            }`}
          >
            Year {sortBy === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          
          <button
            onClick={() => handleSort('title')}
            className={`px-3 py-2 border rounded-md ${
              sortBy === 'title' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-gray-300 dark:border-gray-700'
            }`}
          >
            Title {sortBy === 'title' && (sortOrder === 'asc' ? 'A-Z' : 'Z-A')}
          </button>
        </div>
      </div>
    </div>
  );
} 