import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import themes from "@/data/themes.json";
import projects from "@/data/projects.json";
import pubs from "@/data/publications.json";
import { withBasePath } from "@/lib/with-base-path";

export const metadata: Metadata = {
  title: "Research",
  description: "Explore our research themes and funded projects in cyber-physical systems security, IoT privacy, and brain-centered computing.",
};

function PublicationTitleLink({ id, title, url }: { id: string; title: string; url?: string }) {
  const cleanUrl = url?.trim();

  if (cleanUrl) {
    return (
      <a
        className="hover:underline"
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
    );
  }

  return (
    <Link className="hover:underline" href={`/publications#${id}`}>
      {title}
    </Link>
  );
}

function FeaturedPubs({ ids, themeId }: { ids: string[]; themeId: string }) {
  // Validate that all featured pub IDs exist in publications.json
  const items = pubs.recentPublications.filter(p => ids?.includes(p.id));
  const foundIds = new Set(items.map(p => p.id));
  const missingIds = ids.filter(id => !foundIds.has(id));

  // Build-time validation: throw error if any IDs are missing
  if (missingIds.length > 0) {
    throw new Error(
      `Theme "${themeId}" references publication IDs that don't exist in publications.json: ${missingIds.join(', ')}\n` +
      `Please verify these IDs exist in src/data/publications.json`
    );
  }

  if (!items.length) return null;

  return (
    <div className="pt-3">
      <h4 className="text-sm font-semibold">Selected publications</h4>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((p) => (
          <li key={p.id}>
            • <PublicationTitleLink id={p.id} title={p.title} url={p.url} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedPubs({ themeId, featuredIds }: { themeId: string; featuredIds: string[] }) {
  // Find publications tagged with this theme (excluding featured ones)
  const related = pubs.recentPublications.filter(p =>
    p.themeIds?.includes(themeId) && !featuredIds.includes(p.id)
  );

  if (!related.length) return null;

  // Show up to 6 related publications
  const displayPubs = related.slice(0, 6);

  return (
    <div className="pt-3">
      <h4 className="text-sm font-semibold">Related publications</h4>
      <ul className="mt-2 space-y-1 text-sm">
        {displayPubs.map((p) => (
          <li key={p.id}>
            • <PublicationTitleLink id={p.id} title={p.title} url={p.url} />
          </li>
        ))}
      </ul>
      {related.length > 6 && (
        <div className="mt-2 text-xs text-muted-foreground">
          + {related.length - 6} more publication{related.length - 6 !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default function ResearchHub() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold">Research</h1>
        <p className="text-muted-foreground max-w-3xl">
          Our work is organized around stable themes that drive innovation in CPS security, IoT privacy,
          digital-twin verification, and brain-centered computing.
        </p>
      </header>

      {themes.map(t => {
        const related = projects.filter(p => t.projectIds.includes(p.id));
        return (
          <section id={t.id} key={t.id} className="space-y-4">
            {t.image && (
              <Link href={`/research/${t.id}`} className="block">
                <div className="relative h-40 w-full rounded-xl overflow-hidden border hover:ring-2 hover:ring-blue-500 transition-all">
                  <Image src={withBasePath(t.image)} alt={t.title} fill className="object-cover" />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              </Link>
            )}
            <h2 className="text-2xl font-semibold">
              <Link href={`/research/${t.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t.title}
              </Link>
            </h2>
            <p className="text-muted-foreground">{t.summary}</p>

            {/* Related projects */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/research/${p.id}`} className="rounded-lg border p-4 hover:bg-muted/10">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{p.agency} • {p.years}</div>
                  <div className="font-medium mt-1">{p.title}</div>
                </Link>
              ))}
            </div>

            {/* Selected publications */}
            <FeaturedPubs ids={t.featuredPubIds} themeId={t.id} />

            {/* Related publications */}
            <RelatedPubs themeId={t.id} featuredIds={t.featuredPubIds} />

            <div className="pt-2 flex flex-wrap gap-4">
              <Link href={`/research/${t.id}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Explore this theme →
              </Link>
              <Link href={`/publications?theme=${t.id}`} className="text-sm hover:underline text-muted-foreground">
                View all publications →
              </Link>
            </div>
          </section>
        );
      })}
    </main>
  );
}
