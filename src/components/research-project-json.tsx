import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Users, DollarSign, ExternalLink, Shield, Code, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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

interface ProjectData {
  content: {
    overview: {
      title: string;
      subtitle: string;
      abstract: string;
      heroImage: string;
    };
    objectives: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    methodology: {
      title: string;
      sections: Array<{
        title: string;
        content: string;
      }>;
    };
    timeline: {
      phases: Array<{
        year: string;
        title: string;
        tasks: string[];
        status: 'completed' | 'in-progress' | 'planned';
      }>;
    };
    publications: Array<{
      title: string;
      authors: string[];
      venue: string;
      type: string;
      status: string;
    }>;
    resources: {
      code: Array<{
        name: string;
        url: string;
        description: string;
      }>;
      datasets: Array<{
        name: string;
        url: string;
        description: string;
      }>;
      demos: Array<{
        name: string;
        url: string;
        description: string;
      }>;
    };
    impact: {
      summary: string;
      metrics: Array<{
        label: string;
        value: string;
        description: string;
      }>;
    };
  };
}

interface ResearchProjectJSONProps {
  project: ResearchProject;
  data: ProjectData;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'shield':
      return <Shield className="h-8 w-8" />;
    case 'code':
      return <Code className="h-8 w-8" />;
    case 'flow':
      return <Activity className="h-8 w-8" />;
    default:
      return <CheckCircle className="h-8 w-8" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'in-progress':
      return <Clock className="h-5 w-5 text-blue-500" />;
    case 'planned':
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
    default:
      return <Clock className="h-5 w-5 text-gray-400" />;
  }
};

export function ResearchProjectJSON({ project, data }: ResearchProjectJSONProps) {
  const { content } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <Link
                  href="/research"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  ← Back to Research
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {content.overview.title}
              </h1>
              <p className="text-xl text-blue-600 dark:text-blue-400 mb-6">
                {content.overview.subtitle}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.overview.abstract}
              </p>
              
              {/* Project Info */}
              <div className="mt-8 space-y-4">
                {project.funding && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <DollarSign className="h-5 w-5 mr-3" />
                    <span>{project.funding.agency} - ${project.funding.amount}</span>
                    <Calendar className="h-5 w-5 ml-6 mr-3" />
                    <span>{project.funding.duration}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Users className="h-5 w-5 mr-3" />
                  <span>{project.team.length} team members</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src={content.overview.heroImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Objectives Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Research Objectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.objectives.map((objective, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {getIcon(objective.icon)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {objective.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {objective.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            {content.methodology.title}
          </h2>
          <div className="space-y-8">
            {content.methodology.sections.map((section, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Project Timeline
          </h2>
          <div className="space-y-8">
            {content.timeline.phases.map((phase, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  {getStatusIcon(phase.status)}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    {phase.year}: {phase.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-gray-600 dark:text-gray-300 flex items-start">
                      <span className="mr-2">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Publications
          </h2>
          <div className="space-y-6">
            {content.publications.map((pub, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {pub.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {pub.authors.join(', ')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {pub.venue}
                  </span>
                  <span className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-sm">
                    {pub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Resources & Outputs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Code */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Code & Software
              </h3>
              <div className="space-y-4">
                {content.resources.code.map((resource, index) => (
                  <Link
                    key={index}
                    href={resource.url}
                    className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {resource.name}
                      </h4>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {resource.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Datasets */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Datasets
              </h3>
              <div className="space-y-4">
                {content.resources.datasets.map((resource, index) => (
                  <Link
                    key={index}
                    href={resource.url}
                    className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {resource.name}
                      </h4>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {resource.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Demos */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Demos & Tools
              </h3>
              <div className="space-y-4">
                {content.resources.demos.map((resource, index) => (
                  <Link
                    key={index}
                    href={resource.url}
                    className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {resource.name}
                      </h4>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {resource.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Impact & Outcomes
          </h2>
          <div className="mb-12">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
              {content.impact.summary}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.impact.metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {metric.label}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 