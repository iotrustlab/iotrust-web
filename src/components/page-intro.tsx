import type { ReactNode } from 'react';

type PageIntroProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
};

export function PageIntro({ eyebrow, title, lede, children }: PageIntroProps) {
  return (
    <section className="border-b border-gray-200 bg-white py-12 dark:border-white/10 dark:bg-gray-950 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-[1.12] tracking-tight text-gray-950 dark:text-white sm:text-4xl sm:leading-[1.08] lg:text-5xl lg:leading-none">
            {title}
          </h1>
          {lede ? (
            <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
              {lede}
            </p>
          ) : null}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
