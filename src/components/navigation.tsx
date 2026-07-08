'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import LogoMark from '@/components/logo-mark';

type NavigationItem = {
  name: string;
  href: string;
  sectionId?: string;
};

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', sectionId: 'home' },
  { name: 'Research', href: '/research', sectionId: 'research' },
  { name: 'Projects', href: '/projects', sectionId: 'projects' },
  { name: 'News', href: '/news', sectionId: 'news' },
  { name: 'Publications', href: '/publications', sectionId: 'publications' },
  { name: 'Courses', href: '/courses', sectionId: 'courses' },
  { name: 'People', href: '/people', sectionId: 'people' },
  { name: 'Opportunities', href: '/opportunities', sectionId: 'opportunities' },
  { name: 'Contact', href: '/contact', sectionId: 'contact' },
];

function sectionHref(item: NavigationItem) {
  return item.sectionId ? `#${item.sectionId}` : undefined;
}

function homepageSectionHref(item: NavigationItem) {
  if (!item.sectionId) return item.href;
  return item.sectionId === 'home' ? '/' : `/#${item.sectionId}`;
}

function isPathActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation() {
  const pathname = usePathname() ?? '/';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');

  React.useEffect(() => {
    if (pathname !== '/') return;

    const sectionItems = navigation.filter((item) => item.sectionId);
    const sectionIds = new Set(sectionItems.map((item) => item.sectionId));
    let frame: number | null = null;

    const updateActiveSection = () => {
      const marker = window.scrollY + 112;
      let currentSection = 'home';

      for (const item of sectionItems) {
        const sectionId = item.sectionId;
        if (!sectionId) continue;

        const element = document.getElementById(sectionId);
        if (!element) continue;

        if (element.offsetTop <= marker) {
          currentSection = sectionId;
        }
      }

      setActiveSection(currentSection);
    };

    const requestActiveSectionUpdate = () => {
      if (frame !== null) return;

      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateActiveSection();
      });
    };

    const scrollToHashSection = () => {
      const sectionId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (!sectionId || !sectionIds.has(sectionId)) return;

      window.requestAnimationFrame(() => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(sectionId);
      });
    };

    updateActiveSection();
    scrollToHashSection();
    window.addEventListener('scroll', requestActiveSectionUpdate, { passive: true });
    window.addEventListener('resize', requestActiveSectionUpdate);
    window.addEventListener('hashchange', scrollToHashSection);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener('scroll', requestActiveSectionUpdate);
      window.removeEventListener('resize', requestActiveSectionUpdate);
      window.removeEventListener('hashchange', scrollToHashSection);
    };
  }, [pathname]);

  const handleScroll = (item: NavigationItem) => {
    const href = sectionHref(item);
    if (!href || !item.sectionId) return;

    const element = document.getElementById(item.sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', item.sectionId === 'home' ? '/' : href);
      setActiveSection(item.sectionId);
    }

    setMobileMenuOpen(false);
  };

  const isActiveItem = (item: NavigationItem) => {
    if (pathname === '/') {
      return item.sectionId ? activeSection === item.sectionId : false;
    }

    return isPathActive(pathname, item.href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-[color:var(--bg)]/90 backdrop-blur dark:border-white/10">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:h-20 lg:px-6">
        <Link href="/" className="flex min-w-[132px] items-center" aria-label="IOTrust Lab home">
          <LogoMark size={36} className="shrink-0" />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden xl:flex xl:items-center xl:gap-8">
          {navigation.map((item) => {
            const isActive = isActiveItem(item);

            if (item.sectionId && pathname === '/') {
              const href = sectionHref(item)!;

              return (
                <a
                  key={item.name}
                  href={href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleScroll(item);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex h-20 items-center border-b-2 px-1 text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'border-brand-600 text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-brand-300 hover:text-foreground'
                  }`}
                >
                  {item.name}
                </a>
              );
            }
            
            return (
              <Link
                key={item.name}
                href={item.sectionId ? homepageSectionHref(item) : item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex h-20 items-center border-b-2 px-1 text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'border-brand-600 text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-brand-300 hover:text-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Theme toggle and mobile menu button */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="xl:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute inset-x-0 top-20 border-b border-gray-200 bg-[color:var(--bg)] shadow-lg dark:border-white/10 xl:hidden" id="mobile-menu">
            <div className="space-y-1 px-4 pb-4 pt-2">
              {navigation.map((item) => {
                const isActive = isActiveItem(item);

                if (item.sectionId && pathname === '/') {
                  const href = sectionHref(item)!;

                  return (
                    <a
                      key={item.name}
                      href={href}
                      onClick={(event) => {
                        event.preventDefault();
                        handleScroll(item);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block w-full text-left border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors ${
                        isActive
                          ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                          : 'border-transparent text-muted-foreground hover:border-brand-300 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {item.name}
                    </a>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    href={item.sectionId ? homepageSectionHref(item) : item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors ${
                      isActive
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                        : 'border-transparent text-muted-foreground hover:border-brand-300 hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
