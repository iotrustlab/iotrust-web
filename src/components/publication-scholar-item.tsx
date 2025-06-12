import { Publication } from '@/lib/data';
import { ExternalLink } from 'lucide-react';

interface PublicationScholarItemProps {
  publication: Publication;
  searchQuery?: string;
}

export function PublicationScholarItem({ publication, searchQuery = '' }: PublicationScholarItemProps) {
  // Function to highlight matched text
  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) {
      return text;
    }
    
    // Escape special regex characters in the query
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? 
            <mark key={i} className="bg-yellow-100 dark:bg-yellow-900 text-gray-900 dark:text-gray-100 px-0.5 rounded">
              {part}
            </mark> : 
            part
        )}
      </>
    );
  };

  const authorsFormatted = publication.authors.join(', ');

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-6 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {searchQuery ? highlightMatches(publication.title, searchQuery) : publication.title}
      </h3>
      
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
        {searchQuery ? highlightMatches(authorsFormatted, searchQuery) : authorsFormatted}
      </div>
      
      <div className="flex flex-wrap gap-x-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span className="font-medium">
          {searchQuery ? highlightMatches(publication.venue, searchQuery) : publication.venue}
        </span>
        <span>{publication.year}</span>
        <span className={`${
          publication.type === 'journal' 
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-green-600 dark:text-green-400'
        }`}>
          {publication.type === 'journal' ? 'Journal' : 'Conference'}
        </span>
      </div>
      
      {publication.abstract && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {searchQuery ? highlightMatches(publication.abstract, searchQuery) : publication.abstract}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-2">
        {publication.keywords.map((keyword) => (
          <span 
            key={keyword}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            {searchQuery ? highlightMatches(keyword, searchQuery) : keyword}
          </span>
        ))}
      </div>
      
      <div className="flex items-center gap-4 mt-3">
        {publication.doi && (
          <a
            href={`https://doi.org/${publication.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            DOI: {publication.doi}
          </a>
        )}
        
        {publication.url && (
          <a
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Paper
          </a>
        )}
        
        {publication.citations && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Cited by {publication.citations}
          </span>
        )}
      </div>
    </div>
  );
} 