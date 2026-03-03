import data from "@/data/news.json";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { withBasePath } from "@/lib/with-base-path";

export async function generateStaticParams() {
  return data.map((post) => ({
    id: post.id,
  }));
}

export default async function NewsPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = data.find((n) => n.id === id);
  if (!post) return notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <Link href="/news" className="text-sm opacity-80 hover:opacity-100">← Back to News</Link>
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <div className="text-sm text-muted-foreground">{new Date(post.date).toLocaleDateString()}</div>
      {post.image && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border">
          <Image src={withBasePath(post.image)} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <p className="text-base text-muted-foreground">{post.summary}</p>
      {/* Optional: extend with MD/MDX later */}
      {post.tags?.length ? (
        <div className="flex flex-wrap gap-2 pt-4">
          {post.tags.map((t: string) => (
            <span key={t} className="text-xs rounded-md bg-muted px-2 py-1">{t}</span>
          ))}
        </div>
      ) : null}

      {post.links?.length ? (
        <section className="pt-4">
          <h2 className="text-lg font-semibold mb-2">Related Links</h2>
          <ul className="space-y-2">
            {post.links.map((link: { label: string; url: string }) => {
              const isInternal = link.url.startsWith("/");
              return (
                <li key={link.url}>
                  {isInternal ? (
                    <Link href={link.url} className="text-blue-600 hover:underline dark:text-blue-400">
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
