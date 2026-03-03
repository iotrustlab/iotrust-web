import type { Metadata } from "next";
import { getPrincipalInvestigator, getCurrentTeam, getAlumni } from "@/lib/data";
import { TeamMemberCard } from "@/components/team-member-card";

export const metadata: Metadata = {
  title: "People",
  description: "Meet our talented team of researchers and students working on IoT security.",
};

function byLastName<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aLast = a.name.split(" ").slice(-1)[0] ?? a.name;
    const bLast = b.name.split(" ").slice(-1)[0] ?? b.name;
    return aLast.localeCompare(bLast);
  });
}

export default async function PeoplePage() {
  const [principalInvestigator, currentTeam, alumni] = await Promise.all([
    getPrincipalInvestigator(),
    getCurrentTeam(),
    getAlumni(),
  ]);

  const postdocs = byLastName(currentTeam.filter((m) => m.role.toLowerCase().includes("postdoc")));
  const phdStudents = byLastName(currentTeam.filter((m) => m.role.toLowerCase().includes("phd")));
  const mastersStudents = byLastName(
    currentTeam.filter((m) => m.role.toLowerCase().includes("master"))
  );
  const undergrads = byLastName(
    currentTeam.filter((m) => {
      const role = m.role.toLowerCase();
      return role.includes("undergrad") || role.includes("undergraduate");
    })
  );
  const sortedAlumni = byLastName(alumni);

  return (
    <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            People
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            The researchers, students, and alumni behind IoTrust Lab.
          </p>
        </header>

        {principalInvestigator.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
              Principal Investigator
            </h2>
            <div className="flex justify-center">
              {principalInvestigator.map((member) => (
                <TeamMemberCard key={member.id} member={member} isPI={true} />
              ))}
            </div>
          </section>
        )}

        {postdocs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
              Postdoctoral Researchers
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {postdocs.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {phdStudents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
              PhD Students
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {phdStudents.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {mastersStudents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
              Master&apos;s Students
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {mastersStudents.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {undergrads.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
              Undergraduate Researchers
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {undergrads.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {sortedAlumni.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
              Alumni
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {sortedAlumni.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
