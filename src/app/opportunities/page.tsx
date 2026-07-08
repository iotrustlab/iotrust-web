import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link";
import { PageIntro } from "@/components/page-intro";
import { encodeEmailAddress } from "@/lib/email-obfuscation";
import { getLabInfo } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Opportunities",
  description: "Explore PhD, undergraduate, postdoctoral, visiting scholar, and collaboration opportunities with IOTrust Lab.",
  path: "/opportunities",
});

const tracks = [
  {
    label: "PhD Students",
    title: "Long-horizon research in CPS security, IoT privacy, formal methods, and trustworthy autonomy.",
    details:
      "Send a concise research statement, CV, transcripts if available, and links to systems, papers, or code that show how you work.",
  },
  {
    label: "Postdocs",
    title: "Project leadership, mentoring, and publication-driven research across trustworthy cyber-physical systems.",
    details:
      "Share the research agenda you want to lead, the communities you publish in, and the students or systems you hope to build around.",
  },
  {
    label: "Undergraduates",
    title: "Hands-on contributions through prototypes, experiments, literature reviews, and testbed evaluation.",
    details:
      "A short note is enough: include your technical background, weekly availability, and one or two topics that genuinely interest you.",
  },
  {
    label: "Collaborators",
    title: "Cross-institution work on resilient autonomy, secure infrastructure, and human-centered sensing.",
    details:
      "Bring a concrete problem, deployment context, dataset, system, or evaluation setting where trustworthy CPS research can matter.",
  },
];

export default async function OpportunitiesPage() {
  const labInfo = await getLabInfo();
  const encodedLeadEmail = encodeEmailAddress(labInfo.lead.email);

  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="Opportunities"
        title="Work with IOTrust Lab."
        lede="The best first email is specific: what you want to study, what you have built, and how it connects to trustworthy CPS."
      >
        <div className="flex flex-wrap gap-3">
          <ObfuscatedEmailLink
            encodedEmail={encodedLeadEmail}
            className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Mail className="h-4 w-4" />
            Email the lab
          </ObfuscatedEmailLink>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/15 dark:text-gray-100 dark:hover:border-brand-500 dark:hover:text-brand-200"
          >
            Current research
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PageIntro>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8 lg:py-16">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
            Paths Into the Lab
          </h2>
          <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
            {tracks.map((track) => (
              <article key={track.label} className="grid gap-4 py-7 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                  {track.label}
                </p>
                <div>
                  <h3 className="text-xl font-semibold leading-snug tracking-tight text-gray-950 dark:text-white">
                    {track.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-gray-700 dark:text-gray-300">
                    {track.details}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="lg:pt-12">
          <div className="border-y border-gray-200 py-6 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              What We Work On
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {labInfo.focus_areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-white/[0.07] dark:text-gray-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 border-b border-gray-200 pb-6 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              Before You Send
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <li>Keep the message short and concrete.</li>
              <li>Include links instead of large attachments when possible.</li>
              <li>Name the research direction you want to join or shape.</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
