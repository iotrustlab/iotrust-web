'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const navigation = [
  { name: 'Home', href: '/', isScroll: false },
  { name: 'Research', href: '#research', isScroll: true },
  { name: 'Publications', href: '/publications', isScroll: false },
  { name: 'People', href: '#people', isScroll: true },
  { name: 'Opportunities', href: '#opportunities', isScroll: true },
  { name: 'Contact', href: '#contact', isScroll: true },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleScroll = (href: string) => {
    if (pathname !== '/') {
      // If not on home page, navigate to home first then scroll
      window.location.href = `/${href}`;
    } else {
      // If on home page, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const isActiveSection = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href.startsWith('#') && pathname === '/') {
      // Could add logic to detect which section is currently in view
      return false;
    }
    return pathname === href;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                IoTrust Lab
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navigation.map((item) => {
              if (item.isScroll) {
                return (
                  <button
                    key={item.name}
                    onClick={() => handleScroll(item.href)}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors border-b-2 ${
                      isActiveSection(item.href)
                        ? 'border-blue-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    isActiveSection(item.href)
                      ? 'border-b-2 border-blue-500 text-gray-900 dark:text-white'
                      : 'border-b-2 border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Theme toggle and mobile menu button */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-controls="mobile-menu"
                aria-expanded="false"
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
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => {
                if (item.isScroll) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleScroll(item.href)}
                      className={`block w-full text-left border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors ${
                        isActiveSection(item.href)
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors ${
                      isActiveSection(item.href)
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100'
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