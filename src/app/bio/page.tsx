import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { getLabInfo } from "@/lib/data";
import { withBasePath } from "@/lib/with-base-path";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Bio",
  description: "Learn about Dr. Luis A. Garcia, principal investigator of IoTrust Lab at the University of Utah.",
  path: "/bio",
  image: "/images/social/profile-lag.png",
});

export default async function BioPage() {
  const labInfo = await getLabInfo();

  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="Bio"
        title={labInfo.lead.name}
        lede={`${labInfo.lead.title}, ${labInfo.lead.department}.`}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:px-8 lg:py-16">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-white/[0.055]">
            <Image
              src={withBasePath(labInfo.lead.image)}
              alt={labInfo.lead.name}
              fill
              className="object-cover object-[50%_30%]"
              sizes="(max-width: 1024px) 100vw, 20rem"
              priority
            />
          </div>
        </div>

        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
            Principal Investigator
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
            {labInfo.lead.name}
          </h1>
          <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
            {labInfo.lead.credentials}
          </p>

          <div className="mt-8 border-y border-gray-200 py-7 dark:border-white/10">
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300">
              {labInfo.lead.bio}
            </p>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white">
              Research Focus
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {labInfo.focus_areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-white/[0.07] dark:text-gray-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/people/lag"
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Full Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/15 dark:text-gray-100 dark:hover:border-brand-500 dark:hover:text-brand-200"
            >
              Contact
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
