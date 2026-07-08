import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import {
  getLabInfo,
  getFundedProjects,
  getPeopleTypes,
  getPerson,
  getProjectsByPersonId,
  getPublications,
  type FundedProject,
  type Person,
  type Publication,
} from "@/lib/data";
import { encodeEmailAddress } from "@/lib/email-obfuscation";
import { withBasePath } from "@/lib/with-base-path";
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link";
import { JsonLd } from "@/components/json-ld";
import { createMetadata, personJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const people = await getPeopleTypes();
  return people.map((person) => ({
    slug: person.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPerson(slug);

  if (!person) {
    return {
      title: "Person Not Found",
    };
  }

  return createMetadata({
    title: person.name,
    description: person.bio,
    path: `/people/${person.id}`,
    image: `/images/social/profile-${person.id}.png`,
    imageAlt: `${person.name}, ${person.role} at IOTrust Lab`,
  });
}

function formatProjectId(id: string) {
  return id
    .replace(/^(nsf|nih|darpa)-/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeAuthorName(name: string) {
  return name
    .toLowerCase()
    .replace(/\b(dr|prof|professor)\.?\s+/g, "")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function publicationMatchesPerson(publication: Publication, person: Person) {
  const aliases = new Set(
    [person.name, ...(person.publication_names ?? [])].map(normalizeAuthorName)
  );

  return publication.authors.some((author) =>
    aliases.has(normalizeAuthorName(author))
  );
}

export default async function PersonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [person, labInfo, teamProjects, allProjects, publications] = await Promise.all([
    getPerson(slug),
    getLabInfo(),
    getProjectsByPersonId(slug),
    getFundedProjects(),
    getPublications(),
  ]);

  if (!person) {
    notFound();
  }

  const encodedPersonEmail = encodeEmailAddress(person.email);
  const personPublications = publications
    .filter((publication) => publicationMatchesPerson(publication, person))
    .sort((a, b) => b.year - a.year);
  const projectById = new Map(allProjects.map((project) => [project.id, project]));
  const linkedProjects = [
    ...teamProjects,
    ...(person.current_projects ?? [])
      .map((projectId) => projectById.get(projectId))
      .filter((project) => project && !teamProjects.some((teamProject) => teamProject.id === project.id)),
  ].filter((project): project is FundedProject => Boolean(project));
  const unresolvedProjectIds = (person.current_projects ?? []).filter(
    (projectId) => !projectById.has(projectId)
  );
  const contactLinks = [
    person.website
      ? {
          label: "Website",
          href: person.website,
          icon: ExternalLink,
        }
      : null,
    person.resume
      ? {
          label: "Resume",
          href: person.resume,
          icon: FileText,
        }
      : null,
    person.linkedin
      ? {
          label: "LinkedIn",
          href: person.linkedin,
          icon: Linkedin,
        }
      : null,
    person.github
      ? {
          label: "GitHub",
          href: person.github,
          icon: Github,
        }
      : null,
    person.google_scholar
      ? {
          label: "Google Scholar",
          href: person.google_scholar,
          icon: ExternalLink,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    href: string;
    icon: LucideIcon;
  }>;

  return (
    <main className="bg-white dark:bg-gray-950">
      <JsonLd data={personJsonLd(person)} />
      <section className="border-b border-gray-200 bg-white py-10 dark:border-white/10 dark:bg-gray-950 sm:py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Link
            href="/people"
            className="inline-flex min-h-8 items-center text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
          >
            &larr; Back to People
          </Link>

          <div className="mt-8 grid gap-7 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600 dark:text-brand-300">
                {person.role}
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.12] tracking-tight text-gray-950 dark:text-white lg:text-5xl lg:leading-none">
                {person.name}
              </h1>
              {person.title && (
                <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
                  {person.title}
                </p>
              )}
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                {person.department ?? labInfo.university.department}, {person.university ?? labInfo.university.name}
              </p>
              {person.advisor && (
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  Advised by{" "}
                  {person.advisor.url ? (
                    <a
                      href={person.advisor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                    >
                      {person.advisor.name}
                    </a>
                  ) : (
                    <span className="font-medium">{person.advisor.name}</span>
                  )}
                </p>
              )}
              {person.bio && (
                <p className="mt-6 max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300 sm:text-lg sm:leading-8">
                  {person.bio}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <ObfuscatedEmailLink
                  encodedEmail={encodedPersonEmail}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </ObfuscatedEmailLink>
                {contactLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/15 dark:text-gray-200 dark:hover:border-brand-500 dark:hover:text-brand-200"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[18rem] overflow-hidden rounded-lg bg-gray-100 dark:bg-white/[0.055] md:mx-0 md:mt-1 md:max-w-none md:justify-self-end lg:mt-2">
              <Image
                src={withBasePath(person.image)}
                alt={person.name}
                fill
                className="object-cover object-[50%_30%]"
                sizes="(max-width: 1024px) 18rem, 22rem"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
        <div className="space-y-10">
          {person.research_statement && (
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Research Statement
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-700 dark:text-gray-300">
                {person.research_statement}
              </p>
            </section>
          )}

          {person.research_questions?.length ? (
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Research Questions
              </h2>
              <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
                {person.research_questions.map((question) => (
                  <p
                    key={question}
                    className="py-4 text-base leading-7 text-gray-700 dark:text-gray-300"
                  >
                    {question}
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          {personPublications.length ? (
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Selected Publications
              </h2>
              <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
                {personPublications.map((publication) => {
                  const publicationLinks = publication.links?.length
                    ? publication.links
                    : publication.url
                      ? [{ label: "Paper", url: publication.url }]
                      : [];

                  return (
                    <article key={publication.id} className="py-5">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-600 dark:text-brand-300">
                        <span>{publication.year}</span>
                        <span>{publication.type}</span>
                        {publication.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm bg-brand-50 px-2 py-1 text-[0.68rem] text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-gray-950 dark:text-white">
                        {publication.url ? (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-brand-700 dark:hover:text-brand-200"
                          >
                            {publication.title}
                          </a>
                        ) : (
                          publication.title
                        )}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {publication.authors.join(", ")}
                      </p>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {publication.venue}
                      </p>
                      {publication.abstract && (
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                          {publication.abstract}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                        {publicationLinks.map((link) => (
                          <a
                            key={`${publication.id}-${link.label}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-8 items-center gap-1.5 text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                          >
                            {link.label}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ))}
                        <Link
                          href={`/publications#${publication.id}`}
                          className="inline-flex min-h-8 items-center text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
                        >
                          Publication index
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {person.education?.length ? (
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Education
              </h2>
              <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
                {person.education.map((education) => (
                  <div key={`${education.degree}-${education.institution}`} className="py-4">
                    <p className="font-medium text-gray-950 dark:text-white">
                      {education.degree}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {education.institution} ({education.year})
                    </p>
                    {education.focus && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {education.focus}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {person.experience?.length ? (
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Experience
              </h2>
              <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
                {person.experience.map((experience) => (
                  <div
                    key={`${experience.position}-${experience.institution}-${experience.duration}`}
                    className="grid gap-2 py-5 sm:grid-cols-[150px_minmax(0,1fr)]"
                  >
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-500">
                      {experience.duration}
                    </p>
                    <div>
                      <p className="font-medium text-gray-950 dark:text-white">
                        {experience.position}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {experience.institution}
                        {experience.department ? ` · ${experience.department}` : ""}
                      </p>
                      {experience.summary && (
                        <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                          {experience.summary}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-8">
          <section className="border-y border-gray-200 py-5 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              Contact
            </h2>
            <ObfuscatedEmailLink
              encodedEmail={encodedPersonEmail}
              showAddress
              icon
              className="mt-3 inline-flex min-h-8 items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            />
            {(person.office || person.location) && (
              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {person.office && (
                  <p className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {person.office}
                  </p>
                )}
                {person.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {person.location}
                  </p>
                )}
              </div>
            )}
          </section>

          {person.research_interests?.length ? (
            <section className="border-b border-gray-200 pb-5 dark:border-white/10">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Research Interests
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {person.research_interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {(linkedProjects.length > 0 || unresolvedProjectIds.length > 0) && (
            <section className="border-b border-gray-200 pb-5 dark:border-white/10">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Projects
              </h2>
              <div className="mt-4 space-y-3">
                {linkedProjects.length > 0
                  ? linkedProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/research/${project.id}`}
                        className="inline-flex min-h-8 items-center text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                      >
                        {project.title}
                      </Link>
                    ))
                  : unresolvedProjectIds.map((projectId) => (
                      <p key={projectId} className="text-sm text-gray-700 dark:text-gray-300">
                        {formatProjectId(projectId)}
                      </p>
                    ))}
              </div>
            </section>
          )}
        </aside>
      </section>
    </main>
  );
}
