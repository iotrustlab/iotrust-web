import data from "@/data/news.json";
import Link from "next/link";
import Image from "next/image";
import { withBasePath } from "@/lib/with-base-path";

export default function NewsIndex() {
  const items = [...data].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <h1 className="text-4xl font-semibold">News</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((n) => (
          <Link key={n.id} href={`/news/${n.id}`} className="rounded-lg border overflow-hidden hover:bg-muted/10">
            {n.image && (
              <div className="relative h-40 w-full">
                <Image src={withBasePath(n.image)} alt={n.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="text-sm text-muted-foreground">{new Date(n.date).toLocaleDateString()}</div>
              <h2 className="font-medium text-lg leading-snug">{n.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-3">{n.summary}</p>
              {n.tags?.length ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {n.tags.slice(0, 3).map((t: string) => (
                    <span key={t} className="text-xs rounded-md bg-muted px-2 py-1">{t}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
