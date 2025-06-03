import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getPeople, getPerson, Person } from '../../src/lib/data';
import { Mail, ExternalLink, Linkedin, Github } from 'lucide-react';

interface PersonPageProps {
  person: Person;
}

export default function PersonPage({ person }: PersonPageProps) {
  if (!person) {
    return <div>Person not found</div>;
  }

  return (
    <>
      <Head>
        <title>{person.name} | IoTrust Lab</title>
        <meta name="description" content={person.bio} />
      </Head>
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          {/* Back Link */}
          <div className="mb-8">
            <Link href="/people" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              ← Back to People
            </Link>
          </div>

          {/* Person Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm font-medium">
                  {person.role}
                </span>
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium">
                  Native Next.js Page
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {person.name}
              </h1>
              
              {person.title && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                  {person.title}
                </p>
              )}
              
              {person.education && person.education.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {person.education.map((edu, index) => (
                    <div key={index}>
                      {edu.degree} - {edu.institution} ({edu.year})
                      {edu.focus && ` - ${edu.focus}`}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Contact Links */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${person.email}`}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                )}
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {person.github && (
                  <a
                    href={person.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                {person.google_scholar && (
                  <a
                    href={person.google_scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Google Scholar
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <h2>Biography</h2>
            <p>{person.bio}</p>
          </div>

          {/* Research Interests */}
          {person.research_interests && person.research_interests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Research Interests</h2>
              <div className="flex flex-wrap gap-2">
                {person.research_interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Email:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{person.email}</span>
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
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const people = await getPeople();
  const nativePeople = people.filter(person => person.type === 'native');
  
  const paths = nativePeople.map((person) => ({
    params: { slug: person.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const person = await getPerson(slug);

  if (!person || person.type !== 'native') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      person,
    },
  };
}; 