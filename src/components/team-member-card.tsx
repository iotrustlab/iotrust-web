import { Person } from '@/lib/data';
import { Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TeamMemberCardProps {
  member: Person;
  isPI?: boolean;
}

export function TeamMemberCard({ member, isPI = false }: TeamMemberCardProps) {
  const hasImage = Boolean(member.image);
  const avatarSize = isPI ? "w-48 h-48 md:w-56 md:h-56" : "w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36";
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow group w-[300px] max-w-full mx-auto min-h-[400px] flex flex-col">
      <Link href={`/people/${member.id}`} className="block text-center flex-1 flex flex-col">
        <div className="flex justify-center mb-5">
          <div className={`${avatarSize} rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 relative`}>
            {hasImage && (
              <Image
                src={member.image!}
                alt={member.name}
                fill
                className="object-cover object-[50%_30%] rounded-full"
                sizes="9rem"
              />
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
          <div className="mt-4 flex-1">
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
      
      <div className="flex justify-center space-x-3 mt-5">
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