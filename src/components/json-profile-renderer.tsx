import Image from 'next/image';
import Link from 'next/link';
import { Mail, Linkedin } from 'lucide-react';

interface SectionContent {
  badges?: string[];
  title?: string;
  education?: boolean;
  funding_grid?: boolean;
  contact_links?: string[];
}

interface Section {
  type: string;
  title?: string;
  content?: string | SectionContent;
}

interface ProfileLayout {
  sections: Section[];
}

interface ProfileStyling {
  badge_colors?: Record<string, string>;
  section_spacing?: string;
  image_size?: string;
}

interface JsonProfileData {
  id: string;
  type: 'project' | 'person';
  variant: string;
  name?: string;
  title?: string;
  email?: string;
  image?: string;
  education?: string;
  linkedin?: string;
  funding?: {
    agency: string;
    amount: string;
    duration: string;
  };
  team?: string[];
  keywords?: string[];
  research_interests?: string[];
  impact?: string;
  publications?: number;
  layout?: ProfileLayout;
  styling?: ProfileStyling;
}

interface JsonProfileProps {
  profile: JsonProfileData;
}

export function JsonProfileRenderer({ profile }: JsonProfileProps) {
  const renderSection = (section: Section, index: number) => {
    const spacing = profile.styling?.section_spacing || "mb-8";
    
    switch (section.type) {
      case 'header':
        const headerContent = section.content as SectionContent;
        return (
          <div key={index} className={spacing}>
            {/* Badges */}
            <div className="flex items-center gap-4 mb-4">
              {headerContent?.badges?.map((badge: string) => {
                const colorClass = profile.styling?.badge_colors?.[badge] || "bg-gray-100 text-gray-600";
                return (
                  <span key={badge} className={`${colorClass} px-3 py-1 rounded-md text-sm font-medium`}>
                    {badge}
                  </span>
                );
              })}
            </div>
            
            {/* Title/Name */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {headerContent?.title || profile.title || profile.name}
            </h1>
            
            {/* Education for people */}
            {headerContent?.education && profile.education && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {profile.education}
              </p>
            )}
            
            {/* Funding grid for projects */}
            {headerContent?.funding_grid && profile.funding && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Funding Agency:</span>
                  <p className="text-gray-600 dark:text-gray-300">{profile.funding.agency}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Amount:</span>
                  <p className="text-gray-600 dark:text-gray-300">{profile.funding.amount}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Duration:</span>
                  <p className="text-gray-600 dark:text-gray-300">{profile.funding.duration}</p>
                </div>
              </div>
            )}
            
            {/* Contact links for people */}
            {headerContent?.contact_links && (
              <div className="flex flex-wrap gap-4">
                {headerContent.contact_links.includes('email') && profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                )}
                {headerContent.contact_links.includes('linkedin') && profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        );
        
      case 'prose':
        return (
          <div key={index} className={`prose prose-lg dark:prose-invert max-w-none ${spacing}`}>
            <h2>{section.title}</h2>
            <p>{section.content as string}</p>
          </div>
        );
        
      case 'team_tags':
        return (
          <div key={index} className={spacing}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <div className="flex flex-wrap gap-2">
              {profile.team?.map((member: string, idx: number) => (
                <span 
                  key={idx}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>
        );
        
      case 'keyword_tags':
        return (
          <div key={index} className={spacing}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <div className="flex flex-wrap gap-2">
              {profile.keywords?.map((keyword: string, idx: number) => (
                <span 
                  key={idx}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-md text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        );
        
      case 'research_interests':
        return (
          <div key={index} className={spacing}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <div className="flex flex-wrap gap-2">
              {profile.research_interests?.map((interest: string, idx: number) => (
                <span 
                  key={idx}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        );
        
      case 'impact_box':
        return (
          <div key={index} className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 ${spacing}`}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">{profile.impact}</p>
            {profile.publications && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">{profile.publications}</span> publications to date
              </div>
            )}
          </div>
        );
        
      case 'contact_box':
        return (
          <div key={index} className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 ${spacing}`}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Email:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{profile.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Office:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">Department of Computer Science and Engineering</span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Institution:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">University of Technology</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div key={index}>Unknown section type: {section.type}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href={profile.type === 'project' ? '/research' : '/people'} 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            ← Back to {profile.type === 'project' ? 'Research' : 'People'}
          </Link>
        </div>

        {/* Person Image for people profiles */}
        {profile.type === 'person' && profile.image && (
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className={`relative ${profile.styling?.image_size || 'w-48 h-48'}`}>
                <Image
                  src={profile.image}
                  alt={profile.name || 'Profile'}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              {profile.layout?.sections?.map((section: Section, index: number) => 
                section.type === 'header' ? renderSection(section, index) : null
              )}
            </div>
          </div>
        )}

        {/* Render all sections */}
        {profile.layout?.sections?.map((section: Section, index: number) => 
          section.type !== 'header' || profile.type !== 'person' ? renderSection(section, index) : null
        )}
      </div>
    </div>
  );
} 