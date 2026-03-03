import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Building2 } from "lucide-react";
import { getLabInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with IoTrust Lab for collaborations and inquiries.",
};

export default async function ContactPage() {
  const labInfo = await getLabInfo();
  const mapsQuery = encodeURIComponent(
    `${labInfo.university.address.street}, ${labInfo.university.address.city}, ${labInfo.university.address.state} ${labInfo.university.address.zip}`
  );

  return (
    <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Contact
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Reach out for collaborations, advising, and research opportunities.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Primary Contact</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{labInfo.lead.name}</p>
                  <p className="text-gray-600 dark:text-gray-300">{labInfo.lead.title}</p>
                  <a
                    href={`mailto:${labInfo.lead.email}`}
                    className="text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    {labInfo.lead.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                <div className="text-gray-700 dark:text-gray-200">
                  <p>{labInfo.university.department}</p>
                  <p>{labInfo.university.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                <div className="text-gray-700 dark:text-gray-200">
                  <p>{labInfo.university.address.street}</p>
                  <p>
                    {labInfo.university.address.city}, {labInfo.university.address.state}{" "}
                    {labInfo.university.address.zip}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Collaboration Areas</h2>

            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              {labInfo.focus_areas.map((area) => (
                <li key={area} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/opportunities"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                View Opportunities
              </Link>
              <Link
                href="/people"
                className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Meet the Team
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
