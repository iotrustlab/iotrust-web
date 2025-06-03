import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getProjects, getProject, Project } from '../../src/lib/data';

interface ProjectPageProps {
  project: Project;
}

export default function ProjectPage({ project }: ProjectPageProps) {
  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <Head>
        <title>{project.title} | IoTrust Lab</title>
        <meta name="description" content={project.description} />
      </Head>
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          {/* Back Link */}
          <div className="mb-8">
            <Link href="/research" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              ← Back to Research
            </Link>
          </div>

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                project.status === 'active' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : project.status === 'completed'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              }`}>
                {project.status}
              </span>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium">
                Native Next.js Page
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h1>
            
            {/* Project Image */}
            <div className="mb-6">
              <Image
                src={project.image}
                alt={project.title}
                width={800}
                height={400}
                className="rounded-lg object-cover w-full h-64"
              />
            </div>
            
            {/* Funding Information - Only show if funding exists */}
            {project.funding && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Funding Agency:</span>
                  <p className="text-gray-600 dark:text-gray-300">{project.funding.agency}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Amount:</span>
                  <p className="text-gray-600 dark:text-gray-300">${project.funding.amount}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Duration:</span>
                  <p className="text-gray-600 dark:text-gray-300">{project.funding.duration}</p>
                </div>
              </div>
            )}
          </div>

          {/* Project Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <h2>Project Overview</h2>
            <p>{project.description}</p>
          </div>

          {/* Research Team */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Research Team</h2>
            <div className="flex flex-wrap gap-2">
              {project.team.map((member, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {project.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-md text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Research Impact</h2>
            <p className="text-gray-700 dark:text-gray-300">{project.impact}</p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">{project.publications}</span> publications to date
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getProjects();
  const nativeProjects = projects.filter(project => project.type === 'native');
  
  const paths = nativeProjects.map((project) => ({
    params: { slug: project.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const project = await getProject(slug);

  if (!project || project.type !== 'native') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project,
    },
  };
}; 