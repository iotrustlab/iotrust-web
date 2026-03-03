import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import projects from "@/data/projects.json";
import themes from "@/data/themes.json";
import pubs from "@/data/publications.json";
import { withBasePath } from "@/lib/with-base-path";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Determine if slug is a theme or project
function getContentType(slug: string): 'theme' | 'project' | null {
  if (themes.some(t => t.id === slug)) return 'theme';
  if (projects.some(p => p.id === slug)) return 'project';
  return null;
}

function PublicationTitleLink({ id, title, url }: { id: string; title: string; url?: string }) {
  const cleanUrl = url?.trim();

  if (cleanUrl) {
    return (
      <a
        href={cleanUrl}
        className="hover:text-blue-600 dark:hover:text-blue-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
    );
  }

  return (
    <Link
      href={`/publications#${id}`}
      className="hover:text-blue-600 dark:hover:text-blue-400"
    >
      {title}
    </Link>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const contentType = getContentType(slug);

  if (contentType === 'theme') {
    const theme = themes.find(t => t.id === slug)!;
    return {
      title: theme.title,
      description: theme.summary,
    };
  }

  if (contentType === 'project') {
    const project = projects.find(p => p.id === slug)!;
    return {
      title: project.title,
      description: project.abstract,
    };
  }

  return {
    title: "Not Found",
  };
}

export async function generateStaticParams() {
  const themeParams = themes.map((theme) => ({ slug: theme.id }));
  const projectParams = projects.map((project) => ({ slug: project.id }));
  return [...themeParams, ...projectParams];
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const contentType = getContentType(slug);

  if (!contentType) {
    notFound();
  }

  if (contentType === 'theme') {
    return <ThemePage themeId={slug} />;
  }

  return <ProjectPage projectId={slug} />;
}

// ============================================================
// Theme Page Component
// ============================================================
function ThemePage({ themeId }: { themeId: string }) {
  const theme = themes.find(t => t.id === themeId)!;

  // Get related projects
  const relatedProjects = projects.filter(p => theme.projectIds.includes(p.id));

  // Get featured publications
  const featuredPubs = pubs.recentPublications.filter(p =>
    theme.featuredPubIds?.includes(p.id)
  );

  // Get all publications for this theme (excluding featured)
  const allThemePubs = pubs.recentPublications.filter(p =>
    p.themeIds?.includes(themeId) && !theme.featuredPubIds?.includes(p.id)
  );

  // Count active vs completed projects
  const activeProjects = relatedProjects.filter(p => p.status === 'active');
  const completedProjects = relatedProjects.filter(p => p.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link
                href="/research"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                &larr; Back to Research
              </Link>
            </nav>

            {/* Theme Header */}
            <div className="mb-8">
              <div className="mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Research Theme
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
                {theme.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {theme.summary}
              </p>
            </div>

            {/* Theme Image */}
            {theme.image && (
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-8">
                <Image
                  src={withBasePath(theme.image)}
                  alt={theme.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-12">

                {/* Funded Projects Section */}
                {relatedProjects.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Funded Projects
                    </h2>
                    <div className="space-y-4">
                      {relatedProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/research/${project.id}`}
                          className="block group bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  project.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : project.status === 'completed'
                                    ? 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {project.status}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {project.agency} &bull; {project.years}
                                  {project.awardNumber ? ` • ${project.awardNumber}` : ""}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {project.title}
                                {project.awardNumber ? ` (${project.awardNumber})` : ""}
                              </h3>
                              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                {project.abstract}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* Featured Publications Section */}
                {featuredPubs.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Featured Publications
                    </h2>
                    <div className="space-y-4">
                      {featuredPubs.map((pub) => (
                        <div
                          key={pub.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            <PublicationTitleLink id={pub.id} title={pub.title} url={pub.url} />
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {pub.authors.slice(0, 3).join(", ")}
                            {pub.authors.length > 3 && ", et al."}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {pub.venue} &bull; {pub.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* All Publications Section */}
                {allThemePubs.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Related Publications
                    </h2>
                    <div className="space-y-3">
                      {allThemePubs.slice(0, 10).map((pub) => (
                        <div
                          key={pub.id}
                          className="border-l-2 border-gray-200 dark:border-gray-600 pl-4 py-2"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                            <PublicationTitleLink id={pub.id} title={pub.title} url={pub.url} />
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {pub.venue} &bull; {pub.year}
                          </p>
                        </div>
                      ))}
                    </div>
                    {allThemePubs.length > 10 && (
                      <div className="mt-4">
                        <Link
                          href={`/publications?theme=${themeId}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                        >
                          View all {allThemePubs.length} related publications &rarr;
                        </Link>
                      </div>
                    )}
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Theme Overview
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">{activeProjects.length}</dd>
                    </div>

                    {completedProjects.length > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Projects</dt>
                        <dd className="text-2xl font-bold text-gray-900 dark:text-white">{completedProjects.length}</dd>
                      </div>
                    )}

                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Publications</dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {featuredPubs.length + allThemePubs.length}
                      </dd>
                    </div>

                    {relatedProjects.length > 0 && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Funding Agencies</dt>
                        <dd className="flex flex-wrap gap-2">
                          {[...new Set(relatedProjects.map(p => p.agency))].map(agency => (
                            <span
                              key={agency}
                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                            >
                              {agency}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Link
                      href={`/publications?theme=${themeId}`}
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Browse All Publications
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Research */}
      <div className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <Link
              href="/research"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              &larr; Back to Research
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Project Page Component
// ============================================================
function ProjectPage({ projectId }: { projectId: string }) {
  const project = projects.find(p => p.id === projectId)!;
  const projectDetails = project as typeof project & {
    overview?: string[];
    capabilities?: string[];
    useCases?: string[];
    publicStatus?: string;
    links?: Array<{ label: string; url: string }>;
    figures?: Array<{ image: string; caption?: string }>;
  };

  const relatedThemes = themes.filter(theme => project.themes.includes(theme.id));
  const relatedProjects = projects
    .filter(p => p.id !== project.id && p.themes.some(themeId => project.themes.includes(themeId)))
    .slice(0, 3);
  const publicationById = new Map(pubs.recentPublications.map((pub) => [pub.id, pub] as const));
  const selectedPublications = (project.publications ?? [])
    .map((id) => publicationById.get(id))
    .filter((pub): pub is (typeof pubs.recentPublications)[number] => Boolean(pub));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link
                href="/research"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                &larr; Back to Research
              </Link>
            </nav>

            {/* Project Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : project.status === 'completed'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {project.status}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {project.agency} &bull; {project.years}
                  {project.awardNumber ? ` • ${project.awardNumber}` : ""}
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
                {project.title}
                {project.awardNumber ? ` (${project.awardNumber})` : ""}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {project.abstract}
              </p>
            </div>

            {/* Project Image */}
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-8 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/40">
              <Image
                src={withBasePath(project.heroImage)}
                alt={project.title}
                fill
                className="object-contain p-2 sm:p-3"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Project Overview
                  </h2>

                  {(projectDetails.overview?.length ? projectDetails.overview : [project.abstract]).map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 dark:text-gray-300 mb-4">
                      {paragraph}
                    </p>
                  ))}

                  {projectDetails.capabilities?.length ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                        Key Capabilities
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                        {projectDetails.capabilities.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  {projectDetails.useCases?.length ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                        Example Use Cases
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                        {projectDetails.useCases.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  {projectDetails.figures?.length ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                        Project Figures
                      </h3>
                      <div className="grid grid-cols-1 gap-4 mb-8">
                        {projectDetails.figures.map((figure, idx) => (
                          <figure key={`${figure.image}-${idx}`} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900/40">
                            <div className="relative h-56 sm:h-64 lg:h-72">
                              <Image
                                src={withBasePath(figure.image)}
                                alt={figure.caption ?? `${project.title} figure ${idx + 1}`}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            {figure.caption ? (
                              <figcaption className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                {figure.caption}
                              </figcaption>
                            ) : null}
                          </figure>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {selectedPublications.length > 0 ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                        Selected Publications
                      </h3>
                      <ul className="space-y-4 mb-8">
                        {selectedPublications.map((pub) => (
                          <li key={pub.id} className="border-l-2 border-blue-500 pl-4">
                            <p className="font-medium text-gray-900 dark:text-white">
                              <PublicationTitleLink id={pub.id} title={pub.title} url={pub.url} />
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {pub.authors.join(", ")}
                              {" · "}
                              {pub.venue}
                              {" ("}
                              {pub.year}
                              {")"}
                            </p>
                            {pub.awards?.length ? (
                              <p className="text-sm text-green-700 dark:text-green-300">
                                {pub.awards.join(" • ")}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}


                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Research Themes
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {relatedThemes.map((theme) => (
                      <Link
                        key={theme.id}
                        href={`/research/${theme.id}`}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        {theme.title}
                      </Link>
                    ))}
                  </div>

                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Project Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Agency</dt>
                      <dd className="text-sm text-gray-900 dark:text-white">{project.agency}</dd>
                    </div>

                    {project.awardNumber ? (
                      <div>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Award Number</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{project.awardNumber}</dd>
                      </div>
                    ) : null}

                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</dt>
                      <dd className="text-sm text-gray-900 dark:text-white">{project.years}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</dt>
                      <dd className="text-sm text-gray-900 dark:text-white capitalize">{project.status}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Team</dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {project.team.join(", ")}
                      </dd>
                    </div>

                    {projectDetails.publicStatus ? (
                      <div>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Public Status</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {projectDetails.publicStatus}
                        </dd>
                      </div>
                    ) : null}
                  </div>

                  {projectDetails.links?.length ? (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Related Links</h4>
                      <ul className="space-y-2">
                        {projectDetails.links.map((link, idx) => (
                          <li key={idx}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Related Projects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/research/${relatedProject.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                      {relatedProject.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {relatedProject.agency} &bull; {relatedProject.years}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                      {relatedProject.abstract}
                    </p>
                    <div className="mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        relatedProject.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : relatedProject.status === 'completed'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {relatedProject.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Research */}
      <div className="py-8 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <Link
              href="/research"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              &larr; Back to Research
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
