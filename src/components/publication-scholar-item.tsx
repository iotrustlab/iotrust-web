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
            <mark key={i} className="rounded bg-brand-50 px-0.5 text-gray-950 dark:bg-brand-600/20 dark:text-white">
              {part}
            </mark> : 
            part
        )}
      </>
    );
  };

  const authorsFormatted = publication.authors.join(', ');
  const displayYear = typeof publication.year === 'number' && publication.year > 0 ? publication.year : 'n.d.';

  return (
    <article
      id={publication.id}
      className="group grid gap-4 border-b border-gray-200 py-6 transition-colors hover:bg-gray-50/80 dark:border-white/10 dark:hover:bg-white/[0.035] md:grid-cols-[5.5rem_minmax(0,1fr)] md:px-4"
    >
      <div className="flex items-center gap-3 md:block">
        <p className="text-2xl font-semibold tabular-nums text-gray-950 dark:text-white">
          {displayYear}
        </p>
        <p className="mt-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold capitalize text-gray-700 dark:bg-white/[0.07] dark:text-gray-300 md:mt-2 md:inline-flex">
          {publication.type}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold leading-snug text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
          {searchQuery ? highlightMatches(publication.title, searchQuery) : publication.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {searchQuery ? highlightMatches(authorsFormatted, searchQuery) : authorsFormatted}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          {searchQuery ? highlightMatches(publication.venue, searchQuery) : publication.venue}
        </p>

        {publication.abstract && (
          <p className="mt-3 max-w-5xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            {searchQuery ? highlightMatches(publication.abstract, searchQuery) : publication.abstract}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {publication.keywords.slice(0, 6).map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-white/[0.07] dark:text-gray-300"
            >
              {searchQuery ? highlightMatches(keyword, searchQuery) : keyword}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {publication.doi && (
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-8 items-center text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              DOI
            </a>
          )}

          {publication.url && (
            <a
              href={publication.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-8 items-center text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              View paper
            </a>
          )}

          {publication.citations ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Cited by {publication.citations}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
