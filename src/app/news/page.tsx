import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { createMetadata, SOCIAL_IMAGES } from "@/lib/seo";
import data from "@/data/news.json";
import { withBasePath } from "@/lib/with-base-path";

export const metadata: Metadata = createMetadata({
  title: "News",
  description: "Read IOTrust Lab news, media notes, student awards, research milestones, and publication announcements.",
  path: "/news",
  image: SOCIAL_IMAGES.news,
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function NewsIndex() {
  const items = [...data].sort((a, b) => b.date.localeCompare(a.date));
  const [lead, ...rest] = items;
  const leadImageIsPortrait =
    (lead as { imageLayout?: string } | undefined)?.imageLayout === "portrait";
  const tagCount = new Set(items.flatMap((item) => item.tags ?? [])).size;

  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="News"
        title="A lab record of awards, releases, and research milestones."
        lede="Recent notes from the IOTrust Lab, organized like a running research newspaper."
      >
        <dl className="grid max-w-2xl grid-cols-3 gap-5">
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Posts</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">
              {items.length}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Topics</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">
              {tagCount}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Latest</dt>
            <dd className="mt-1 text-sm font-semibold leading-6 text-gray-950 dark:text-white">
              {lead ? formatDate(lead.date) : "n.d."}
            </dd>
          </div>
        </dl>
      </PageIntro>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {lead ? (
          <Link
            href={`/news/${lead.id}`}
            className="group grid gap-8 border-y border-gray-300 py-8 text-inherit dark:border-white/15 lg:grid-cols-[11rem_minmax(0,1fr)_20rem]"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                Lead Story
              </p>
              <p className="mt-4 text-xl font-semibold text-gray-950 dark:text-white">
                {formatDate(lead.date)}
              </p>
            </div>

            <div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200 sm:text-4xl">
                {lead.title}
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-700 dark:text-gray-300">
                {lead.summary}
              </p>
              {lead.tags?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {lead.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-white/[0.07] dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative min-h-56 overflow-hidden rounded-lg bg-gray-100 dark:bg-white/[0.055]">
              {lead.image ? (
                <Image
                  src={withBasePath(lead.image)}
                  alt={lead.title}
                  fill
                  className={leadImageIsPortrait ? "object-cover object-top" : "object-cover"}
                  sizes="(max-width: 1024px) 100vw, 20rem"
                />
              ) : (
                <div className="flex h-full min-h-56 flex-col justify-between p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                    IOTrust Lab
                  </p>
                  <p className="max-w-44 text-4xl font-semibold leading-none tracking-tight text-gray-950 dark:text-white">
                    Field Notes
                  </p>
                  <ArrowRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-1 dark:text-gray-400" />
                </div>
              )}
            </div>
          </Link>
        ) : null}

        <div className="mt-12 divide-y divide-gray-200 border-b border-gray-200 dark:divide-white/10 dark:border-white/10">
          {rest.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group grid gap-5 py-7 text-inherit transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.035] sm:grid-cols-[9rem_minmax(0,1fr)_2rem]"
            >
              <time className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                {formatDate(item.date)}
              </time>
              <div>
                <h2 className="text-xl font-semibold leading-snug tracking-tight text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                  {item.title}
                </h2>
                <p className="mt-2 max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
                  {item.summary}
                </p>
              </div>
              <ArrowRight className="hidden h-5 w-5 self-center text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600 dark:group-hover:text-brand-300 sm:block" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
