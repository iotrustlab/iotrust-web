import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getLabInfo } from "@/lib/data";
import { withBasePath } from "@/lib/with-base-path";

export const metadata: Metadata = {
  title: "Bio",
  description: "Learn about the lab lead and the vision behind IoTrust Lab.",
};

export default async function BioPage() {
  const labInfo = await getLabInfo();

  return (
    <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Bio
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Meet the principal investigator leading the IoTrust Lab.
          </p>
        </header>

        <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-[220px,1fr] items-start">
            <div className="relative w-48 h-48 mx-auto md:mx-0">
              <Image
                src={withBasePath(labInfo.lead.image)}
                alt={labInfo.lead.name}
                fill
                className="rounded-xl object-cover"
                priority
              />
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                {labInfo.lead.name}
              </h2>
              <p className="mt-2 text-lg text-blue-700 dark:text-blue-300">
                {labInfo.lead.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {labInfo.lead.department}, {labInfo.lead.university}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {labInfo.lead.credentials}
              </p>

              <p className="mt-6 text-gray-700 dark:text-gray-200 leading-7">
                {labInfo.lead.bio}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Research Focus Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {labInfo.focus_areas.map((area) => (
              <span
                key={area}
                className="rounded-md bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-sm text-blue-800 dark:text-blue-200 border border-blue-200/70 dark:border-blue-700/40"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/research"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Explore Research
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Contact
          </Link>
        </section>
      </div>
    </div>
  );
}
