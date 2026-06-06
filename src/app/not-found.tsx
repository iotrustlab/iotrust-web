import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NotFoundInstrumentation } from '@/components/not-found-instrumentation';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="bg-white dark:bg-gray-950">
      <NotFoundInstrumentation />
      <section className="mx-auto flex max-w-7xl px-6 py-7 sm:py-9 lg:px-8 lg:py-10">
        <PageLostIllustration />
      </section>
    </main>
  );
}

function PageLostIllustration() {
  return (
    <div className="relative w-full overflow-hidden rounded-md border border-gray-200 bg-[#f7f5ef] shadow-sm dark:border-white/10 dark:bg-gray-900">
      <div className="absolute inset-x-0 top-0 h-1 bg-brand-600 dark:bg-brand-500" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:44px_44px] dark:bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)]" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-white/90 via-white/35 to-transparent dark:from-gray-950/90 dark:via-gray-950/35 lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-gray-950 dark:via-gray-950/70" />

      <div className="relative z-10 p-6 sm:p-9 lg:grid lg:min-h-[500px] lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,0.68fr)] lg:items-center lg:gap-8 lg:p-12 xl:p-14">
        <div className="max-w-2xl text-left">
          <p className="text-[6.75rem] font-black leading-[0.78] tracking-tight text-gray-950/[0.09] dark:text-white/[0.09] sm:text-[10rem] lg:text-[12rem]">
            404
          </p>
          <h1 className="mt-7 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white sm:mt-9 sm:text-5xl">
            Not the page you were looking for.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8">
            It may have moved, or it may be hiding in a lab notebook with
            excellent handwriting and no forwarding address.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              Return home
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/research/"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-gray-300 bg-white/45 px-4 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-300 hover:bg-white hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-white/15 dark:bg-white/[0.04] dark:text-gray-100 dark:hover:border-brand-500 dark:hover:bg-brand-500/10 dark:hover:text-brand-200"
            >
              Browse research
            </Link>
          </div>
        </div>

        <div className="relative hidden min-h-[340px] lg:block" aria-hidden="true">
        <svg
            className="absolute bottom-0 right-4 h-full max-h-[340px] w-auto text-gray-800 opacity-90 dark:text-gray-100"
          viewBox="0 0 420 300"
          fill="none"
        >
          <path
            d="M34 236H366"
            stroke="currentColor"
            strokeOpacity="0.16"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M96 226H314"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <rect
            x="142"
            y="76"
            width="112"
            height="82"
            rx="18"
            className="fill-white/70 dark:fill-white/10"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="4"
          />
          <path
            d="M172 108H226M172 128H213"
            stroke="currentColor"
            strokeOpacity="0.16"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M236 158C255 150 281 151 302 166C322 180 333 202 332 226"
            stroke="#c5392f"
            strokeOpacity="0.58"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M262 97L332 137V217L262 257L192 217V137L262 97Z"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="5"
          />
          <path
            d="M262 98V178M192 138L262 178L332 138M192 217L262 178L332 217"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="4"
          />
          <circle cx="262" cy="178" r="16" fill="#c5392f" fillOpacity="0.7" />
          <circle cx="332" cy="137" r="8" fill="#c5392f" fillOpacity="0.55" />
          <circle cx="332" cy="217" r="8" fill="#c5392f" fillOpacity="0.42" />
          <circle cx="192" cy="217" r="8" fill="#c5392f" fillOpacity="0.35" />
          <path
            d="M104 226C104 178 128 142 174 125"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M112 226L72 260M126 226L166 260"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
    </div>
  );
}
