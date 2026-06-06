import Link from 'next/link';
import { getLabInfo } from '@/lib/data';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Research', href: '/#research' },
      { label: 'Projects', href: '/#projects' },
      { label: 'News', href: '/#news' },
      { label: 'Publications', href: '/#publications' },
    ],
  },
  {
    title: 'Lab',
    links: [
      { label: 'Courses', href: '/#courses' },
      { label: 'People', href: '/#people' },
      { label: 'Opportunities', href: '/#opportunities' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
];

export async function Footer() {
  const labInfo = await getLabInfo();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="border-t border-gray-200 bg-transparent dark:border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-9 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
              IoTrust Lab
            </p>
            <p className="mt-3 text-2xl font-semibold leading-tight text-gray-950 dark:text-white">
              Evidence for systems that sense, decide, and act in the physical world.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
              {labInfo.university.department}
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-10 sm:gap-14" aria-label="Footer navigation">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {group.title}
                </h2>
                <ul className="mt-3 space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-8 items-center text-base font-medium text-gray-700 transition-colors hover:text-brand-700 dark:text-gray-300 dark:hover:text-brand-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
          <p>© {currentYear} IoTrust Lab, {labInfo.university.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 
