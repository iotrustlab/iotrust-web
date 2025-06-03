'use client';

import { useState, useEffect } from 'react';
import { TeamMemberCard } from './team-member-card';
import type { Person } from '@/lib/data';

export function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeamMembers() {
      try {
        const response = await fetch('/api/people');
        const data = await response.json();
        setTeamMembers(data.people);
      } catch (error) {
        console.error('Failed to load team members:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeamMembers();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Meet the researchers driving innovation in trustworthy cyber-physical systems
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
} 