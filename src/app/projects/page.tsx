import type { Metadata } from "next";
import Link from "next/link";
import projects from "@/data/projects.json";

export const metadata: Metadata = {
  title: "Funded Projects",
  description: "Browse all our funded research projects organized by agency and timeline.",
};

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

export default function ProjectsIndex() {
  const visibleGroups = groupOrder.filter((agency) => groupedProjects[agency].length > 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <h1 className="text-4xl font-semibold">Funded Projects</h1>
      {visibleGroups.map((agency) => (
        <section key={agency} className="space-y-3">
          <h2 className="text-2xl font-semibold">{agency}</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedProjects[agency].map((p) => (
              <li key={p.id} className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">{p.status} • {p.years}</div>
                <Link href={`/research/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                  {p.awardNumber ? ` (${p.awardNumber})` : ""}
                </Link>
                <div className="text-xs text-muted-foreground mt-1">{p.agency}</div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
