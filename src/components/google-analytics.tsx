'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GA_MEASUREMENT_ID = 'G-MTJJP9RQQV';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const hasHandledInitialPageview = useRef(false);
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isProduction) return;

    if (!hasHandledInitialPageview.current) {
      hasHandledInitialPageview.current = true;
      return;
    }

    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: `${pathname}${window.location.search}`,
    });
  }, [isProduction, pathname]);

  if (!isProduction) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
