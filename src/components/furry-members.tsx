'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Simple blur data URL for placeholder
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

// Skeleton placeholder component for furry member images
function FurryImageSkeleton({ member }: { member: FurryMember }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-900 flex items-center justify-center rounded-full">
      <span className="text-4xl">
        {member.emoji}
      </span>
    </div>
  );
}

interface FurryMember {
  id: string;
  name: string;
  species: string;
  emoji: string;
  role: string;
  title: string;
  description: string;
  image: string;
}

export function FurryMembers() {
  const [furryMembers, setFurryMembers] = useState<FurryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    async function loadFurryMembers() {
      try {
        const response = await fetch('/data/people-index.json');
        const data = await response.json();
        setFurryMembers(data.furryMembers);
      } catch (error) {
        console.error('Failed to load furry members:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFurryMembers();
  }, []);

  const handleImageError = (memberId: string) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
  };

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Furry Lab Members</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading our special team members...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Furry Lab Members</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Meet our four-legged colleagues who keep the lab running smoothly
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {furryMembers.map((member) => (
            <div key={member.id} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex-shrink-0 relative">
                  {!imageErrors[member.id] ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      sizes="128px"
                      onError={() => handleImageError(member.id)}
                    />
                  ) : (
                    <FurryImageSkeleton member={member} />
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-1">
                {member.role}
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {member.description}
              </p>
              
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  🐾 Essential Team Member
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 