import type { Metadata } from "next";
import { getPublications } from "@/lib/data";
import { PublicationsClient } from "@/components/publications-client";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Publications",
  description: "Browse our research publications and academic contributions to IoT security.",
};

export default async function PublicationsPage() {
  const publications = await getPublications();
  const years = publications
    .map((publication) => publication.year)
    .filter((year) => typeof year === "number" && year > 0);
  const latestYear = Math.max(...years);
  const earliestYear = Math.min(...years);
  const venues = new Set(publications.map((publication) => publication.venue));
  
  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="Publications"
        title="A searchable index of IoTrust Lab papers and results."
        lede="Filter by theme, type, and year to follow the lab's work across CPS security, sensing, formal methods, and digital twins."
      >
        <dl className="grid max-w-3xl grid-cols-3 gap-3 border-y border-gray-200 py-4 text-sm dark:border-white/10">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Papers</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{publications.length}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Venues</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{venues.size}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Years</dt>
            <dd className="mt-1 whitespace-nowrap text-xl font-semibold text-gray-950 dark:text-white sm:text-2xl">
              {years.length ? `${earliestYear}-${latestYear}` : "n.d."}
            </dd>
          </div>
        </dl>
      </PageIntro>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <PublicationsClient publications={publications} />
      </section>
    </main>
  );
}
