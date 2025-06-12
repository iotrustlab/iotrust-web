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
      <div className="mb-6">
        <PublicationFilters 
          publications={publications}
          onFilteredPublications={handleFilteredPublications}
        />
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Search results for: <span className="font-semibold">{searchQuery}</span>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((publication) => (
              <PublicationScholarItem 
                key={publication.id} 
                publication={publication}
                searchQuery={searchQuery}
              />
            ))
          ) : (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              No publications found matching your filters.
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredPublications.length} of {publications.length} publications
        {searchQuery && <span> • Press <kbd className="px-1 py-0.5 text-xs border rounded">Esc</kbd> to clear search</span>}
      </div>
    </div>
  );
} 