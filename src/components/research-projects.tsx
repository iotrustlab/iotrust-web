'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, DollarSign, Users, ExternalLink } from 'lucide-react';

// Simple blur data URL for placeholder
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

// Skeleton placeholder component for project images
function ProjectImageSkeleton({ title }: { title: string }) {
  const initials = title.split(' ').map(word => word[0]).join('').slice(0, 3);
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 flex items-center justify-center">
      <span className="text-blue-600 dark:text-blue-300 font-bold text-2xl">
        {initials}
      </span>
    </div>
  );
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: string;
  image: string;
  funding?: {
    agency: string;
    amount: string;
    duration: string;
  };
  team: string[];
  keywords: string[];
  publications: number;
  impact: string;
}

interface TeamMember {
  id: string;
  name: string;
}

interface ResearchProjectsData {
  featuredProjects: ResearchProject[];
}

export function ResearchProjects() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsResponse, teamResponse] = await Promise.all([
          fetch('/data/research-projects.json'),
          fetch('/api/people')
        ]);
        
        const projectsData: ResearchProjectsData = await projectsResponse.json();
        const teamData = await teamResponse.json();
        
        setProjects(projectsData.featuredProjects);
        setTeamMembers(teamData.people);
      } catch (error) {
        console.error('Failed to load research projects:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleImageError = (projectId: string) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Research Projects</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading research projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Research Projects</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our current research focuses on developing trustworthy and secure cyber-physical systems
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link key={project.id} href={`/research/${project.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                  {!imageErrors[project.id] ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() => handleImageError(project.id)}
                    />
                  ) : (
                    <ProjectImageSkeleton title={project.title} />
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {project.funding && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{project.funding.agency} - ${project.funding.amount}</span>
                      <Calendar className="h-4 w-4 ml-3 mr-1" />
                      <span>{project.funding.duration}</span>
                    </div>
                  )}
                  
                  {project.team && project.team.length > 0 && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Users className="h-4 w-4 mr-1" />
                      <span>
                        {project.team.map(memberId => {
                          const member = teamMembers.find(m => m.id === memberId);
                          return member ? member.name : memberId;
                        }).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.keywords.slice(0, 3).map((keyword) => (
                      <span 
                        key={keyword}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
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
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{project.publications} publications</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 