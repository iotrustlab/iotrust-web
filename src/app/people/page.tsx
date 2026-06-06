import type { Metadata } from "next";
import Image from "next/image";
import {
  getAlumni,
  getCurrentTeam,
  getFurryMembers,
  getPrincipalInvestigator,
  type FurryMember,
  type Person,
} from "@/lib/data";
import { PageIntro } from "@/components/page-intro";
import { TeamMemberCard } from "@/components/team-member-card";
import { withBasePath } from "@/lib/with-base-path";

export const metadata: Metadata = {
  title: "People",
  description: "Meet the IoTrust Lab research team, students, alumni, and furry lab members.",
};

function firstNameForSort(name: string) {
  return name
    .replace(/\b(dr|prof|professor)\.?\s+/gi, "")
    .trim()
    .split(/\s+/)[0] ?? name;
}

function byFirstName<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const firstNameCompare = firstNameForSort(a.name).localeCompare(firstNameForSort(b.name));
    return firstNameCompare || a.name.localeCompare(b.name);
  });
}

function PeopleSection({ title, members }: { title: string; members: Person[] }) {
  if (!members.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="shrink-0 text-xl font-semibold text-gray-950 dark:text-white">
          {title}
        </h2>
        <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" aria-hidden="true" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} variant="homepage" />
        ))}
      </div>
    </section>
  );
}

function FurryMemberCard({ member }: { member: FurryMember }) {
  return (
    <article className="grid gap-4 rounded-lg bg-gray-100/70 p-3 dark:bg-white/[0.045] sm:grid-cols-[8rem_minmax(0,1fr)]">
      <div className="relative aspect-square overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800">
        <Image
          src={withBasePath(member.image)}
          alt={member.name}
          fill
          className="object-cover object-[50%_35%]"
          sizes="8rem"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center py-1">
        <h3 className="text-lg font-semibold leading-snug text-gray-950 dark:text-white">
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-300">
          {member.role}
        </p>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {member.description}
        </p>
      </div>
    </article>
  );
}

export default async function PeoplePage() {
  const [principalInvestigator, currentTeam, alumni, furryMembers] = await Promise.all([
    getPrincipalInvestigator(),
    getCurrentTeam(),
    getAlumni(),
    getFurryMembers(),
  ]);

  const sortedPrincipalInvestigator = byFirstName(principalInvestigator);
  const postdocs = byFirstName(currentTeam.filter((m) => m.role.toLowerCase().includes("postdoc")));
  const phdStudents = byFirstName(currentTeam.filter((m) => m.role.toLowerCase().includes("phd")));
  const mastersStudents = byFirstName(
    currentTeam.filter((m) => m.role.toLowerCase().includes("master"))
  );
  const undergrads = byFirstName(
    currentTeam.filter((m) => {
      const role = m.role.toLowerCase();
      return role.includes("undergrad") || role.includes("undergraduate");
    })
  );
  const sortedAlumni = byFirstName(alumni);

  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="People"
        title="Researchers, students, alumni, and lab companions."
        lede="A full index of the IoTrust Lab community, organized by role and sorted by first name for quick scanning."
      >
        <dl className="grid max-w-3xl grid-cols-3 gap-3 border-y border-gray-200 py-4 text-sm dark:border-white/10">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Current team</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">
              {principalInvestigator.length + currentTeam.length}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Alumni</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">
              {alumni.length}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Furry members</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">
              {furryMembers.length}
            </dd>
          </div>
        </dl>
      </PageIntro>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="space-y-14">
          {sortedPrincipalInvestigator.length > 0 ? (
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="shrink-0 text-xl font-semibold text-gray-950 dark:text-white">
                  Principal Investigator
                </h2>
                <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" aria-hidden="true" />
              </div>
              <div className="w-full">
                {sortedPrincipalInvestigator.map((member) => (
                  <TeamMemberCard key={member.id} member={member} isPI variant="homepage" />
                ))}
              </div>
            </section>
          ) : null}

          <PeopleSection title="Postdoctoral Researchers" members={postdocs} />
          <PeopleSection title="PhD Students" members={phdStudents} />
          <PeopleSection title="Master's Students" members={mastersStudents} />
          <PeopleSection title="Undergraduate Researchers" members={undergrads} />
          <PeopleSection title="Alumni" members={sortedAlumni} />

          {furryMembers.length > 0 ? (
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="shrink-0 text-xl font-semibold text-gray-950 dark:text-white">
                  Furry Members
                </h2>
                <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" aria-hidden="true" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {furryMembers.map((member) => (
                  <FurryMemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
