'use client';

import { Person } from '@/lib/data';
import { Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface TeamMemberCardProps {
  member: Person;
}

// Simple blur data URL for placeholder
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

// Skeleton placeholder component
function AvatarSkeleton({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center rounded-full">
      <span className="text-gray-500 dark:text-gray-300 font-semibold text-lg">
        {initials}
      </span>
    </div>
  );
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow group max-w-sm mx-auto">
      <Link href={`/people/${member.id}`} className="block text-center">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 relative">
            {!imageError ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover rounded-full"
                placeholder="blur"
                blurDataURL={blurDataURL}
                sizes="96px"
                onError={() => setImageError(true)}
              />
            ) : (
              <AvatarSkeleton name={member.name} />
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center">
          {member.name}
        </h3>
        
        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-1 text-center">
          {member.role}
        </p>
        
        {member.title && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">
            {member.title}
          </p>
        )}
        
        {member.research_interests && member.research_interests.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap justify-center gap-1">
              {member.research_interests.slice(0, 2).map((interest) => (
                <span 
                  key={interest}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {interest}
                </span>
              ))}
              {member.research_interests.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{member.research_interests.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
      
      <div className="flex justify-center space-x-3 mt-4">
        <a
          href={`mailto:${member.email}`}
          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Send email"
        >
          <Mail className="h-4 w-4" />
        </a>
        
        {member.website && (
          <a
            href={member.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Visit website"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
} 