import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Mail, MapPin } from "lucide-react";
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link";
import { PageIntro } from "@/components/page-intro";
import { encodeEmailAddress } from "@/lib/email-obfuscation";
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
  const encodedLeadEmail = encodeEmailAddress(labInfo.lead.email);

  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="Contact"
        title="Reach the IoTrust Lab."
        lede="For collaboration, advising, visits, and research opportunities, start with the principal investigator."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:px-8 lg:py-16">
        <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
          <section className="grid gap-4 py-7 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                {labInfo.lead.name}
              </h2>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                {labInfo.lead.title}
              </p>
              <ObfuscatedEmailLink
                encodedEmail={encodedLeadEmail}
                showAddress
                className="mt-4 inline-flex text-lg font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
              />
            </div>
          </section>

          <section className="grid gap-4 py-7 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
              <Building2 className="h-4 w-4" />
              School
            </div>
            <div className="text-lg leading-8 text-gray-800 dark:text-gray-200">
              <p>{labInfo.university.department}</p>
              <p>{labInfo.university.name}</p>
            </div>
          </section>

          <section className="grid gap-4 py-7 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
              <MapPin className="h-4 w-4" />
              Address
            </div>
            <div className="text-lg leading-8 text-gray-800 dark:text-gray-200">
              <p>{labInfo.university.address.street}</p>
              <p>
                {labInfo.university.address.city}, {labInfo.university.address.state}{" "}
                {labInfo.university.address.zip}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
              >
                Open in Maps
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>

        <aside className="lg:pt-7">
          <div className="border-y border-gray-200 py-6 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              Collaboration Areas
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

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-between gap-3 rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              View Opportunities
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/people"
              className="inline-flex items-center justify-between gap-3 rounded-md border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/15 dark:text-gray-100 dark:hover:border-brand-500 dark:hover:text-brand-200"
            >
              Meet the Team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
