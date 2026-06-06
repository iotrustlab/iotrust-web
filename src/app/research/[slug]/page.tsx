import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  Link as LinkIcon,
  ListChecks,
} from "lucide-react";
import projects from "@/data/projects.json";
import themes from "@/data/themes.json";
import pubs from "@/data/publications.json";
import { createMetadata, SOCIAL_IMAGES } from "@/lib/seo";
import { withBasePath } from "@/lib/with-base-path";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

type Theme = (typeof themes)[number];
type Project = (typeof projects)[number];
type Publication = (typeof pubs.recentPublications)[number];
type ContentType = "theme" | "project";

type ProjectDetails = Project & {
  overview?: string[];
  capabilities?: string[];
  useCases?: string[];
  publicStatus?: string;
  links?: Array<{ label: string; url: string }>;
  figures?: Array<{ image: string; caption?: string }>;
};

function getContentType(slug: string): ContentType | null {
  if (themes.some((theme) => theme.id === slug)) return "theme";
  if (projects.some((project) => project.id === slug)) return "project";
  return null;
}

function displayYear(year: Publication["year"]) {
  return typeof year === "number" && year > 0 ? year : "n.d.";
}

function PublicationTitleLink({ id, title, url }: { id: string; title: string; url?: string }) {
  const cleanUrl = url?.trim();

  if (cleanUrl) {
    return (
      <a
        href={cleanUrl}
        className="text-inherit transition-colors hover:text-brand-700 dark:hover:text-brand-200"
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
      className="text-inherit transition-colors hover:text-brand-700 dark:hover:text-brand-200"
    >
      {title}
    </Link>
  );
}

function statusLabel(status: Project["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusClassName(status: Project["status"]) {
  if (status === "active") {
    return "bg-brand-50 text-brand-700 dark:bg-brand-600/15 dark:text-brand-200";
  }

  if (status === "proposed") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200";
  }

  return "bg-gray-100 text-gray-700 dark:bg-white/[0.07] dark:text-gray-300";
}

function BackLink() {
  return (
    <Link
      href="/research"
      className="inline-flex items-center text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
    >
      &larr; Back to Research
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{value}</dd>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ThemePreviewLink({ theme }: { theme: Theme }) {
  return (
    <Link
      href={`/research/${theme.id}`}
      className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:bg-white/[0.07] dark:text-gray-300 dark:hover:bg-brand-600/15 dark:hover:text-brand-200"
    >
      {theme.title}
    </Link>
  );
}

function PublicationRow({ publication }: { publication: Publication }) {
  return (
    <article className="border-b border-gray-200 py-4 last:border-b-0 dark:border-white/10">
      <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">
        {displayYear(publication.year)} / {publication.venue}
      </p>
      <h3 className="mt-1 text-base font-semibold leading-6 text-gray-950 dark:text-white">
        <PublicationTitleLink id={publication.id} title={publication.title} url={publication.url} />
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        {publication.authors.slice(0, 4).join(", ")}
        {publication.authors.length > 4 ? ", et al." : ""}
      </p>
      {publication.awards?.length ? (
        <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-300">
          {publication.awards.join(" / ")}
        </p>
      ) : null}
    </article>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const contentType = getContentType(slug);

  if (contentType === "theme") {
    const theme = themes.find((item) => item.id === slug)!;
    return createMetadata({
      title: theme.title,
      description: theme.summary,
      path: `/research/${theme.id}`,
      image: SOCIAL_IMAGES.research,
      imageAlt: `${theme.title} research theme at IoTrust Lab`,
    });
  }

  if (contentType === "project") {
    const project = projects.find((item) => item.id === slug)!;
    return createMetadata({
      title: project.title,
      description: project.abstract,
      path: `/research/${project.id}`,
      image: SOCIAL_IMAGES.research,
      imageAlt: `${project.title} project at IoTrust Lab`,
    });
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

  if (contentType === "theme") {
    return <ThemePage themeId={slug} />;
  }

  return <ProjectPage projectId={slug} />;
}

function ThemePage({ themeId }: { themeId: string }) {
  const theme = themes.find((item) => item.id === themeId)!;
  const featuredIds = theme.featuredPubIds ?? [];
  const relatedProjects = projects.filter((project) => theme.projectIds.includes(project.id));
  const featuredPubs = pubs.recentPublications.filter((publication) =>
    featuredIds.includes(publication.id)
  );
  const allThemePubs = pubs.recentPublications.filter((publication) =>
    publication.themeIds?.includes(themeId) && !featuredIds.includes(publication.id)
  );
  const activeProjects = relatedProjects.filter((project) => project.status === "active");
  const completedProjects = relatedProjects.filter((project) => project.status === "completed");
  const publicationCount = featuredPubs.length + allThemePubs.length;

  return (
    <main className="bg-white dark:bg-gray-950">
      <section className="border-b border-gray-200 bg-white py-12 dark:border-white/10 dark:bg-gray-950 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-9 px-6 lg:px-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] xl:items-end">
          <div>
            <BackLink />
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
              Research Theme
            </p>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl">
              {theme.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl sm:leading-9">
              {theme.summary}
            </p>

            <dl className="mt-8 grid max-w-3xl grid-cols-3 gap-3 border-y border-gray-200 py-4 dark:border-white/10">
              <Metric label="Projects" value={relatedProjects.length} />
              <Metric label="Active" value={activeProjects.length} />
              <Metric label="Papers" value={publicationCount} />
            </dl>
          </div>

          {theme.image ? (
            <div className="relative min-h-[18rem] overflow-hidden rounded-lg bg-gray-100 dark:bg-white/[0.045]">
              <Image
                src={withBasePath(theme.image)}
                alt={theme.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 420px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:px-8 lg:py-16 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-14">
          {relatedProjects.length > 0 ? (
            <section className="space-y-5">
              <SectionHeading eyebrow="Funded Work" title="Projects connected to this theme" />
              <div className="border-t border-gray-200 dark:border-white/10">
                {relatedProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/research/${project.id}`}
                    className="group grid gap-4 border-b border-gray-200 py-6 transition-colors hover:bg-gray-50/80 dark:border-white/10 dark:hover:bg-white/[0.035] md:grid-cols-[minmax(0,1fr)_12rem] md:px-4"
                  >
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClassName(project.status)}`}>
                          {statusLabel(project.status)}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-white/[0.07] dark:text-gray-300">
                          {project.years}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold leading-tight text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                        {project.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
                        {project.abstract}
                      </p>
                    </div>
                    <div className="flex items-start justify-between gap-4 md:flex-col">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                        {project.agency}
                      </p>
                      <span className="inline-flex items-center text-sm font-semibold text-brand-600 dark:text-brand-300">
                        Project details
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {featuredPubs.length > 0 ? (
            <section className="space-y-5">
              <SectionHeading eyebrow="Featured Papers" title="Representative publications" />
              <div className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
                {featuredPubs.map((publication) => (
                  <PublicationRow key={publication.id} publication={publication} />
                ))}
              </div>
            </section>
          ) : null}

          {allThemePubs.length > 0 ? (
            <section className="space-y-5">
              <SectionHeading eyebrow="Related Papers" title="More publications in this area" />
              <div className="border-t border-gray-200 dark:border-white/10">
                {allThemePubs.slice(0, 10).map((publication) => (
                  <PublicationRow key={publication.id} publication={publication} />
                ))}
              </div>
              {allThemePubs.length > 10 ? (
                <Link
                  href={`/publications?theme=${themeId}`}
                  className="inline-flex items-center text-base font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                >
                  View all {allThemePubs.length} related publications
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </section>
          ) : null}
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Theme Overview</h2>
            <dl className="mt-4 space-y-4">
              <Metric label="Active projects" value={activeProjects.length} />
              {completedProjects.length > 0 ? (
                <Metric label="Completed projects" value={completedProjects.length} />
              ) : null}
              <Metric label="Publications" value={publicationCount} />
            </dl>
          </section>

          {relatedProjects.length > 0 ? (
            <section className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Funding Agencies</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[...new Set(relatedProjects.map((project) => project.agency))].map((agency) => (
                  <span
                    key={agency}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-white/[0.07] dark:text-gray-300"
                  >
                    {agency}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <Link
            href={`/publications?theme=${themeId}`}
            className="inline-flex w-full items-center justify-center rounded-md bg-brand-600 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Browse publications
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </aside>
      </section>
    </main>
  );
}

function ProjectPage({ projectId }: { projectId: string }) {
  const project = projects.find((item) => item.id === projectId)!;
  const projectDetails = project as ProjectDetails;
  const relatedThemes = themes.filter((theme) => project.themes.includes(theme.id));
  const relatedProjects = projects
    .filter((item) => item.id !== project.id && item.themes.some((themeId) => project.themes.includes(themeId)))
    .slice(0, 3);
  const publicationById = new Map(pubs.recentPublications.map((publication) => [publication.id, publication] as const));
  const selectedPublications = (project.publications ?? [])
    .map((id) => publicationById.get(id))
    .filter((publication): publication is Publication => Boolean(publication));

  return (
    <main className="bg-white dark:bg-gray-950">
      <section className="border-b border-gray-200 bg-white py-12 dark:border-white/10 dark:bg-gray-950 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-9 px-6 lg:px-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] xl:items-end">
          <div>
            <BackLink />
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClassName(project.status)}`}>
                {statusLabel(project.status)}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-white/[0.07] dark:text-gray-300">
                {project.agency}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-white/[0.07] dark:text-gray-300">
                {project.years}
              </span>
            </div>

            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl">
              {project.title}
              {project.awardNumber ? ` (${project.awardNumber})` : ""}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl sm:leading-9">
              {project.abstract}
            </p>

            <dl className="mt-8 grid max-w-3xl grid-cols-3 gap-3 border-y border-gray-200 py-4 dark:border-white/10">
              <Metric label="Agency" value={project.agency} />
              <Metric label="Status" value={statusLabel(project.status)} />
              <Metric label="Themes" value={relatedThemes.length} />
            </dl>
          </div>

          {project.heroImage ? (
            <div className="relative min-h-[18rem] overflow-hidden rounded-lg bg-gray-100 dark:bg-white/[0.045]">
              <Image
                src={withBasePath(project.heroImage)}
                alt={project.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1280px) 100vw, 420px"
                priority
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:px-8 lg:py-16 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-14">
          <section className="space-y-5">
            <SectionHeading eyebrow="Overview" title="Project narrative" />
            <div className="max-w-4xl space-y-5 text-base leading-8 text-gray-700 dark:text-gray-300">
              {(projectDetails.overview?.length ? projectDetails.overview : [project.abstract]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          {projectDetails.capabilities?.length ? (
            <section className="space-y-5">
              <SectionHeading eyebrow="Capabilities" title="What the project enables" />
              <div className="grid gap-3 md:grid-cols-2">
                {projectDetails.capabilities.map((item) => (
                  <div key={item} className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.045]">
                    <ListChecks className="h-5 w-5 text-brand-600 dark:text-brand-300" aria-hidden="true" />
                    <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {projectDetails.useCases?.length ? (
            <section className="space-y-5">
              <SectionHeading eyebrow="Use Cases" title="Where this work applies" />
              <div className="border-t border-gray-200 dark:border-white/10">
                {projectDetails.useCases.map((item) => (
                  <p
                    key={item}
                    className="border-b border-gray-200 py-4 text-base leading-7 text-gray-700 dark:border-white/10 dark:text-gray-300"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          {projectDetails.figures?.length ? (
            <section className="space-y-5">
              <SectionHeading eyebrow="Figures" title="Project artifacts" />
              <div className="grid gap-5">
                {projectDetails.figures.map((figure, index) => (
                  <figure
                    key={`${figure.image}-${index}`}
                    className="overflow-hidden rounded-lg bg-gray-50 dark:bg-white/[0.045]"
                  >
                    <div className="relative h-64 sm:h-80 lg:h-96">
                      <Image
                        src={withBasePath(figure.image)}
                        alt={figure.caption ?? `${project.title} figure ${index + 1}`}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 1024px) 100vw, 760px"
                      />
                    </div>
                    {figure.caption ? (
                      <figcaption className="border-t border-gray-200 px-5 py-4 text-sm leading-6 text-gray-600 dark:border-white/10 dark:text-gray-400">
                        {figure.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {selectedPublications.length > 0 ? (
            <section className="space-y-5">
              <SectionHeading eyebrow="Publications" title="Selected papers" />
              <div className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
                {selectedPublications.map((publication) => (
                  <PublicationRow key={publication.id} publication={publication} />
                ))}
              </div>
            </section>
          ) : null}

          {relatedProjects.length > 0 ? (
            <section className="space-y-5">
              <SectionHeading eyebrow="Related Work" title="Nearby projects" />
              <div className="grid gap-4 lg:grid-cols-3">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/research/${relatedProject.id}`}
                    className="group rounded-lg bg-gray-50 p-5 transition-colors hover:bg-gray-100 dark:bg-white/[0.045] dark:hover:bg-white/[0.065]"
                  >
                    <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">
                      {relatedProject.agency} / {relatedProject.years}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                      {relatedProject.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {relatedProject.abstract}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Project Details</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Agency</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-950 dark:text-white">{project.agency}</dd>
              </div>
              {project.awardNumber ? (
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Award number</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-950 dark:text-white">{project.awardNumber}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Duration</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-950 dark:text-white">{project.years}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Team</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-950 dark:text-white">
                  {project.team.join(", ")}
                </dd>
              </div>
            </dl>
          </section>

          {projectDetails.publicStatus ? (
            <section className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Public Status</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {projectDetails.publicStatus}
              </p>
            </section>
          ) : null}

          {relatedThemes.length > 0 ? (
            <section className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Themes</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedThemes.map((theme) => (
                  <ThemePreviewLink key={theme.id} theme={theme} />
                ))}
              </div>
            </section>
          ) : null}

          {projectDetails.links?.length ? (
            <section className="rounded-lg bg-gray-50 p-5 dark:bg-white/[0.045]">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Related Links</h2>
              <div className="mt-4 space-y-3">
                {projectDetails.links.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm font-semibold leading-6 text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    <LinkIcon className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    {link.label}
                    <ExternalLink className="mt-1 h-3 w-3 shrink-0" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <Link
            href="/projects"
            className="inline-flex w-full items-center justify-center rounded-md bg-brand-600 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-500"
          >
            All projects
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </aside>
      </section>
    </main>
  );
}
