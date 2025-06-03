import { Publication } from '@/lib/data';
import { ExternalLink, Users } from 'lucide-react';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          publication.type === 'journal' 
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
            : publication.type === 'conference'
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
        }`}>
          {publication.type}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{publication.year}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {publication.title}
      </h3>
      
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
        <Users className="h-4 w-4 mr-1" />
        <span className="line-clamp-1">{publication.authors.join(', ')}</span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">
        {publication.venue}
      </p>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {publication.abstract}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {publication.keywords.slice(0, 3).map((keyword) => (
          <span 
            key={keyword}
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            {keyword}
          </span>
        ))}
        {publication.keywords.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{publication.keywords.length - 3} more
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {publication.citations && (
            <span>{publication.citations} citations</span>
          )}
        </div>
        
        {publication.url && (
          <a
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Paper
          </a>
        )}
      </div>
    </div>
  );
} 