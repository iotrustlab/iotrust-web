import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, BriefcaseBusiness } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import themes from "@/data/themes.json";
import projects from "@/data/projects.json";
import pubs from "@/data/publications.json";

export const metadata: Metadata = {
  title: "Research",
  description: "Explore our research themes and funded projects in cyber-physical systems security, IoT privacy, and brain-centered computing.",
};

function PublicationTitleLink({ id, title, url }: { id: string; title: string; url?: string }) {
  const cleanUrl = url?.trim();

  if (cleanUrl) {
    return (
      <a
        className="text-inherit transition-colors hover:text-brand-700 dark:hover:text-brand-200"
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
    );
  }

  return (
    <Link className="text-inherit transition-colors hover:text-brand-700 dark:hover:text-brand-200" href={`/publications#${id}`}>
      {title}
    </Link>
  );
}

function getFeaturedPubs(ids: string[], themeId: string) {
  const items = pubs.recentPublications.filter(p => ids?.includes(p.id));
  const foundIds = new Set(items.map(p => p.id));
  const missingIds = ids.filter(id => !foundIds.has(id));

  if (missingIds.length > 0) {
    throw new Error(
      `Theme "${themeId}" references publication IDs that don't exist in publications.json: ${missingIds.join(', ')}\n` +
      `Please verify these IDs exist in src/data/publications.json`
    );
  }

  return items;
}

function getRelatedPubs(themeId: string, featuredIds: string[]) {
  return pubs.recentPublications.filter(p =>
    p.themeIds?.includes(themeId) && !featuredIds.includes(p.id)
  );
}

function ThemeMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Icon className="h-4 w-4 text-brand-600 dark:text-brand-300" aria-hidden="true" />
      <span>{value} {label}</span>
    </div>
  );
}

export default function ResearchHub() {
  const activeProjectCount = projects.filter((project) => project.status === "active").length;
  const themePublicationCount = new Set(
    pubs.recentPublications.flatMap((publication) => publication.themeIds ?? [])
  ).size;

  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="Research"
        title="Research themes with projects, papers, and implementation paths."
        lede="Browse the lab's major research directions and follow each theme into funded work and publications."
      >
        <dl className="grid max-w-3xl grid-cols-3 gap-3 border-y border-gray-200 py-4 text-sm dark:border-white/10">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Themes</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{themes.length}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Active projects</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{activeProjectCount}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Tagged areas</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{themePublicationCount}</dd>
          </div>
        </dl>
      </PageIntro>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="space-y-10">
          {themes.map((theme) => {
            const related = projects.filter(project => theme.projectIds.includes(project.id));
            const featuredIds = theme.featuredPubIds ?? [];
            const featuredPubs = getFeaturedPubs(featuredIds, theme.id);
            const relatedPubs = getRelatedPubs(theme.id, featuredIds);
            const displayPubs = [...featuredPubs, ...relatedPubs].slice(0, 4);

            return (
              <section
                id={theme.id}
                key={theme.id}
                className="grid gap-7 border-b border-gray-200 pb-10 dark:border-white/10 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                    Research Theme
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight text-gray-950 dark:text-white sm:text-4xl">
                    <Link href={`/research/${theme.id}`} className="text-gray-950 transition-colors hover:text-brand-700 dark:text-white dark:hover:text-brand-200">
                      {theme.title}
                    </Link>
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    {theme.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <ThemeMetric icon={BriefcaseBusiness} label="projects" value={related.length} />
                    <ThemeMetric icon={BookOpen} label="publications" value={featuredPubs.length + relatedPubs.length} />
                  </div>
                  <div className="mt-7 flex flex-wrap gap-4">
                    <Link
                      href={`/research/${theme.id}`}
                      className="inline-flex items-center text-base font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                    >
                      Explore theme
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link
                      href={`/publications?theme=${theme.id}`}
                      className="inline-flex items-center text-base font-semibold text-gray-600 transition-colors hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
                    >
                      Theme publications
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                      Linked Projects
                    </h3>
                    <div className="mt-4 space-y-4">
                      {related.length ? related.slice(0, 3).map((project) => (
                        <Link
                          key={project.id}
                          href={`/research/${project.id}`}
                          className="block border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 dark:border-white/10"
                        >
                          <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">
                            {project.agency} / {project.years}
                          </p>
                          <p className="mt-1 text-base font-semibold leading-6 text-gray-950 dark:text-white">
                            {project.title}
                          </p>
                        </Link>
                      )) : (
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                          Related funded work will appear here as this theme develops.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                      Selected Papers
                    </h3>
                    <div className="mt-4 space-y-4">
                      {displayPubs.length ? displayPubs.map((publication) => (
                        <div key={publication.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 dark:border-white/10">
                          <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">
                            {publication.year} / {publication.venue}
                          </p>
                          <p className="mt-1 text-base font-semibold leading-6 text-gray-950 dark:text-white">
                            <PublicationTitleLink id={publication.id} title={publication.title} url={publication.url} />
                          </p>
                        </div>
                      )) : (
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                          Publications connected to this theme will appear here.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
