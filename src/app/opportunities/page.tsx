import type { Metadata } from "next";
import Link from "next/link";
import { getLabInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Explore research opportunities and join our team at IoTrust Lab.",
};

const tracks = [
  {
    title: "Prospective PhD Students",
    details:
      "Students with interests in CPS security, IoT privacy, formal methods, or trustworthy AI are encouraged to reach out with research background and goals.",
  },
  {
    title: "Postdoctoral Researchers",
    details:
      "We welcome postdoctoral applicants interested in leading projects and mentoring students in cyber-physical systems and trustworthy autonomy.",
  },
  {
    title: "Undergraduate Researchers",
    details:
      "Undergraduates can contribute to active projects through literature reviews, prototyping, data collection, and system evaluation.",
  },
  {
    title: "Collaborators and Visiting Scholars",
    details:
      "We collaborate across academia, industry, and government on resilient autonomous systems, secure infrastructure, and human-in-the-loop intelligence.",
  },
];

export default async function OpportunitiesPage() {
  const labInfo = await getLabInfo();

  return (
    <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Opportunities
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Join us in building trustworthy, resilient cyber-physical systems.
          </p>
        </header>

        <section className="rounded-2xl border border-blue-200/60 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-900/20 p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How to Reach Out</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-200">
            Send a brief email to{" "}
            <a href={`mailto:${labInfo.lead.email}`} className="text-blue-700 dark:text-blue-300 hover:underline">
              {labInfo.lead.email}
            </a>{" "}
            including your CV, interests, and any relevant publications or project links.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {labInfo.focus_areas.map((area) => (
              <span
                key={area}
                className="rounded-md border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-blue-900/30 px-3 py-1.5 text-sm text-blue-900 dark:text-blue-100"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          {tracks.map((track) => (
            <article
              key={track.title}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{track.title}</h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 leading-6">{track.details}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/research"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Explore Current Research
          </Link>
          <Link
            href="/people"
            className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Meet the Team
          </Link>
        </section>
      </div>
    </div>
  );
}
