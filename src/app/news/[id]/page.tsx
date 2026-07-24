import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import data from "@/data/news.json";
import { articleJsonLd, createMetadata, SOCIAL_IMAGES } from "@/lib/seo";
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

// A body entry is either a paragraph string or a figure block.
type FigureBlock = {
  type: "figure";
  image: string;
  alt: string;
  caption?: string;
  credit?: string;
};
type BodyBlock = string | FigureBlock;

const inlineLinkClass =
  "font-medium text-brand-700 underline decoration-brand-300 underline-offset-[3px] transition-colors hover:text-brand-800 hover:decoration-brand-500 dark:text-brand-300 dark:decoration-brand-500/70 dark:hover:text-brand-200";

// Renders markdown-style [label](url) links inside a plain paragraph string.
// Root-relative links (starting with "/") use next/link; the rest open in a new tab.
function renderInline(text: string): ReactNode[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [full, label, url] = match;
    if (url.startsWith("/")) {
      nodes.push(
        <Link key={key++} href={url} className={inlineLinkClass}>
          {label}
        </Link>
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={inlineLinkClass}
        >
          {label}
        </a>
      );
    }
    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
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

  const socialImage =
    (post as { socialImage?: string }).socialImage || post.image || SOCIAL_IMAGES.news;

  return createMetadata({
    title: post.title,
    description: post.summary,
    path: `/news/${post.id}`,
    image: socialImage,
    imageAlt: post.title,
    type: "article",
    publishedTime: `${post.date}T00:00:00.000Z`,
    modifiedTime: `${post.date}T00:00:00.000Z`,
    authors: ["IOTrust Lab"],
    tags: post.tags,
  });
}

export default async function NewsPost({ params }: PageProps) {
  const { id } = await params;
  const post = data.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  const articleBody: BodyBlock[] = Array.isArray((post as { body?: unknown }).body)
    ? (post as { body: BodyBlock[] }).body
    : [];
  const isPortraitImage =
    (post as { imageLayout?: string }).imageLayout === "portrait";
  const cover = post as {
    coverKicker?: string;
    coverLabel?: string;
    coverNote?: string;
    coverCredit?: string;
  };
  const postForJsonLd = post as typeof post & { socialImage?: string };

  return (
    <main className="bg-white dark:bg-gray-950">
      <JsonLd data={articleJsonLd(postForJsonLd)} />
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
              {isPortraitImage && (cover.coverKicker || cover.coverLabel || cover.coverNote || cover.coverCredit) ? (
                <figcaption className="flex flex-col justify-end border-t border-gray-200 pt-4 text-sm leading-6 text-gray-600 dark:border-white/10 dark:text-gray-400 sm:border-t-0 sm:pt-0">
                  {cover.coverKicker ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                      {cover.coverKicker}
                    </p>
                  ) : null}
                  {cover.coverLabel ? (
                    <p className="mt-2 text-base font-semibold text-gray-950 dark:text-white">
                      {cover.coverLabel}
                    </p>
                  ) : null}
                  {cover.coverNote ? <p className="mt-3">{renderInline(cover.coverNote)}</p> : null}
                  {cover.coverCredit ? (
                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-500">
                      {cover.coverCredit}
                    </p>
                  ) : null}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {articleBody.length ? (
            <section className="mb-10 space-y-7 border-b border-gray-200 pb-8 dark:border-white/10">
              {articleBody.map((block, index) => {
                if (typeof block === "string") {
                  return (
                    <p
                      key={index}
                      className="text-lg leading-9 text-gray-800 dark:text-gray-200"
                    >
                      {renderInline(block)}
                    </p>
                  );
                }

                if (block?.type === "figure") {
                  return (
                    <figure key={index} className="space-y-3 py-1">
                      <div className="overflow-hidden rounded-lg bg-white p-4 ring-1 ring-gray-200 dark:ring-white/10">
                        <Image
                          src={withBasePath(block.image)}
                          alt={block.alt}
                          width={961}
                          height={250}
                          className="h-auto w-full"
                          sizes="(max-width: 1024px) 100vw, 56rem"
                        />
                      </div>
                      {block.caption || block.credit ? (
                        <figcaption className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                          {block.caption ? renderInline(block.caption) : null}
                          {block.credit ? (
                            <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-500">
                              {block.credit}
                            </span>
                          ) : null}
                        </figcaption>
                      ) : null}
                    </figure>
                  );
                }

                return null;
              })}
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
