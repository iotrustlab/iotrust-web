'use client';

import { Project } from '@/lib/data';
import { Calendar, DollarSign, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ResearchCardProps {
  project: Project;
}

// Placeholder component for project images
function ProjectImagePlaceholder({ title }: { title: string }) {
  const initials = title.split(' ').map(word => word[0]).join('').slice(0, 3);
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 flex items-center justify-center">
      <span className="text-blue-600 dark:text-blue-300 font-bold text-2xl">
        {initials}
      </span>
    </div>
  );
}

export function ResearchCard({ project }: ResearchCardProps) {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'proposed':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <Link href={`/research/${project.id}`}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        {/* Project Image */}
        <div className="relative h-48">
          {!imageError ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <ProjectImagePlaceholder title={project.title} />
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              {/* <span className={`px-2 py-1 rounded text-xs font-medium ${
                project.type === 'native' 
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                  : project.type === 'static'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              }`}>
                {project.type}
              </span> */}
            </div>
            {/* {project.funding && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                ${project.funding.amount}
              </div>
            )} */}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
          
          <div className="space-y-2 mb-4 text-sm">
            {project.funding && (
              <>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium mr-2">Agency:</span>
                  {project.funding.agency}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  {project.funding.duration}
                </div>
              </>
            )}
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4 mr-2" />
              {project.team.length} team members
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {project.keywords.slice(0, 3).map((keyword) => (
              <span 
                key={keyword}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {keyword}
              </span>
            ))}
            {project.keywords.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{project.keywords.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {project.publications} publications
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-800 dark:group-hover:text-blue-300">
              Learn More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 