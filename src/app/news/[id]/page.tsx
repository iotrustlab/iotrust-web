import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import data from "@/data/news.json";
import { withBasePath } from "@/lib/with-base-path";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export async function generateStaticParams() {
  return data.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = data.find((item) => item.id === id);

  if (!post) {
    return {
      title: "News Not Found",
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function NewsPost({ params }: PageProps) {
  const { id } = await params;
  const post = data.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  const articleBody = Array.isArray((post as { body?: unknown }).body)
    ? (post as { body: string[] }).body
    : [];
  const isPortraitImage =
    (post as { imageLayout?: string }).imageLayout === "portrait";

  return (
    <main className="bg-white dark:bg-gray-950">
      <article>
        <header className="border-b border-gray-200 bg-white py-12 dark:border-white/10 dark:bg-gray-950 sm:py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <Link
              href="/news"
              className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            >
              &larr; Back to News
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
              {formatDate(post.date)}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 text-xl leading-9 text-gray-700 dark:text-gray-300">
              {post.summary}
            </p>
            {post.tags?.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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
        </header>

        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
          {post.image ? (
            <figure
              className={
                isPortraitImage
                  ? "mb-10 grid gap-6 border-y border-gray-200 py-8 dark:border-white/10 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]"
                  : "mb-10"
              }
            >
              <div
                className={
                  isPortraitImage
                    ? "relative aspect-[2/3] overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-300 dark:bg-white/[0.055] dark:ring-white/15"
                    : "relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 dark:bg-white/[0.055]"
                }
              >
                <Image
                  src={withBasePath(post.image)}
                  alt={post.title}
                  fill
                  className={isPortraitImage ? "object-cover object-top" : "object-cover"}
                  sizes={
                    isPortraitImage
                      ? "(max-width: 640px) 90vw, 24rem"
                      : "(max-width: 1024px) 100vw, 56rem"
                  }
                  priority
                />
              </div>
              {isPortraitImage ? (
                <figcaption className="flex flex-col justify-end border-t border-gray-200 pt-4 text-sm leading-6 text-gray-600 dark:border-white/10 dark:text-gray-400 sm:border-t-0 sm:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                    Radio Interview
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-950 dark:text-white">
                    KPCW Mountain Money
                  </p>
                  <p className="mt-3">
                    Luis Garcia discussed AI guardrails, Mythos Preview, and why high-capability tools need structured test environments.
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-500">
                    Photo: Kahlert School of Computing
                  </p>
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {articleBody.length ? (
            <section className="mb-10 space-y-7 border-b border-gray-200 pb-8 dark:border-white/10">
              {articleBody.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-lg leading-9 text-gray-800 dark:text-gray-200"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ) : null}

          {post.links?.length ? (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Related Links
              </h2>
              <div className="mt-5 divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
                {post.links.map((link: { label: string; url: string }) => {
                  const isInternal = link.url.startsWith("/");
                  const className =
                    "group flex items-center justify-between gap-4 py-4 text-base font-medium text-gray-950 transition-colors hover:text-brand-700 dark:text-white dark:hover:text-brand-200";

                  if (isInternal) {
                    return (
                      <Link key={link.url} href={link.url} className={className}>
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-300" />
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-300" />
                    </a>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </main>
  );
}
