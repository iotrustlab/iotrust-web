import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import {
  getLabInfo,
  getPeopleTypes,
  getPerson,
  getProjectsByPersonId,
} from "@/lib/data";
import { encodeEmailAddress } from "@/lib/email-obfuscation";
import { withBasePath } from "@/lib/with-base-path";
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link";

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

  return {
    title: person.name,
    description: person.bio,
  };
}

function formatProjectId(id: string) {
  return id
    .replace(/^(nsf|nih|darpa)-/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function PersonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [person, labInfo, projects] = await Promise.all([
    getPerson(slug),
    getLabInfo(),
    getProjectsByPersonId(slug),
  ]);

  if (!person) {
    notFound();
  }

  const encodedPersonEmail = encodeEmailAddress(person.email);
  const contactLinks = [
    person.website
      ? {
          label: "Website",
          href: person.website,
          icon: ExternalLink,
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
    icon: typeof ExternalLink;
  }>;

  return (
    <main className="bg-white dark:bg-gray-950">
      <section className="border-b border-gray-200 bg-gray-50 py-12 dark:border-white/10 dark:bg-gray-900/70 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto aspect-[4/5] max-w-[280px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
              <Image
                src={withBasePath(person.image)}
                alt={person.name}
                fill
                className="object-cover object-[50%_30%]"
                sizes="(max-width: 1024px) 280px, 280px"
                priority
              />
            </div>
          </div>

          <div className="order-1 flex flex-col justify-center lg:order-2">
            <Link
              href="/people"
              className="mb-8 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            >
              &larr; Back to People
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600 dark:text-brand-300">
              {person.role}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
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
            {person.bio && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700 dark:text-gray-300">
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
              <div className="mt-4 space-y-3">
                {person.research_questions.map((question) => (
                  <p
                    key={question}
                    className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:border-white/10 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {question}
                  </p>
                ))}
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
        </div>

        <aside className="space-y-8">
          <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              Contact
            </h2>
            <ObfuscatedEmailLink
              encodedEmail={encodedPersonEmail}
              showAddress
              icon
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            />
          </section>

          {person.research_interests?.length ? (
            <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900">
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

          {(projects.length > 0 || person.current_projects?.length) && (
            <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Projects
              </h2>
              <div className="mt-4 space-y-3">
                {projects.length > 0
                  ? projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/research/${project.id}`}
                        className="block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                      >
                        {project.title}
                      </Link>
                    ))
                  : person.current_projects?.map((projectId) => (
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
