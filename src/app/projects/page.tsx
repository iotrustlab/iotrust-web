import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { createMetadata, SOCIAL_IMAGES } from "@/lib/seo";
import projects from "@/data/projects.json";

export const metadata: Metadata = createMetadata({
  title: "Funded Projects",
  description: "Browse IOTrust Lab funded research projects organized by agency, status, timeline, and research theme.",
  path: "/projects",
  image: SOCIAL_IMAGES.research,
});

type FundedProject = (typeof projects)[number];
type AgencyGroup = "NSF" | "NIH" | "DARPA" | "Other";

const groupOrder: AgencyGroup[] = ["NSF", "NIH", "DARPA", "Other"];
const statusOrder: Record<FundedProject["status"], number> = {
  active: 0,
  proposed: 1,
  completed: 2,
};

function normalizeAgency(agency: string): AgencyGroup {
  const upper = agency.toUpperCase();
  if (upper.startsWith("NSF")) return "NSF";
  if (upper.startsWith("NIH")) return "NIH";
  if (upper.startsWith("DARPA")) return "DARPA";
  return "Other";
}

function getStartYear(years: string): number {
  const match = years.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function sortProjects(list: FundedProject[]): FundedProject[] {
  return [...list].sort((a, b) => {
    const statusCmp = statusOrder[a.status] - statusOrder[b.status];
    if (statusCmp !== 0) return statusCmp;

    const yearCmp = getStartYear(b.years) - getStartYear(a.years);
    if (yearCmp !== 0) return yearCmp;

    return a.title.localeCompare(b.title);
  });
}

const groupedProjects = sortProjects(projects).reduce(
  (acc: Record<AgencyGroup, FundedProject[]>, project) => {
    const agency = normalizeAgency(project.agency);
    acc[agency].push(project);
    return acc;
  },
  { NSF: [], NIH: [], DARPA: [], Other: [] }
);

function statusLabel(status: FundedProject["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusClassName(status: FundedProject["status"]) {
  if (status === "active") {
    return "bg-brand-50 text-brand-700 dark:bg-brand-600/15 dark:text-brand-200";
  }

  if (status === "proposed") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200";
  }

  return "bg-gray-100 text-gray-700 dark:bg-white/[0.07] dark:text-gray-300";
}

export default function ProjectsIndex() {
  const visibleGroups = groupOrder.filter((agency) => groupedProjects[agency].length > 0);
  const activeCount = projects.filter((project) => project.status === "active").length;
  const agencyCount = visibleGroups.length;
  const yearRange = sortProjects(projects)
    .map((project) => getStartYear(project.years))
    .filter(Boolean);
  const earliestYear = Math.min(...yearRange);
  const latestYear = Math.max(...yearRange);

  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="Projects"
        title="Funded systems work, from formal stacks to field testbeds."
        lede="A structured index of IOTrust Lab projects by agency, status, and timeline."
      >
        <dl className="grid max-w-3xl grid-cols-3 gap-3 border-y border-gray-200 py-4 text-sm dark:border-white/10">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Projects</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{projects.length}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Active</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{activeCount}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Agencies</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{agencyCount}</dd>
          </div>
        </dl>
        {yearRange.length ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Timeline coverage: {earliestYear}-{latestYear}
          </p>
        ) : null}
      </PageIntro>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="space-y-14">
          {visibleGroups.map((agency) => (
            <section
              key={agency}
              className="grid gap-5 xl:grid-cols-[13rem_minmax(0,1fr)]"
              aria-labelledby={`projects-${agency.toLowerCase()}`}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                  Agency
                </p>
                <h2 id={`projects-${agency.toLowerCase()}`} className="mt-2 text-3xl font-semibold text-gray-950 dark:text-white">
                  {agency}
                </h2>
              </div>

              <div className="border-t border-gray-200 dark:border-white/10">
                {groupedProjects[agency].map((project) => (
                  <Link
                    key={project.id}
                    href={`/research/${project.id}`}
                    className="group grid gap-4 border-b border-gray-200 py-6 transition-colors hover:bg-gray-50/80 dark:border-white/10 dark:hover:bg-white/[0.035] md:grid-cols-[minmax(0,1fr)_12rem] md:px-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClassName(project.status)}`}>
                          {statusLabel(project.status)}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-white/[0.07] dark:text-gray-300">
                          {project.years}
                        </span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold leading-tight text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                        {project.title}
                        {project.awardNumber ? ` (${project.awardNumber})` : ""}
                      </h3>
                      <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
                        {project.abstract}
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-4 md:flex-col md:items-start md:justify-start">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                        {project.agency}
                      </p>
                      <span className="inline-flex items-center text-base font-semibold text-brand-600 dark:text-brand-300">
                        Details
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
