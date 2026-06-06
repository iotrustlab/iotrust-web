"use client";

import { useState, useEffect, useCallback } from 'react';
import { Publication } from '@/lib/data';
import { PublicationFilters } from './publication-filters';
import { PublicationScholarItem } from './publication-scholar-item';

interface PublicationsClientProps {
  publications: Publication[];
}

export function PublicationsClient({ publications }: PublicationsClientProps) {
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>(
    [...publications].sort((a, b) => b.year - a.year)
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  // Register global keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('publications-search');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFilteredPublications = useCallback((filtered: Publication[], query: string = '') => {
    setFilteredPublications(filtered);
    setSearchQuery(query);
  }, []);

  return (
    <div>
      <div className="mb-8 rounded-lg bg-gray-50 p-4 dark:bg-white/[0.045] sm:p-5">
        <PublicationFilters 
          publications={publications}
          onFilteredPublications={handleFilteredPublications}
        />
        {searchQuery && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Search results for: <span className="font-semibold">{searchQuery}</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-white/10">
        {filteredPublications.length > 0 ? (
          filteredPublications.map((publication) => (
            <PublicationScholarItem
              key={publication.id}
              publication={publication}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            No publications found matching your filters.
          </div>
        )}
      </div>
      
      <div className="mt-5 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredPublications.length} of {publications.length} publications
      </div>
    </div>
  );
}
